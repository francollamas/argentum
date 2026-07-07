# Proposal: Tooltip UI

## Intent

Add a reusable in-canvas tooltip for Step 18 of `UI_IMPROVEMENT_PLAN.md` so UI elements can reveal contextual help or item details without changing layout. This is a client-only UI improvement aligned with the incremental reimplementation approach from `context/reimplementacion/` and does not change legacy gameplay rules.

## Scope

### In Scope
- Build a `Tooltip` wrapper with one trigger child, `content: ReactNode`, placement hints, hover delay, and immediate hide on pointer out.
- Add a dedicated minimal nine-slice tooltip skin with thin border and no rounded corners.
- Add a DemoHub route and tooltip demo covering supported placements and mixed content.

### Out of Scope
- Edge-aware auto-positioning, viewport collision handling, or portal/layer rendering.
- Changing gameplay, server behavior, or adding modal/dialog behavior.

## Capabilities

### New Capabilities
- `tooltip-ui`: Reusable hover tooltip behavior and visual shell for Pixi React UI components.

### Modified Capabilities
- None.

## Approach

Use a relative wrapper plus absolutely positioned tooltip panel, following the measured-layout pattern already used in `src/components/ui/Slider.tsx`. Measure trigger and tooltip bounds from `@pixi/layout` computed layout, delay show briefly, hide immediately, and keep the tooltip invisible until positioned. Implement the shell with a dedicated nine-slice asset wired through the existing UI texture pipeline and render arbitrary React content inside.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/ui/Tooltip.tsx` | New | Tooltip behavior, timing, placement, and layout measurement |
| `src/components/screens/demos/TooltipDemoScreen.tsx` | New | Demo coverage for placements and ReactNode content |
| `src/components/screens/DemoHubScreen.tsx` | Modified | Enable tooltip demo route |
| `src/components/ui/index.ts` | Modified | Export Tooltip |
| `tools/texpacker/`, generated UI atlas outputs | Modified | Add dedicated tooltip nine-slice asset and regenerated atlas data |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tooltip clipping inside overflow containers | Med | Document v1 limitation in spec/demo |
| Initial flicker or bad placement | Med | Hide until measured, then reveal |
| Nine-slice border scaling looks wrong | Low | Tune slice values with demo review |

## Rollback Plan

Remove `Tooltip`, demo wiring, and tooltip asset entries; regenerate the UI atlas to restore the previous asset manifest.

## Dependencies

- `UI_IMPROVEMENT_PLAN.md` Step 18 Tooltip
- Existing `@pixi/react` + `@pixi/layout` patterns in `Panel.tsx`, `Slider.tsx`, and DemoHub

## Success Criteria

- [ ] Hovering a wrapped target shows a delayed tooltip and pointer out hides it immediately.
- [ ] Tooltip accepts arbitrary ReactNode content, supports top/bottom/left/right hints, and does not resize surrounding layout.
