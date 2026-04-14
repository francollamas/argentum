# Viewport Implementation Plan

## Document Status

- Plan version: `v2`
- Overall status: `review`
- Last updated: `2026-04-14`
- Owner: `apps/client`

## Objective

Implement a deterministic game-style viewport architecture that cleanly separates:

1. World rendering and camera/zoom behavior.
2. Full-screen UI layout behavior.
3. Centered composition for menu/demo screens.
4. HUD composition above the world.

This plan is incremental. Every step must leave the app bootable, visually reviewable, and ready for the next step.

This plan should be executed with minimal user interaction by default. The implementer should proceed step by step autonomously, stop only for required product decisions, blockers, or visual checks where appearance must be judged by a human, and keep context usage small by summarizing progress briefly and re-reading the plan between steps instead of relying on long conversational state.

## Product Goals

The client must behave like a game, not like a responsive web page.

- The Pixi canvas fills the window using PixiJS resize handling.
- The world viewport expands with screen size.
- Zoom-out reveals more real world area instead of scaling UI.
- The map remains clipped to a mask; no stretching and no letterboxing.
- The player remains centered when screen size or zoom changes, except when camera clamping at map edges prevents it.
- World zoom affects only the world layer.
- UI never inherits world transforms.
- Menu/demo screens use a centered composition frame based on `1920x1080`.
- On small screens, centered UI can scale down uniformly within defined limits.
- On ultrawide screens, centered UI remains stable while extra space is treated as background area.
- `DemoHubScreen` remains the entry point and gains a playable map viewport demo with HUD.

## Confirmed Decisions

- Base UI design size: `1920x1080`
- Base UI aspect ratio: `16:9`
- Root full-screen layout component name: `ScreenRoot`
- Full-screen UI layout component name: `UIScreen`
- Centered menu composition component name: `ContentFrame`
- World wrapper component name: `WorldLayer`
- The map demo is reachable from `src/components/screens/DemoHubScreen.tsx`
- Map zoom is programmatic only for now
- Map zoom keeps the player or camera target centered when not clamped
- The map mask remains mandatory
- HUD renders above the map using `@pixi/layout`
- HUD is attached to `UIScreen`, never to `ContentFrame`
- `GameMapDemoScreen` uses the full screen for the world; HUD overlays it but does not reserve world space

## Current Codebase Constraints

These are real constraints from the current client and must be reflected by implementation.

- `src/app/App.tsx` currently renders `LayoutResizer` and `DemoHubScreen`.
- `src/components/layout/LayoutResizer.tsx` currently syncs root layout size from `app.screen.width` and `app.screen.height`.
- `src/components/screens/DemoHubScreen.tsx` currently implements simple local state routing.
- `src/components/screens/demos/ButtonDemoScreen.tsx` and `src/components/screens/demos/LabelDemoScreen.tsx` currently render themselves as full-screen demo surfaces.
- `src/components/game/GameView.tsx` currently uses fixed viewport constants and applies the clipping mask there.
- `src/components/game/GameView.tsx` currently has `MapRenderer` and `DebugOverlay` commented out, so the map demo path does not yet render the real world content.
- `src/utils/viewport.ts` currently calculates visible bounds using fixed viewport constants.
- `src/hooks/useSmoothCamera.ts` currently centers and clamps using fixed viewport constants and global map pixel dimensions.
- `src/components/common/FPSCounter.tsx` currently positions itself using a fixed viewport width.

## Architecture Target

```tsx
App
  ScreenRoot
    CurrentScreen

DemoHubScreen
  UIScreen
    FullScreenBackground
    ContentFrame
      DemoHubContent

GameMapDemoScreen
  WorldLayer
    GameView
  UIScreen
    MapHud
```

`CurrentScreen` is not a component that must be created unless it becomes useful. It means the currently selected screen branch rendered under `ScreenRoot`.

## Deterministic Rules

These rules remove ambiguity from implementation.

### 1. Screen Space

Screen space is the Pixi screen size in CSS pixels.

- `screenWidth = app.screen.width`
- `screenHeight = app.screen.height`
- `screenAspectRatio = screenWidth / screenHeight`

This is the only source of truth for full-screen layout.

### 2. UI Scale Policy

Centered menu screens use uniform downscaling only.

- `UI_DESIGN_WIDTH = 1920`
- `UI_DESIGN_HEIGHT = 1080`
- `MIN_UI_SCALE = 0.5`
- `MAX_UI_SCALE = 1`
- `uiScale = clamp(min(screenWidth / UI_DESIGN_WIDTH, screenHeight / UI_DESIGN_HEIGHT), MIN_UI_SCALE, MAX_UI_SCALE)`

Rules:

- Never upscale above `1`.
- Never scale independently by axis.
- Never stretch UI to fill odd aspect ratios.
- If the screen is smaller than the minimum supported layout, overflow handling is a screen-specific concern; the scale formula remains unchanged.

Current explicit expectation for very small portrait screens:

- With `MIN_UI_SCALE = 0.5`, some centered screens may still overflow horizontally on sizes such as `390x844`.
- That is acceptable for the first implementation as long as behavior is deterministic and visually inspectable.
- Step 13 must treat those sizes as validation targets for graceful degradation, not as a guarantee that every centered screen fits fully without overflow.

### 3. ContentFrame Geometry

`ContentFrame` is only for centered non-game screens.

- `contentFrameDesignWidth = UI_DESIGN_WIDTH`
- `contentFrameDesignHeight = UI_DESIGN_HEIGHT`
- `contentFrameScale = uiScale`
- `contentFrameWidth = round(UI_DESIGN_WIDTH * contentFrameScale)`
- `contentFrameHeight = round(UI_DESIGN_HEIGHT * contentFrameScale)`
- `contentFrameX = floor((screenWidth - contentFrameWidth) / 2)`
- `contentFrameY = floor((screenHeight - contentFrameHeight) / 2)`

Rules:

- `ContentFrame` never exceeds the design size.
- `ContentFrame` owns a fixed design-space layout and is uniformly transformed by `contentFrameScale`; shrinking the frame must not rely on child reflow alone.
- Extra horizontal or vertical space belongs to screen background composition, not to the frame.
- `ContentFrame` does not contain world logic or HUD logic.

### 4. World Viewport Geometry

For `GameMapDemoScreen`, the world viewport fills the screen.

- `worldViewportX = 0`
- `worldViewportY = 0`
- `worldViewportWidth = screenWidth`
- `worldViewportHeight = screenHeight`

This plan does not reserve screen space for HUD. HUD overlays the world.

### 5. Zoom Model

Use explicit zoom constants so the first implementation is deterministic.

- `DEFAULT_WORLD_ZOOM = 1`
- `MIN_WORLD_ZOOM = 0.75`
- `MAX_WORLD_ZOOM = 1.5`
- `WORLD_ZOOM_STEP = 0.25`

Rules:

- Zoom is applied to the world container only.
- UI and HUD never scale with world zoom.
- Visible world size is computed in world pixels:
  - `visibleWorldWidth = worldViewportWidth / worldZoom`
  - `visibleWorldHeight = worldViewportHeight / worldZoom`

### 6. Camera Centering Rule

Camera math must target the center of the visible world rectangle.

- `cameraTargetScreenX = worldViewportWidth / 2`
- `cameraTargetScreenY = worldViewportHeight / 2`

Rules:

- The player remains centered while free camera movement is possible.
- When map bounds are reached, clamping can move the player away from exact center.
- Camera clamping must be based on visible world size after zoom.

### 7. Visible Tile Bounds Rule

Tile culling must be based on visible world size, not raw screen size.

- Convert camera origin plus visible world size into world bounds.
- Convert world bounds into tile bounds.
- Preserve explicit padding per layer type.

### 8. Mask Rule

The world mask clips exactly the world viewport rectangle.

- Mask position: `worldViewportX`, `worldViewportY`
- Mask size: `worldViewportWidth`, `worldViewportHeight`

Rules:

- Mask geometry does not depend on zoom.
- Zoom changes visible content inside the mask, not the mask size.

## Architecture Decisions

These are implementation decisions, not suggestions.

### Viewport State Ownership

Use a dedicated shared store for viewport state.

- Preferred file: `src/store/viewportStore.ts`
- Pure math helpers belong in `src/utils/viewportMetrics.ts` or `src/utils/viewport.ts`
- Constants belong in `src/constants/viewport.ts`

Store responsibilities:

- raw screen width and height
- current world zoom
- selector-friendly access to derived screen and UI metrics
- selector-friendly access to derived world viewport metrics

Suggested store API responsibilities:

- `setScreenSize(width, height)`
- `setWorldZoom(zoom)`
- `zoomIn()`
- `zoomOut()`
- `resetWorldZoom()`

Derived metrics should be exposed through selector-friendly helpers or selectors so consumers can subscribe narrowly instead of forcing broad rerenders.

Helper responsibilities:

- deterministic math only
- no Pixi objects
- no React hooks

Recommended helper split:

- `src/utils/viewportMetrics.ts`: screen space, UI scale, content frame geometry, world viewport geometry, visible world size
- `src/utils/viewport.ts`: world-space visible bounds and tile culling helpers

State ownership rules:

- The store should keep source state minimal: `screenWidth`, `screenHeight`, and `worldZoom`.
- Derived metrics should come from pure helpers and/or store selectors, not duplicated mutable state.
- `viewportStore` must not use persistence.

Component responsibilities:

- `ScreenRoot`: sync Pixi screen size into the store and expose a full-screen layout root
- `UIScreen`: full-screen UI layout surface
- `ContentFrame`: centered menu composition surface with fixed design-space geometry and uniform scaling
- `WorldLayer`: optional world-only wrapper for the world viewport and transform boundary when it owns real responsibility
- `GameView`: map rendering, camera transform, and world mask
- `MapHud`: HUD layout and map demo controls

### Why a Store Instead of a Hook-Only Solution

The same viewport data is consumed by root layout, menu composition, world rendering, camera logic, tile culling, and HUD controls. A shared store keeps those consumers synchronized without duplicate resize subscriptions or duplicated math.

### Naming Rules

- Use `ScreenRoot`, not `LayoutResizer`, once Step 1 is complete.
- Use `UIScreen` only for full-screen UI layout surfaces.
- Use `ContentFrame` only for centered non-game composition.
- Use `WorldLayer` only for world-space wrappers.
- Avoid generic names like `ViewportContainer` unless a new abstraction is truly needed.

### Transparent UI Surface Rule

`UIScreen` is a full-screen layout surface, not a background policy.

- `UIScreen` should be transparent by default.
- Screens that need a background should render it explicitly inside `UIScreen`.
- Gameplay screens must be able to place `UIScreen` above the world without obscuring it.

### Fixed Screen Overlay Rule

Fixed screen overlays are UI, not world content.

- Elements anchored to screen corners or edges, such as `FPSCounter` and similar debug/status overlays, should live in `UIScreen` or another explicit screen-space overlay surface.
- These overlays must not remain inside `GameView` if they conceptually belong to screen space.
- World debug visualizations that track map coordinates may remain in world space, but screen-fixed debug text should follow the shared viewport source.

## Step Status Model

Every step must always have exactly one status.

- `pending`: work not started
- `in_progress`: currently being implemented
- `review`: code complete, checks passed, and waiting only for required user validation
- `blocked`: cannot continue because of an unresolved dependency or decision
- `done`: implemented, verified, and accepted either by automated checks or by required user validation

Transition rules:

1. Before coding a step, update it from `pending` to `in_progress`.
2. After implementation and required checks pass:
   - update it to `done` if no user decision or human visual judgment is required
   - update it to `review` only if user validation is genuinely needed
3. After required user validation, update it from `review` to `done`.
4. If something prevents correct completion, update it to `blocked` and add a short blocker note under that step.

## Step Summary

| Step | Name | Status |
|---|---|---|
| 0 | Create shared viewport metrics model | `done` |
| 1 | Replace `LayoutResizer` with `ScreenRoot` | `done` |
| 2 | Introduce `UIScreen` and `ContentFrame` | `done` |
| 3 | Move `DemoHubScreen` to the new UI architecture | `done` |
| 4 | Add map demo entry and route shell | `done` |
| 5 | Build `GameMapDemoScreen` with explicit world/UI layers | `done` |
| 6 | Add initial responsive HUD | `done` |
| 7 | Replace fixed world viewport dimensions | `done` |
| 8 | Refactor camera centering and clamping | `done` |
| 9 | Make the map mask dynamic | `done` |
| 10 | Add programmatic world zoom | `done` |
| 11 | Make visible tile bounds depend on viewport and zoom | `done` |
| 12 | Tune padding and edge behavior | `review` |
| 13 | Final responsive verification pass | `pending` |

## Implementation Strategy

Follow the steps in order. Prefer one step at a time, but small tightly-coupled implementation-only steps may be batched when doing so reduces overhead and does not hide meaningful visual or architectural checkpoints. Explicit user approval is only required for batching when the batch changes visible behavior in a way that should be reviewed incrementally.

## Autonomy Policy

Default execution mode is autonomous.

1. The implementer should continue through the plan without waiting for user confirmation after every step.
2. Ask the user for input only when one of these is true:
   - a visual result needs human judgment
   - there is a real product or architecture decision to make
   - a blocker prevents safe progress
   - multiple valid approaches have materially different trade-offs
3. If a step is purely structural, refactor-oriented, or mechanically verifiable, complete it, run checks, mark it `done`, and continue.
4. Keep user-facing progress updates short and factual.
5. Prefer re-reading this plan and relevant files over carrying long conversational context across many steps.

## Step 0: Create Shared Viewport Metrics Model

**Status**: `done`

### Goal

Create one source of truth for screen, UI, and world viewport metrics.

### Deliverables

1. Create `src/constants/viewport.ts` with all viewport and zoom constants.
2. Create `src/store/viewportStore.ts`.
3. Create or extend pure math helpers to compute:
    - `screenWidth`
    - `screenHeight`
    - `screenAspectRatio`
    - `uiScale`
    - `contentFrameScale`
    - `contentFrameWidth`
    - `contentFrameHeight`
    - `contentFrameX`
   - `contentFrameY`
   - `worldViewportX`
   - `worldViewportY`
   - `worldViewportWidth`
   - `worldViewportHeight`
    - `worldZoom`
    - `visibleWorldWidth`
    - `visibleWorldHeight`
4. The store must expose selector-friendly derived data, not force every consumer to recompute formulas.
5. Prefer splitting shared math into:
    - `viewportMetrics.ts` for screen/UI/world geometry
    - `viewport.ts` for visible bounds and culling helpers

### Rules

- Step 0 creates the model and store only.
- Step 0 must not change visual behavior except for wiring the future source of truth.
- The store must not subscribe directly to Pixi. `ScreenRoot` owns syncing later.
- The store must not persist viewport state.

### Candidate Files

- `src/store/viewportStore.ts`
- `src/constants/viewport.ts`
- `src/utils/viewport.ts` or `src/utils/viewportMetrics.ts`
- optional `src/utils/viewportMetrics.test.ts`

### Verification

1. The app still boots.
2. The new store and helpers can be inspected or logged during resize preparation.
3. `pnpm linter-check` passes.

### Review Checklist

1. Metrics are centralized and named clearly.
2. No duplicate formulas exist outside the shared helpers.
3. The math matches the deterministic rules above.

---

## Step 1: Replace `LayoutResizer` with `ScreenRoot`

**Status**: `done`

### Goal

Replace the current root layout wrapper with a real full-screen root that syncs screen size into the viewport store.

### Deliverables

1. Create `src/components/layout/ScreenRoot.tsx`.
2. Update `App.tsx` to render `ScreenRoot` instead of `LayoutResizer`.
3. `ScreenRoot` must:
    - read `app.screen.width` and `app.screen.height`
    - write them into `viewportStore`
    - render a full-screen layout container
4. Remove `LayoutResizer.tsx` after migration is complete.

### Rules

- `ScreenRoot` owns the Pixi resize subscription.
- `ScreenRoot` contains no world-specific logic.
- `ScreenRoot` does not apply scaling.

### Candidate Files

- `src/components/layout/ScreenRoot.tsx`
- `src/components/layout/index.ts`
- `src/app/App.tsx`
- `src/components/layout/LayoutResizer.tsx` for removal

### Verification

1. App boots normally.
2. `DemoHubScreen` still renders.
3. Root dimensions track resize correctly.
4. `pnpm linter-check` passes.

### Review Checklist

1. There is exactly one resize subscription for viewport synchronization.
2. `ScreenRoot` is the only full-screen layout root.
3. Old `LayoutResizer` responsibilities are fully migrated.

---

## Step 2: Introduce `UIScreen` and `ContentFrame`

**Status**: `done`

### Goal

Create the two UI layout primitives used by menu screens and HUD screens.

### Deliverables

1. Create `src/components/layout/UIScreen.tsx`.
2. Create `src/components/layout/ContentFrame.tsx`.
3. `UIScreen` must always match `screenWidth` and `screenHeight`.
4. `ContentFrame` must always use the derived geometry from `viewportStore`.

### Rules

- `UIScreen` is full-screen and reusable.
- `ContentFrame` is centered and uniform-scale only.
- `ContentFrame` does not render backgrounds by default.
- `ContentFrame` must not compute layout formulas inline; it consumes shared metrics.

### Candidate Files

- `src/components/layout/UIScreen.tsx`
- `src/components/layout/ContentFrame.tsx`
- `src/components/layout/index.ts`

### Verification

1. A temporary screen can render a full-screen surface and centered frame.
2. On ultrawide, the frame stays centered and stable.
3. On narrow screens, the frame scales down uniformly.
4. `pnpm linter-check` passes.

### Review Checklist

1. `UIScreen` and `ContentFrame` have clear non-overlapping responsibilities.
2. No screen-specific hacks were added.
3. Layout is driven entirely by shared metrics.

---

## Step 3: Move `DemoHubScreen` To The New UI Architecture

**Status**: `done`

### Goal

Create a consistent screen shell so `DemoHubScreen` becomes the first real consumer of `ScreenRoot`, `UIScreen`, and `ContentFrame` without letting local demo routing bypass those wrappers.

### Deliverables

1. Render `DemoHubScreen` inside `UIScreen`.
2. Move the main hub composition into `ContentFrame`.
3. Replace unstable width rules like `width: '80%'` where they make layout unpredictable.
4. Ensure the current demo selection flow does not bypass `UIScreen` and `ContentFrame` when a demo is active.

### Rules

- The outer background belongs to `UIScreen`.
- The centered hub composition belongs to `ContentFrame`.
- The hub must remain game-like, not fluid-web-like.
- If local routing remains inside `DemoHubScreen`, `DemoHubScreen` must stay the shell and decide which inner content to render instead of returning full-screen demo components directly.
- If that becomes awkward, route ownership should move one level up rather than duplicating full-screen wrappers in every demo.

### Candidate Files

- `src/components/screens/DemoHubScreen.tsx`

### Verification

1. Hub remains centered on resize.
2. Buttons do not wrap unpredictably.
3. No black bars appear.
4. Extra ultrawide space is visible outside the frame.
5. `pnpm linter-check` passes.

### Review Checklist

1. The hub clearly demonstrates the new menu architecture.
2. No world viewport logic leaked into menu layout.
3. Composition remains readable at all supported sizes.
4. Demo routing no longer bypasses the shared screen shell.

---

## Step 4: Add Map Demo Entry And Route Shell

**Status**: `done`

### Goal

Add deterministic navigation from the hub to a dedicated map demo route shell.

### Deliverables

1. Add a new hub entry such as `Map + HUD`.
2. Create `GameMapDemoScreen.tsx` as a route shell.
3. Wire routing from `DemoHubScreen` to `GameMapDemoScreen`.

### Rules

- Step 4 creates navigation and screen selection only.
- The new screen can be minimal at this step, but it must be a real component and route target.
- Do not build the full world/UI layering here; that belongs to Step 5.

### Candidate Files

- `src/components/screens/DemoHubScreen.tsx`
- `src/components/screens/demos/GameMapDemoScreen.tsx`

### Verification

1. The new entry appears in the hub.
2. Clicking it enters the new screen.
3. Refresh still returns to the hub, matching current routing behavior.
4. `pnpm linter-check` passes.

### Review Checklist

1. Navigation remains simple and deterministic.
2. Step 4 does not prematurely implement Step 5 behavior.

---

## Step 5: Build `GameMapDemoScreen` With Explicit World/UI Layers

**Status**: `done`

### Goal

Create the real integration screen with clean separation between world and overlay UI.

### Deliverables

1. Build `GameMapDemoScreen` with this structure:

```tsx
WorldLayer
  GameView
UIScreen
  MapHud
```

2. Create `WorldLayer` if the separation is not already clear enough without it.
3. Render the world below the UI.
4. Render the HUD above the world without inheriting world transforms.
5. Restore the base world rendering path inside `GameView` so the map demo shows actual map content before later viewport refinements.
6. Move fixed screen overlays that conceptually belong to UI, such as `FPSCounter`, out of `GameView` and into `UIScreen` or a dedicated overlay child if they remain active.

### Rules

- `WorldLayer` is responsible for world-space boundaries only.
- `UIScreen` is responsible for overlay UI only.
- `UIScreen` remains transparent by default; gameplay overlay UI must not hide the world unless a specific child intentionally draws a background.
- If `WorldLayer` would only forward children without adding clarity, keep the structure in `GameMapDemoScreen` and do not create the extra file yet.
- Because `GameView` currently has `MapRenderer` and `DebugOverlay` commented out, this step must restore the minimum real world render path before using the screen as the viewport integration target.

### Candidate Files

- `src/components/screens/demos/GameMapDemoScreen.tsx`
- `src/components/game/GameView.tsx`
- optional `src/components/game/WorldLayer.tsx`
- optional `src/components/game/MapHud.tsx`
- `src/components/game/MapRenderer.tsx`

### Verification

1. The map screen renders from the hub.
2. HUD renders visually above the map.
3. HUD does not move or scale with world transforms.
4. `pnpm linter-check` passes.

### Review Checklist

1. Layer boundaries are obvious from the code.
2. This screen can be reused as the template for future gameplay screens.

---

## Step 6: Add Initial Responsive HUD

**Status**: `done`

### Goal

Validate full-screen UI overlay behavior with a small real HUD.

### Deliverables

1. Create `MapHud` if it does not already exist.
2. Include at least:
   - a back button
   - one or more placeholder action buttons
   - one label or status element
3. Anchor elements to different edges or corners using `@pixi/layout`.

### Rules

- HUD uses `UIScreen`, never `ContentFrame`.
- HUD must not affect world viewport size.
- HUD must remain stable during resize.
- `UIScreen` remains transparent by default; any HUD background treatment must be explicit and local to HUD elements.

### Candidate Files

- `src/components/game/MapHud.tsx`
- `src/components/screens/demos/GameMapDemoScreen.tsx`

### Verification

1. HUD stays in place across resize.
2. HUD is not affected by world zoom or camera movement.
3. Edge-anchored elements align correctly.
4. `pnpm linter-check` passes.

### Review Checklist

1. HUD proves that overlay UI works without special-case hacks.
2. The composition still feels like game UI.

---

## Step 7: Replace Fixed World Viewport Dimensions

**Status**: `done`

### Goal

Remove active dependence on fixed viewport width and height in world rendering code.

### Deliverables

1. Replace fixed viewport sizing in active world logic with shared metrics.
2. Keep old constants only if they remain useful as fallback defaults for unrelated systems.
3. Remove fixed viewport constants from active culling and world-space calculations.
4. Migrate non-world consumers that still assume the old fixed viewport, such as debug and overlay helpers tied to screen edges.

### Rules

- This step updates consumers of viewport dimensions.
- It does not yet change zoom math beyond using the shared geometry.
- Any remaining fixed viewport constant must be justified by a comment or clearer naming.
- Dynamic viewport consumers must include world rendering, debug helpers, and fixed-position overlays that currently assume `544x416`.

### Candidate Files

- `src/constants/game.ts`
- `src/utils/viewport.ts`
- `src/components/game/GameView.tsx`
- `src/hooks/useSmoothCamera.ts`
- `src/hooks/useDebugVisibleTiles.ts`
- `src/components/debug/DebugOverlay.tsx`
- `src/components/common/FPSCounter.tsx`

### Verification

1. Visible world area changes with screen size.
2. No immediate empty-space or clipping regressions appear.
3. `pnpm linter-check` passes.

### Review Checklist

1. Active world logic no longer depends on `GAME_CONSTANTS.VIEWPORT.DEFAULT_*`.
2. Dynamic viewport geometry comes from one shared source.
3. Fixed-position helpers and overlays no longer assume the legacy viewport width or height.

---

## Step 8: Refactor Camera Centering And Clamping

**Status**: `done`

### Goal

Keep camera behavior correct with dynamic viewport size.

### Deliverables

1. Update camera centering offsets to use `worldViewportWidth` and `worldViewportHeight`.
2. Update camera clamping to use visible world size after zoom.
3. Preserve current smooth camera behavior.
4. Refactor the camera API so camera math can consume real map dimensions from the loaded map instead of relying only on global map constants.

### Rules

- Camera math stays centralized in the camera hook or helper.
- No duplicate centering or clamping formulas in `GameView`.
- Step 8 may prepare for zoom-aware clamping even if zoom controls are added in Step 10.
- Camera clamping must use the loaded map pixel bounds, not only global `GAME_CONSTANTS.MAP.*_PIXELS` assumptions.
- Make that dependency explicit in code: either pass `map` and viewport metrics into `useSmoothCamera`, or move the math into a pure helper with those inputs.

### Candidate Files

- `src/hooks/useSmoothCamera.ts`
- optional `src/utils/viewportMetrics.ts`
- optional `src/hooks/useSmoothCamera.test.ts`

### Verification

1. Player remains centered while moving in unclamped regions.
2. Resize does not break centering.
3. Map edges clamp correctly.
4. `pnpm linter-check` passes.

### Review Checklist

1. Camera math is readable and isolated.
2. Centering and clamping are based on visible world size, not hardcoded viewport defaults.
3. Camera bounds reflect the actual loaded map dimensions.

---

## Step 9: Make The Map Mask Dynamic

**Status**: `done`

### Goal

Preserve clipping behavior while matching the real world viewport rectangle.

### Deliverables

1. Keep the graphics mask in `GameView` unless a more local ownership becomes clearly better.
2. Redraw the mask with `worldViewportX`, `worldViewportY`, `worldViewportWidth`, and `worldViewportHeight`.
3. Ensure mask updates when viewport metrics change.

### Rules

- Mask geometry must not be multiplied by zoom.
- Mask dimensions must exactly match the world viewport rectangle.

### Candidate Files

- `src/components/game/GameView.tsx`

### Verification

1. Mask still clips the map correctly.
2. Resize updates the clip area.
3. No stretching or black bars are introduced.
4. `pnpm linter-check` passes.

### Review Checklist

1. The mask remains a viewport boundary, not a zoom mechanic.
2. The visible world rectangle matches expectations.

---

## Step 10: Add Programmatic World Zoom

**Status**: `done`

### Goal

Apply real world zoom without affecting UI layers.

### Deliverables

1. Use the `worldZoom` state already created in Step 0.
2. Apply zoom to the world container using `scale`.
3. Keep camera centering correct under zoom.
4. Optionally expose temporary HUD buttons for `Zoom In` and `Zoom Out`.

### Rules

- Use the constants defined in this document:
  - `DEFAULT_WORLD_ZOOM = 1`
  - `MIN_WORLD_ZOOM = 0.75`
  - `MAX_WORLD_ZOOM = 1.5`
  - `WORLD_ZOOM_STEP = 0.25`
- Step 10 wires and consumes zoom state; it does not introduce a second zoom source of truth.
- Zoom values must be clamped.
- HUD visuals and layout must remain unchanged during zoom.

### Candidate Files

- `src/components/game/GameView.tsx`
- `src/components/game/MapHud.tsx`
- `src/store/viewportStore.ts`

### Verification

1. Zoom changes only the world.
2. Player remains visually centered except at clamped edges.
3. HUD remains unchanged during zoom.
4. `pnpm linter-check` passes.

### Review Checklist

1. Zoom is implemented on the correct layer.
2. Zoom state ownership is clear and centralized.

---

## Step 11: Make Visible Tile Bounds Depend On Viewport And Zoom

**Status**: `done`

### Goal

Render the correct set of visible tiles for the current viewport and zoom.

### Deliverables

1. Update visible bounds calculation to account for:
   - dynamic world viewport size
   - current world zoom
2. Preserve explicit padding by layer category.
3. Ensure larger screens and zoom-out reveal more real tiles.

### Rules

- Bounds math must work in world space before converting to tile indices.
- Debug overlays that depend on visible bounds must use the same shared calculations.

### Candidate Files

- `src/utils/viewport.ts`
- `src/components/game/MapRenderer.tsx`
- `src/hooks/useDebugVisibleTiles.ts`
- `src/components/debug/DebugOverlay.tsx`
- optional `src/utils/viewport.test.ts`

### Verification

1. Larger screens show more tiles.
2. Zoom-out shows more tiles.
3. Zoom-in shows fewer tiles.
4. No obvious culling gaps appear.
5. `pnpm linter-check` passes.

### Review Checklist

1. Bounds math is based on visible world size, not screen size alone.
2. Padding still prevents large objects from popping in too late.
3. Debug overlays consume the same shared visible-bounds math as the renderer.

---

## Step 12: Tune Padding And Edge Behavior

**Status**: `review`

### Goal

Validate and adjust object padding and edge behavior only where real visual evidence requires it.

### Deliverables

1. Review current padding constants by layer category.
2. Adjust only the constants that prove insufficient.
3. Validate roof fade behavior and large sprites near edges.

### Rules

- This is a tuning step, not a broad refactor.
- Avoid increasing over-rendering without a visible reason.

### Candidate Files

- `src/constants/game.ts`
- `src/components/game/MapRenderer.tsx`
- `src/hooks/useRoofAnimation.ts`

### Verification

1. No obvious pop-in for large sprites.
2. Roof transitions still behave correctly.
3. Edge rendering remains visually correct after zoom changes.
4. `pnpm linter-check` passes.

### Review Checklist

1. Padding changes are minimal and evidence-based.
2. No broad performance regression is introduced.

---

## Step 13: Final Responsive Verification Pass

**Status**: `pending`

### Goal

Validate the final system across representative screen sizes and aspect ratios.

### Menu Screen Sizes

1. `1920x1080`
2. `1600x900`
3. `1366x768`
4. `1280x720`
5. `800x600`
6. `390x844`
7. `844x390`
8. `2560x1080`

### Menu Checks

1. `ContentFrame` stays centered.
2. UI shrinks uniformly only when needed, without relying on ad-hoc child reflow to simulate scaling.
3. Background space expands around the frame.
4. No black bars or stretched content appear.
5. Buttons and panel layout remain coherent.
6. At least one active demo screen still respects the shared screen shell.
7. Very small portrait sizes such as `390x844` degrade deterministically; if overflow remains due to `MIN_UI_SCALE = 0.5`, it is understood and visually reviewable rather than treated as a hidden bug.

### Map Checks

1. Larger screens reveal more tiles.
2. Zoom-out reveals more tiles.
3. Player remains centered except when clamped.
4. Map mask clips correctly.
5. HUD remains stable above the map.
6. HUD remains unaffected by world zoom.
7. Map edge clamping behaves correctly.

### Verification Commands

1. `pnpm linter-check`
2. `pnpm test` if any existing tests are affected
3. Run viewport-related unit tests if pure math or camera helpers were added or changed
4. Optional smoke run if visual verification requires it

### Review Checklist

1. The app now behaves like a game viewport system.
2. The architecture is reusable for future menus and gameplay screens.
3. Future zoom tuning can be isolated to constants and camera math.

## Execution Protocol

Follow this protocol exactly.

1. Start each work session by reading this file and `UI_IMPROVEMENT_PLAN.md`.
2. Find the first step whose status is `pending`.
3. Update that step to `in_progress` before coding.
4. Implement the smallest correct change for that step.
5. Run `pnpm linter-check`.
6. Run additional verification only when the step affects tests, build behavior, or runtime behavior that should be checked more deeply.
7. Decide whether user input is actually required:
   - If no user input is required, update the step to `done` and continue to the next pending step when practical.
   - If user input is required, update the step to `review`, summarize what changed, and ask only the specific question needed.
8. If blocked, update the step to `blocked`, add a short blocker note under that step, and stop.
9. After each completed step, keep context small:
   - write a short summary
   - avoid carrying long reasoning forward
   - start the next step from the updated plan and current codebase state
10. If a step changes shared viewport math or shared screen composition, validate both:
    - `DemoHubScreen`
    - `GameMapDemoScreen` if it already exists
    - at least one active demo screen if `DemoHubScreen` still routes to per-demo content
11. Keep this plan updated in the same change set as the code whenever a step status changes.

## Guardrails

### Guardrail 1: Do Not Mix Menu Composition With HUD Composition

- `ContentFrame` is only for centered non-game screens.
- HUD belongs directly to `UIScreen`.

### Guardrail 2: Do Not Mix Renderer Resize With World Policy

- Pixi provides screen size.
- App-level viewport logic derives UI and world geometry from that size.

### Guardrail 3: Do Not Apply Zoom To The Wrong Layer

- Only world containers receive zoom transforms.
- UI containers never inherit world zoom.

### Guardrail 4: Do Not Reintroduce Fixed Viewport Constants Into Active Logic

- Active world viewport calculations must flow through the shared viewport source.

### Guardrail 5: Keep Steps Small

- Each step should make the smallest correct change that unlocks the next one.

### Guardrail 6: Prefer Reuse Over New Abstractions

- Do not create `WorldLayer`, `CurrentScreen`, or extra wrappers unless they improve clarity immediately.
- New abstractions must own a real responsibility.

### Guardrail 7: Do Not Fake Uniform UI Scaling With Container Shrink Alone

- `ContentFrame` must preserve a stable design-space layout.
- Uniform downscaling should come from shared scale metrics and transform application, not only from making the parent box smaller.

### Guardrail 8: Migrate All Active Viewport Consumers

- Do not stop at `GameView` and camera math.
- Debug helpers, fixed-position overlays, and any screen-edge UI tied to viewport dimensions must move to the shared viewport source as well.

## Completion Criteria

This plan is complete when:

1. `DemoHubScreen` uses the centered `ContentFrame` architecture.
2. The map is accessible from the hub.
3. The map renders in a dedicated `GameMapDemoScreen`.
4. A responsive HUD renders above the map.
5. The world viewport is dynamic and mask-based.
6. World zoom is real, programmatic, and isolated from the UI.
7. Larger screens and zoom-out reveal more real tiles.
8. Player centering remains correct.
9. Resize behavior feels like a game, not a web page.
10. Every active consumer of viewport size, visible bounds, or fixed screen edges uses the shared viewport source.
11. Every completed step has been verified appropriately and marked `done` in this document, with user review only where it was genuinely required.
