## Exploration: Tooltip UI Component (Step 18)

### Current State

The codebase has no tooltip component. The DemoHub (`DemoHubScreen.tsx`, line 169) already has a placeholder entry `{ id: 'tooltip', label: 'Tooltip', presentation: 'framed' }` with no `render` function — the button appears disabled in the hub.

All 17 previous UI steps (Label through ScrollView) are `done`, establishing strong patterns for how new components are built, demoed, and wired.

**Existing patterns that Tooltip can leverage:**

| Pattern | Where | Relevance |
|---------|-------|-----------|
| Nine-slice Panel with absolute bg + inner content | `Panel.tsx` | Tooltip uses Panel for its visual shell |
| `usePressableState` hover tracking | `Button.tsx`, `IconButton.tsx`, `List.tsx` | Provides `onPointerOver`/`onPointerOut` events |
| `computedLayout` measurement via `layout` event | `Slider.tsx` lines 115–142 | Pattern for reading layout-computed sizes to position elements |
| Absolute positioning inside `position: 'relative'` wrapper | `Panel.tsx`, `Slider.tsx`, `IconButton.tsx` | Tooltip panel must be absolutely positioned outside the target |
| `pixiNineSliceSprite` with `applySizeDirectly: true` | `Panel.tsx` line 80 | Required for background sizing in absolutely-positioned contexts |
| Demo screen conventions | `src/components/screens/demos/` | Each component gets a dedicated demo screen with Panel-wrapped test cases |
| Dependency injection via `useUITexture` | All UI components | Tooltip Panel uses the same `panel` texture |

**Key `@pixi/layout` rules in play:**
- `position: 'absolute'` removes element from flex flow; positioned relative to nearest positioned ancestor
- `top`, `left`, `bottom`, `right` accept `number` or `'N%'` values
- `computedLayout` on a ref gives the post-layout bounding box (used by Slider for track width measurement)
- No percentage-based `top`/`left`/`bottom`/`right` values exist anywhere in the codebase — all absolute positioning uses fixed pixel numbers
- `overflow: 'visible'` is the default, allowing absolutely-positioned children to render outside parent bounds

### Affected Areas

- `src/components/ui/Tooltip.tsx` — NEW file: the tooltip component
- `src/components/screens/demos/TooltipDemoScreen.tsx` — NEW file: demo screen
- `src/components/screens/DemoHubScreen.tsx` — MODIFY: add import + route + render function for the tooltip demo entry (line 169)
- `src/components/ui/index.ts` — MODIFY: add `export { Tooltip } from './Tooltip'`
- No existing files need to be modified (tooltip wraps around existing components, doesn't change them)

### Approaches

#### 1. Absolute positioning with computedLayout measurement (Slider pattern)

Wrap children in a `layoutContainer` with `position: 'relative'`. On hover, render a `Panel` with `position: 'absolute'` positioned outside the target using pixel offsets derived from the target's `computedLayout` and the tooltip's own `computedLayout` (via `layout` event listeners on refs, following the exact pattern from `Slider.tsx` lines 115–142).

- **Pros**: 
  - Proven pattern already used by Slider in the codebase
  - Handles variable content sizes (tooltip text can be any length)
  - Tooltip can center itself relative to the target width
  - Precision: no guessing about layout-computed sizes
  - The `layout` event fires automatically after each layout recalculation
- **Cons**: 
  - More code than a simple offset approach (~20 extra lines for refs + event wiring)
  - Potential 1-frame flicker: tooltip may render at (0,0) before layout event fires and repositions it
  - Two layout event listeners needed (one for target size, one for tooltip size)
- **Effort**: Medium

#### 2. Simple absolute positioning with fixed offsets

Render Panel absolutely with an offset that positions it outside the target, using the target's explicit `size` prop (for IconButton) or a reasonable default offset. No `computedLayout` measurement — just use `top`/`bottom`/`left`/`right` with a fixed gap.

- **Pros**: 
  - Simple implementation (~15 lines of layout code)
  - No layout event listeners needed
  - No flicker risk
- **Cons**: 
  - Tooltip won't center relative to variable-width targets
  - Requires consumers to pass `size` or tooltip must guess offsets
  - Breaks when wrapping targets without explicit dimensions
  - Doesn't handle `content: ReactNode` with variable sizing
  - Feels fragile and incomplete for a reusable component
- **Effort**: Low

#### 3. Flex-based sibling with order manipulation

Structure the wrapper as a `flex-col` container. Place children + tooltip as flex siblings. Use `order` CSS property (if supported by Yoga) to render tooltip above or below in the flex flow. This avoids absolute positioning entirely.

- **Pros**: 
  - No absolute positioning complexity
  - Tooltip participates in layout naturally
  - No measurement needed
- **Cons**: 
  - **Yoga does not support CSS `order` property** — this approach is NOT viable with `@pixi/layout`
  - Even if it did, tooltip appearing/disappearing would cause the wrapper to resize and shift layout
  - Tooltip would compete for space in flex flow, potentially pushing other elements around
- **Effort**: Low — but technically infeasible

### Recommendation

**Approach 1** is the recommended path. It's the only approach that handles the component API correctly:

```tsx
<Tooltip content="Espada de hierro - Damage: 15-25">
  <IconButton icon="sword-icon" size={48} />
</Tooltip>
```

The tooltip must:
- Not affect the parent's layout flow (absolute positioning)
- Position relative to the target, not the mouse (per spec)
- Handle variable content sizes (computedLayout measurement)
- Center itself against the target (need target width from computedLayout)

The 1-frame flicker risk can be mitigated by rendering the tooltip with `alpha: 0` initially, then setting `alpha: 1` after the layout event fires and positions it correctly.

**Internal structure target:**

```tsx
<layoutContainer layout={{ position: 'relative' }}>   {/* positioning context */}
  <layoutContainer                                        {/* hover target */}
    eventMode="static"
    onPointerOver={show}
    onPointerOut={hide}
  >
    {children}
  </layoutContainer>
  {visible && (
    <Panel                                                 {/* absolutely positioned tooltip */}
      ref={tooltipRef}
      layout={{ position: 'absolute', ...calculatedPosition }}
    >
      {renderContent(content)}
    </Panel>
  )}
</layoutContainer>
```

**Placement strategy for v1:**
- `top`: tooltip above target, horizontally centered → read target width from computedLayout, position tooltip with `bottom: targetHeight + gap` and centered `left` offset
- `bottom`: tooltip below target, horizontally centered → `top: targetHeight + gap`
- `left`: tooltip left of target, vertically centered → `right: targetWidth + gap`
- `right`: tooltip right of target, vertically centered → `left: targetWidth + gap`

No edge-aware auto-positioning in v1 (per Step 18 spec).

### Risks

- **Overflow clipping**: If the tooltip wrapper is inside a container with `overflow: 'hidden'` or `overflow: 'scroll'` (e.g., inside a ScrollView), the absolutely-positioned tooltip Panel will be clipped. This is an inherent limitation of absolute positioning within a clipped parent. For v1, accept this constraint. A future portal/layer-based approach could solve it.
- **Z-ordering with overlapping siblings**: The tooltip renders as a child of the wrapper, which is a sibling of other content. If adjacent elements overlap the tooltip's area, they may render on top. Likely not an issue in practice for most layouts, but worth documenting.
- **1-frame positioning flicker**: The tooltip may render at the origin (0,0) for one frame before the `layout` event fires and repositions it. Mitigated by starting with `alpha: 0` and fading in after positioning.
- **Rapid hover/unhover (debounce)**: If the user quickly sweeps across multiple tooltip targets, rapid show/hide cycles could cause visual jitter. Consider a short delay (100–150ms) before showing, and immediate hide.
- **Screen edge overflow**: When the target is near a screen edge, the tooltip may render partially off-screen. Step 18 explicitly defers edge-aware auto-positioning to a future iteration.
- **Interaction with Panel's own padding**: The tooltip Panel uses default Panel padding (16px). For tooltips with short text, this may feel too spacious. Consider exposing a `compact` prop or using `bodySm` font with reduced padding.

### Ready for Proposal

**Yes.** The exploration has identified a clear, proven approach (absolute positioning + computedLayout measurement following the Slider pattern) with no fundamental blockers. The component API is well-specified in Step 18, all necessary building blocks (Panel, Label, `usePressableState`, `computedLayout` measurement) exist and are working, and the DemoHub is already wired with a placeholder entry.

Recommended next phase: **sdd-propose** to formalize the change proposal with scope, approach summary, and rollback plan.
