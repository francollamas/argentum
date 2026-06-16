# Input Refactor Plan

This document defines the refactor plan for `Input` and `TextArea`. The goal is to render the visible control entirely in Pixi (background, text, caret, selection, placeholder) while keeping a per-field DOM `input`/`textarea` as the editing source of truth. The DOM editor is **fully invisible** — never `display: none` — and stays at the same screen position as the Pixi field so all existing focus, tab, scroll-sync, and modal-occlusion behavior keeps working untouched.

## Decision

Keep the per-field DOM overlay strategy. Hide it visually. Add a small DOM→Pixi event bridge that mirrors editor state into Pixi-rendered visuals.

- **Pixi owns visual rendering**: background, text, placeholder, caret, selection.
- **DOM owns editing semantics**: focus, IME, composition, copy/paste, arrow navigation, selection.
- **DOM stays in place**, fully transparent (color, caret-color, background, border, `::selection`).
- **No global active editor**. Each field has its own DOM `input`/`textarea`, just like today.
- **No `TextEditorProvider`**. Per-field state is local.
- **Module rename**: `DomInputOverlay` / `DomTextAreaOverlay` → `DomEditor` (single module with two flavors: `Input` and `TextArea`).

## Quick Path

1. Make the DOM editor fully invisible (CSS + style changes only). No behavioral change.
2. Add `useDomEditorEvents` to mirror DOM state into a local `EditorSnapshot`.
3. Render text in Pixi for both `Input` and `TextArea`.
4. Render the caret in Pixi using a hidden mirror div for pixel-perfect positioning.
5. Render the selection highlight in Pixi (single line for `Input`, multi line for `TextArea`).
6. Polish, remove obsolete CSS, validate demos.

## Non-Goals

- Reimplementing text editing semantics in Pixi.
- Building a generic text engine for all Pixi text.
- Hiding the DOM via `display: none` (would kill focus, IME, selection).
- Using nested `ScrollView` for `TextArea` internal scrolling.
- Solving every visual polish issue in the first pass.

## Core Architecture

| Area | Decision |
|------|----------|
| Visible UI | Pixi: background (nine-slice), text, placeholder, caret, selection rects |
| Editing state | Per-field DOM `input` / `textarea` (kept in place, fully transparent) |
| Focus | Same as today: Pixi `onPointerDown` calls `domInputRef.current?.focus()` |
| Tab order | Native: works because all DOM editors remain focusable and in the layout |
| Selection | Indices come from DOM `selectionStart` / `selectionEnd`; rendered in Pixi |
| Caret position | Computed in pixel space via a hidden mirror `<div>` with cloned styles |
| Clipboard | Native DOM behavior |
| IME / composition | Native DOM behavior; Pixi suppresses its own caret during composition |
| Input horizontal reveal | Mirrored from DOM `scrollLeft` into a Pixi text offset |
| TextArea internal scroll | Mirrored from DOM `scrollTop` into a Pixi text offset |
| Modal occlusion | Unchanged: `useIsDomOverlayOccluded` still works because the DOM is in the same place |

## High-Level Flow

1. Pixi field renders its background, text, placeholder, caret, and selection.
2. On pointer down, the Pixi field focuses its own DOM `input`/`textarea` (invisible).
3. The user types / clicks / moves the caret inside the invisible DOM.
4. DOM events (`input`, `select`, `selectionchange`, `scroll`, `compositionstart/end`, `keydown`) update a local editor snapshot.
5. Pixi reads the snapshot and re-renders text, caret, and selection in the next frame.
6. On blur, the snapshot freezes, the Pixi caret/selection hides, and the field shows the placeholder if empty.

## Shared Data Model

A single normalized snapshot used by both `Input` and `TextArea`:

```ts
type EditorKind = 'input' | 'textarea'

type EditorSelection = {
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none'
}

type EditorScroll = {
  left: number
  top: number
}

type EditorSnapshot = {
  value: string
  selection: EditorSelection
  scroll: EditorScroll
  composing: boolean
  focused: boolean
  caretMoved: 'left' | 'right' | 'up' | 'down' | null
}
```

`caretMoved` is informational. The first pass can render it as null and still be correct.

## File Structure

Files to rename / merge:

- `src/components/ui/DomInputOverlay.tsx` → merged into `src/components/ui/editor/DomEditor.tsx`
- `src/components/ui/DomTextAreaOverlay.tsx` → merged into `src/components/ui/editor/DomEditor.tsx`

Files to add (all under `src/components/ui/editor/`):

- `EditorContext.ts` — kind, snapshot, config types
- `useDomEditorEvents.ts` — subscribes to DOM events, returns snapshot
- `editorGeometry.ts` — caret/selection pixel math via mirror div
- `editorMirror.ts` — creates and manages the hidden mirror `<div>` per editor
- `EditorVisuals.tsx` — Pixi renderer: text + placeholder + caret + selection
- `editorStyles.ts` — shared style builders for the transparent DOM editor

Files to modify:

- `src/components/ui/Input.tsx` — use the new editor stack, render in Pixi
- `src/components/ui/TextArea.tsx` — same migration as `Input`
- `src/components/ui/index.ts` — update exports
- `src/index.css` — replace `.input-overlay` / `.textarea-overlay` rules with `.dom-editor` (fully transparent)

Files that **stay unchanged** (the strategy is preserved):

- `src/hooks/useDomOverlayHost.ts`
- `src/hooks/useOverlayPositionSync.ts`
- `src/hooks/usePixiLayoutListener.ts`
- `src/hooks/useOverlayLayer.tsx`
- `src/components/ui/Window.tsx` (uses `useIsDomOverlayOccluded` — still works)

## Phase 1 — Make the DOM editor fully invisible

Outcome: the per-field DOM `input` / `textarea` is in the layout, focusable, but visually absent. No native caret, no native selection highlight, no native text rendering.

Changes:

- `editorStyles.ts` (new):
  - One function returning the editor's position styles (same as today's `computeOverlayStyle`)
  - One function returning the **invisibility** styles:
    - `color: 'transparent'`
    - `caretColor: 'transparent'`
    - `background: 'transparent'`
    - `border: 'none'`
    - `outline: 'none'`
    - `appearance: 'none'`
    - `'-webkit-text-fill-color': 'transparent'`
- `editor/DomEditor.tsx` (renamed, merged):
  - Renders an `<input>` or `<textarea>` based on `kind`
  - Inherits position from `useOverlayPositionSync`
  - Piles the invisibility styles on top
  - **No placeholder** in the DOM (some browsers still render transparent placeholders visibly). Placeholder is rendered by Pixi.
- `src/index.css`:
  - Replace `.input-overlay::placeholder`, `.textarea-overlay::placeholder`, `.input-overlay::selection`, `.textarea-overlay::selection` with `.dom-editor::selection { background: transparent; color: transparent; }` and remove the placeholder rules
  - Remove `.textarea-overlay` scrollbar styling (no native scrollbar visible anymore)
  - Add `.dom-editor { color: transparent; -webkit-text-fill-color: transparent; caret-color: transparent; }`

Exit criteria:

- The DOM editor still receives focus and accepts input.
- The user sees no native caret, no native selection, no native text.
- Tabs, focus, modal occlusion, and position sync all behave exactly as before.

## Phase 2 — Bridge DOM events into a snapshot (`useDomEditorEvents`)

Outcome: every component that uses the editor can read a local `EditorSnapshot` that updates on every relevant DOM event.

`useDomEditorEvents(ref, kind)`:

- Subscribes via `addEventListener` on the DOM element:
  - `input` → snapshot.value
  - `select` → snapshot.selection
  - `scroll` → snapshot.scroll
  - `compositionstart` / `compositionend` → snapshot.composing
  - `focus` / `blur` → snapshot.focused
  - `keydown` for arrow keys → snapshot.caretMoved
  - `click` → re-reads selection (mouse drag updates selection on `mouseup`, which the input fires as `select`)
- Subscribes to `document.selectionchange` as a fallback for `textarea` (where `select` is unreliable)
- Stores snapshot in `useState`, batches updates with `requestAnimationFrame` to coalesce
- Cleans up listeners on unmount

Notes:

- The caret/selection pixel math is **not** done in this hook. It only exposes indices + scroll + flags. The geometry layer (Phase 4) reads the snapshot and computes positions.
- The hook is a pure DOM adapter. No Pixi imports.

Exit criteria:

- Given any DOM event sequence, the snapshot reflects the same value, selection, scroll, and composing state as the DOM element.
- A debug log of the snapshot after a few keystrokes matches `el.value`, `el.selectionStart`, `el.selectionEnd`, and `el.scrollLeft`.

## Phase 3 — Render the text in Pixi (Input + TextArea)

Outcome: the visible text comes from Pixi, not from the DOM.

- `EditorVisuals.tsx` (new):
  - Reads the `EditorSnapshot`
  - When focused, uses `snapshot.value`; when blurred, uses the prop `value`
  - Renders the value with `<pixiBitmapText>` using `FONTS.input` for `Input` and `FONTS.body` for `TextArea`
  - Applies `snapshot.scroll.left` as a horizontal offset for `Input` (single line)
  - Applies `snapshot.scroll.top` as a vertical offset for `TextArea` (multi line)
  - Renders the placeholder with `<pixiBitmapText>` when the field is empty and not focused
- `Input.tsx` / `TextArea.tsx`:
  - Call `useDomEditorEvents(domRef, 'input' | 'textarea')`
  - Render `<EditorVisuals>` inside the same `layoutContainer`
  - Keep the same nine-slice background, invalid/disabled tints, and pointer events

Exit criteria:

- Typing in the field updates Pixi text on every keystroke.
- The horizontal scroll of a long `Input` value mirrors in Pixi (the text appears to scroll left as the user types past the right edge).
- The vertical scroll of a `TextArea` mirrors in Pixi.

## Phase 4 — Render the caret in Pixi

Outcome: a Pixi-drawn caret tracks the DOM caret in pixel space.

`editorGeometry.ts` + `editorMirror.ts` (new):

- For `Input`:
  - Build a hidden mirror `<div>` (off-screen, `position: absolute`, `visibility: hidden`, no pointer events) with the **same** styles as the DOM editor (font family, size, line-height, padding, letter-spacing, etc.)
  - Set the mirror's `textContent` to the current `value`
  - Insert a marker `<span>` at `selectionStart`
  - Measure the marker's `offsetLeft` / `offsetTop` relative to the mirror
  - The caret is a 1–2 px wide rect at `(markerOffset.x - scrollLeft, markerOffset.y)`, height = line height
  - Render the rect with `<pixiGraphics>` in `EditorVisuals`
- For `TextArea`:
  - Same mirror technique, but the mirror is a `<div>` emulating textarea layout (same padding, line-height, `white-space: pre-wrap`)
  - The caret height is the **current line's** line-height, and the y is the marker's offset within the mirror minus `scrollTop`

Blinking:

- Use a simple `useState` + `setInterval` to toggle the caret visible/hidden every 500 ms while focused
- Hide the caret while `composing === true`

Direction:

- `snapshot.caretMoved` is exposed to `EditorVisuals` for future polish (e.g., a directional flash). First pass can ignore it.

Exit criteria:

- The Pixi caret position matches the DOM caret visually to within a couple of pixels.
- The caret blinks at the same cadence as the native one.
- The caret disappears during IME composition and on blur.
- Pressing Left/Right/Up/Down/Home/End moves the Pixi caret accordingly.

## Phase 5 — Render the selection highlight in Pixi

Outcome: the selected range is painted in Pixi, not by the browser.

For `Input` (single line):

- Compute the pixel rect for the range `[selectionStart, selectionEnd]`:
  - If `start === end`, no rect (just the caret)
  - Otherwise, place one marker at `start` and one at `end`, and draw a rect from the start marker to the end marker
  - Color: same highlight the design uses elsewhere (e.g., `rgba(255, 214, 102, 0.35)` — match the current CSS)

For `TextArea` (multi line):

- Compute one rect per visual line that intersects the selection:
  - Use the same mirror technique; for each line, measure the start-of-line and end-of-line markers
  - Emit a list of `{ x, y, width, height }`
  - Draw them with `<pixiGraphics>` in `EditorVisuals`
- Edge cases:
  - Selection starts mid-line: x = marker at `start`
  - Selection ends mid-line: width = marker at `end` - x
  - Full-line selection: width = mirror client width minus padding
  - Trailing partial: width = 0 → skip
- Hide the selection highlight during `composing === true` (matches native behavior in most engines)

Exit criteria:

- Mouse-drag selection in either control paints a Pixi rect that matches the highlighted range.
- Multiline selection in `TextArea` paints one rect per line.
- `Cmd/Ctrl+A` selects everything; the Pixi highlight covers all lines.
- No native browser `::selection` is visible.

## Phase 6 — Polish, CSS cleanup, and validation

Outcome: dead CSS and old assumptions are gone; the visual result holds up across the demo paths.

Changes:

- Verify all `.input-overlay` / `.textarea-overlay` rules have been removed from `src/index.css`
- Verify `src/components/ui/index.ts` exports are consistent with the rename
- Update any demo screen that imported the old names
- Run the existing `InputDemoScreen`, `TextAreaDemoScreen`, and `FormDemoScreen` to confirm:
  - `Input` inside a panel
  - `Input` inside a `Dialog`
  - `Input` inside a `ScrollView` (the original bug)
  - `TextArea` inside a panel
  - `TextArea` inside a `Dialog`
  - `TextArea` inside a `ScrollView`
  - Mouse-drag selection, arrow navigation, copy/paste/cut
  - IME composition (try a CJK input method if available)
  - Modal occlusion: opening a `Window` / `Dialog` blurs the active field

## Visual Rendering Rules

These rules remain fixed during implementation.

- Pixi is the only visible layer.
- The DOM editor is fully transparent (color, caret, background, border, `::selection`).
- The DOM editor is never `display: none` (would break focus and IME).
- The placeholder is rendered by Pixi, not by the DOM.
- Selection highlight color comes from the design palette.
- Invalid and disabled states remain driven by control props.

## Focus Rules

- One focused DOM editor at a time (browser-enforced).
- Pixi `onPointerDown` calls `.focus()` on its own DOM ref.
- `useIsDomOverlayOccluded` continues to blur the active DOM editor when a higher-layer modal opens.
- `focus()` / `blur()` ref methods on `Input` and `TextArea` keep working.

## RHF Compatibility Rules

- `onChange` is the write path into form state.
- `onBlur` is the touched-state trigger.
- `Input` and `TextArea` stay RHF-agnostic.
- Form adapters do not need to know about DOM/Pixi split.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Pixi and DOM text metrics drift (font metrics, kerning) | Use the same font family and size in the mirror div; treat the mirror as ground truth for caret/selection pixel positions |
| Caret position off by a few pixels | Calibrate by comparing mirror offset with `setSelectionRange` + a marker span; align padding explicitly in both editor and mirror |
| Multiline selection rects miss edge cases (trailing newline, soft wrap) | Build a unit test that constructs `value + selection` and asserts the rect list; iterate against the mirror |
| Composition causes visual flicker | Track `composing` in the snapshot; suppress Pixi caret/selection while composing; suppress the Pixi text re-render only if the value matches the previous one |
| Hidden DOM editor loses expected browser behavior | Keep it `position: absolute` at the field's location, never `display: none` |
| Tab order breaks if Pixi overlays the DOM | `pointer-events: auto` on the DOM (current behavior) — clicks land on the DOM naturally, no need to bridge them |
| Performance: per-frame snapshot updates during fast typing | Coalesce updates in a `requestAnimationFrame`; only re-render Pixi when the snapshot reference changes |

## Implementation Order

1. Phase 1 — invisibility styles
2. Phase 2 — `useDomEditorEvents` hook
3. Phase 3 — Pixi text rendering
4. Phase 4 — Pixi caret
5. Phase 5 — Pixi selection
6. Phase 6 — polish, CSS cleanup, demo validation

Do not start Phase 4 before Phase 2 is stable (we need the snapshot to drive the geometry).
Do not start Phase 5 before Phase 4 (the geometry helpers are shared).

## Acceptance Checklist

- [ ] The DOM editor is fully invisible (no native text, caret, or selection)
- [ ] Pixi renders the visible text
- [ ] Pixi renders the caret, positionally correct, blinking
- [ ] Pixi renders the selection highlight (single line for `Input`, multi line for `TextArea`)
- [ ] Pixi renders the placeholder when empty and blurred
- [ ] Tabs still work between fields
- [ ] Modal occlusion still blurs the active editor
- [ ] `Input` inside a `ScrollView` no longer drifts
- [ ] `TextArea` inside a `ScrollView` no longer drifts
- [ ] Copy / paste / cut / select-all work natively
- [ ] IME composition works natively; Pixi caret hides during composition
- [ ] `Input` and `TextArea` imperative `focus()` / `blur()` still work
- [ ] RHF integration still works unchanged
- [ ] Old `.input-overlay` / `.textarea-overlay` CSS is removed
- [ ] Module renamed: `DomInputOverlay` / `DomTextAreaOverlay` → `DomEditor`

## Verification Commands

```bash
pnpm linter-check
pnpm test
pnpm build
```

## Next Step

Start with Phase 1 only — it is the safest step (CSS + style changes only, no behavioral change). Do not start Phase 2 until Phase 1 is reviewed.
