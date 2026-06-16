# Input Refactor Plan

This document defines the refactor plan for `Input` and `TextArea` using the chosen hybrid architecture: Pixi renders the visible control, while a single focused DOM editor remains the editing source of truth. The goal is to preserve native browser behavior for caret movement, selection, copy/paste, composition, and keyboard navigation without keeping visible DOM overlays tied to every field.

## Decision

We will replace per-field visible DOM overlays with a single active DOM editor managed globally.

- Pixi owns visual rendering.
- DOM owns editing semantics.
- `ScrollView`, `Dialog`, `Window`, clipping, and layout stay in Pixi.
- `TextArea` keeps its own internal editor scroll model. It will not reuse `ScrollView` as its internal scroll mechanism.

## Quick Path

1. Introduce a global active editor bridge and host.
2. Migrate `Input` to the hybrid model and validate focus, selection, and horizontal scrolling.
3. Migrate `TextArea` to the same model and validate multiline selection and internal vertical scrolling.
4. Remove the old per-field overlay infrastructure once both controls are stable.

## Non-Goals

- Reimplementing text editing semantics in Pixi.
- Building a generic text engine for all text rendering.
- Using nested `ScrollView` for `TextArea` internal scrolling.
- Solving every visual polish issue in the first pass.

## Core Architecture

| Area | Decision |
|------|----------|
| Visible UI | The field background, text, placeholder, caret, and selection are drawn in Pixi |
| Editing state | A single active DOM `input` or `textarea` owns the live editing state |
| Focus | Focus moves to the active DOM editor, not to a per-field overlay |
| Selection | Selection indices come from DOM `selectionStart` / `selectionEnd` |
| Clipboard | Native DOM behavior |
| IME / composition | Native DOM behavior |
| Input horizontal reveal | Driven by DOM `scrollLeft` |
| TextArea internal scroll | Driven by DOM `scrollTop` and mirrored in Pixi |
| ScrollView clipping | Solved because Pixi is the visible layer |

## High-Level Flow

When a field is activated:

1. The Pixi field registers itself as the active editor target.
2. The global editor host mounts either an `input` or `textarea`.
3. That DOM editor receives focus and becomes the editing source of truth.
4. DOM events update shared editor state:
   - `value`
   - `selectionStart`
   - `selectionEnd`
   - `scrollLeft` or `scrollTop`
   - composition state
5. The Pixi field reads that state and renders the visual result.
6. When focus is lost, the DOM editor is detached or hidden and the field falls back to static Pixi rendering.

## Target File Structure

Existing files to modify:

- `src/app/App.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/TextArea.tsx`
- `src/components/ui/index.ts`

Existing files likely to delete after migration:

- `src/components/ui/DomInputOverlay.tsx`
- `src/components/ui/DomTextAreaOverlay.tsx`
- `src/hooks/useOverlayPositionSync.ts`
- `src/hooks/usePixiLayoutListener.ts`
- `src/hooks/useDomOverlayHost.ts`

New files to add:

- `src/components/ui/textEditor/TextEditorProvider.tsx`
- `src/components/ui/textEditor/ActiveDomTextEditor.tsx`
- `src/components/ui/textEditor/textEditorContext.ts`
- `src/components/ui/textEditor/types.ts`
- `src/components/ui/textEditor/useActiveTextEditor.ts`
- `src/components/ui/textEditor/useTextEditorRegistration.ts`
- `src/components/ui/textEditor/textMeasurement.ts`
- `src/components/ui/textEditor/textSelection.ts`

Optional later extraction if complexity grows:

- `src/components/ui/textEditor/InputVisual.tsx`
- `src/components/ui/textEditor/TextAreaVisual.tsx`

## Shared Data Model

The bridge should expose one normalized editing model.

Suggested shape:

```ts
type ActiveEditorKind = 'input' | 'textarea'

type ActiveEditorSelection = {
  start: number
  end: number
  direction?: 'forward' | 'backward' | 'none'
}

type ActiveEditorScroll = {
  left: number
  top: number
}

type ActiveEditorSnapshot = {
  id: string
  kind: ActiveEditorKind
  value: string
  placeholder: string
  disabled: boolean
  selection: ActiveEditorSelection
  scroll: ActiveEditorScroll
  composing: boolean
  focused: boolean
}
```

Each field also needs a registration contract so the global editor can talk to it.

Suggested registration shape:

```ts
type TextEditorRegistration = {
  id: string
  kind: 'input' | 'textarea'
  getValue: () => string
  setValue: (value: string) => void
  onBlur?: () => void
  onEnter?: (value: string) => void
  isDisabled: () => boolean
  getVisibleRect: () => DOMRect | null
  getConfig: () => {
    placeholder: string
    secure?: boolean
    maxLength?: number
    align: 'left' | 'center' | 'right'
  }
}
```

## Phase Plan

## Phase 1: Introduce the global editor infrastructure

Outcome:

- The app can host one active DOM editor globally.
- No field is migrated yet.

Files:

- Add `src/components/ui/textEditor/types.ts`
  - shared types for snapshot, registration, config, and editor kind
- Add `src/components/ui/textEditor/textEditorContext.ts`
  - context API for registering fields and activating the current one
- Add `src/components/ui/textEditor/TextEditorProvider.tsx`
  - owns registry, active editor id, editor snapshot, focus lifecycle, and update actions
- Add `src/components/ui/textEditor/ActiveDomTextEditor.tsx`
  - mounts the single active DOM `input` or `textarea`
  - syncs DOM events into the provider state
  - keeps DOM hidden visually but fully functional
- Add `src/components/ui/textEditor/useActiveTextEditor.ts`
  - read-only hook for controls to consume current snapshot for their own id
- Add `src/components/ui/textEditor/useTextEditorRegistration.ts`
  - register/unregister a control instance with the provider
- Update `src/app/App.tsx`
  - wrap the current UI tree with `TextEditorProvider`
  - render `ActiveDomTextEditor` once near the app root

Notes:

- The DOM editor should be visually hidden, but not `display: none`.
- It must remain focusable and selectable.
- The provider should support exactly one active editor at a time.

Exit criteria:

- App boots with the provider mounted.
- No visual regression in non-input UI.
- The provider can register and activate a dummy field in isolation.

## Phase 2: Extract measurement and selection utilities

Outcome:

- We have shared utilities for painting caret and selection in Pixi.

Files:

- Add `src/components/ui/textEditor/textMeasurement.ts`
  - text width helpers for single-line rendering
  - line layout helpers for multiline rendering
  - use the same font family and size assumptions as the Pixi field visuals
- Add `src/components/ui/textEditor/textSelection.ts`
  - caret x/y calculation from selection indices
  - selection rect generation for single-line and multiline text

Notes:

- Keep the first pass simple and deterministic.
- Prefer shared helpers instead of ad-hoc geometry inside `Input.tsx` and `TextArea.tsx`.
- Match DOM and Pixi typography as closely as possible using the existing `FONTS` config.

Exit criteria:

- Given a value and selection range, we can compute caret and selection geometry without DOM overlays.
- The helpers cover both empty and non-empty content.

## Phase 3: Migrate Input

Outcome:

- `Input` uses the global DOM editor for editing, but renders visually in Pixi.

Files:

- Refactor `src/components/ui/Input.tsx`
  - remove per-field DOM overlay rendering
  - remove `useDomOverlayHost`
  - remove `useOverlayPositionSync`
  - remove `usePixiLayoutListener`
  - register the field with `useTextEditorRegistration`
  - on pointer activation, set itself as active editor
  - render background, text, placeholder, caret, and selection in Pixi
  - use active editor snapshot when focused; use prop value when inactive
- Keep the existing public API:
  - `value`
  - `onChange`
  - `onBlur`
  - `onEnter`
  - `disabled`
  - `invalid`
  - imperative `focus()` / `blur()` through ref

Input-specific behavior:

- Single-line text only.
- Horizontal reveal is driven by DOM `scrollLeft`.
- Clicking the field activates the DOM editor.
- Caret and selection are painted in Pixi.
- Enter behavior stays delegated to DOM and forwarded to the existing `onEnter` contract.

Exit criteria:

- `Input` works inside normal panels.
- `Input` works inside `Dialog`.
- `Input` works inside `ScrollView` without position drift.
- Arrow navigation, selection, and copy/paste remain native.

## Phase 4: Migrate TextArea

Outcome:

- `TextArea` uses the global DOM editor for editing, but renders visually in Pixi.

Files:

- Refactor `src/components/ui/TextArea.tsx`
  - same overlay removal as `Input`
  - register as kind `textarea`
  - render visible multiline text in Pixi
  - render placeholder in Pixi when empty
  - mirror DOM `scrollTop` and `scrollLeft`
  - render caret and multiline selection using shared geometry helpers

TextArea-specific behavior:

- No internal `ScrollView`.
- Internal vertical scrolling is editor-specific and mirrors DOM `scrollTop`.
- Wheel interaction while focused should affect the DOM textarea and update the Pixi viewport.
- Multiline selection rects are painted in Pixi.

Why not `ScrollView` internally:

- `TextArea` is an editor, not a stacked content container.
- The browser already solves caret-driven autoscroll correctly.
- Reusing `ScrollView` would create wheel and nested-scroll conflicts.

Exit criteria:

- `TextArea` supports multiline selection, caret movement, and copy/paste.
- Internal scroll stays in sync with the visible Pixi viewport.
- `TextArea` works inside `Dialog + ScrollView` without overlay clipping issues.

## Phase 5: Update form and demo verification paths

Outcome:

- The existing form demos prove the new architecture works in the difficult scenarios.

Files:

- Update `src/components/screens/demos/InputDemoScreen.tsx` if needed
- Update `src/components/screens/demos/TextAreaDemoScreen.tsx` if needed
- Update `src/components/screens/demos/FormDemoScreen.tsx`

Verification scenarios:

- `Input` in a normal panel
- `Input` in a `Dialog`
- `Input` in a `ScrollView`
- `TextArea` in a normal panel
- `TextArea` in a `Dialog`
- `TextArea` in a `ScrollView`
- text selection with mouse drag
- cursor movement with arrows
- `Cmd/Ctrl+A`, copy, cut, paste
- blur and RHF touched state
- `TextArea` internal vertical scrolling

Exit criteria:

- The previous form bug is gone.
- Editing behavior remains native.
- Visual rendering remains stable while scrolling containers move.

## Phase 6: Remove old overlay infrastructure

Outcome:

- The codebase no longer carries the obsolete per-field visible overlay system.

Files:

- Delete `src/components/ui/DomInputOverlay.tsx`
- Delete `src/components/ui/DomTextAreaOverlay.tsx`
- Delete `src/hooks/useOverlayPositionSync.ts`
- Delete `src/hooks/usePixiLayoutListener.ts`
- Delete `src/hooks/useDomOverlayHost.ts`
- Update imports wherever needed

Exit criteria:

- No dead code remains from the old overlay model.
- `pnpm linter-check`, `pnpm test`, and `pnpm build` pass.

## Visual Rendering Rules

These rules should remain fixed during implementation.

- Pixi is always the visible layer.
- The active DOM editor should be visually hidden.
- Placeholder is rendered by Pixi, not by the visible DOM.
- Selection highlight color should come from the design palette, not browser defaults.
- Invalid and disabled state continue to be driven by the existing control props.

## Focus Rules

- Only one active editor exists at a time.
- Activating a new field blurs the previous one.
- When a modal occludes the active field, the editor should blur.
- `focus()` and `blur()` refs on `Input` and `TextArea` must still work.

## RHF Compatibility Rules

- `onChange` remains the write path into form state.
- `onBlur` remains the touched-state trigger.
- `Input` and `TextArea` stay RHF-agnostic.
- Form adapters do not need to know whether the control uses DOM, Pixi, or both.

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Pixi and DOM text metrics do not line up perfectly | Centralize measurement helpers and iterate on typography alignment |
| Multiline selection geometry becomes complex | Migrate `Input` first, stabilize the bridge, then implement `TextArea` |
| Composition events cause visual flicker | Track composition state explicitly in the provider |
| Hidden DOM editor loses expected browser behavior | Keep it focusable and editable, never `display: none` |
| Nested containers create focus confusion | Keep a single active editor and centralize blur/activate rules |

## Implementation Order

Use this order exactly.

1. Phase 1
2. Phase 2
3. Phase 3
4. Verify `Input`
5. Phase 4
6. Verify `TextArea`
7. Phase 5
8. Phase 6

Do not migrate `TextArea` before `Input` is stable.

## Acceptance Checklist

- [ ] Only one active DOM editor exists in the app
- [ ] `Input` no longer renders its own visible DOM overlay
- [ ] `TextArea` no longer renders its own visible DOM overlay
- [ ] `Input` works inside `ScrollView` without drift or clipping bugs
- [ ] `TextArea` works inside `ScrollView` without drift or clipping bugs
- [ ] Selection and caret stay native in behavior
- [ ] Pixi renders the visual selection and caret
- [ ] RHF integration still works unchanged at the form layer
- [ ] Old overlay infrastructure is removed

## Verification Commands

```bash
pnpm linter-check
pnpm test
pnpm build
```

## Next Step

Start with Phase 1 only. Do not mix provider infrastructure and `Input` migration in the same implementation chunk unless the diff stays very small and easy to review.
