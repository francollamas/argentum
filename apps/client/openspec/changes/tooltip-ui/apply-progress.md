# Apply Progress: Tooltip UI

## Mode

Strict TDD

## Completed Tasks

- [x] 1.1 Create `tools/texpacker/ui/tooltip.svg` with thin-border nine-slice source asset
- [x] 1.2 Run `pnpm generate-assets` to regenerate UI atlas (ui.json, ui.png, spritesheets.json)
- [x] 2.1 [RED] Write failing tests for `tooltipPosition.ts` — placement math for top/bottom/left/right with known trigger/tooltip bounds
- [x] 2.2 [GREEN] Create `src/components/ui/tooltipPosition.ts` with pure `resolvePlacement()` helper
- [x] 3.1 [RED] Write failing tests for Tooltip: hover delay timer, immediate cancel on pointer out, single-child validation
- [x] 3.2 [GREEN] Create `src/components/ui/Tooltip.tsx` with 300ms delay, layout measurement, nine-slice shell using `useUITexture('tooltip')`, and `Children.only` guard
- [x] 4.1 Create `src/components/screens/demos/TooltipDemoScreen.tsx` with demos for top/bottom/left/right placements and mixed ReactNode content
- [x] 4.2 Modify `src/components/screens/DemoHubScreen.tsx` — import TooltipDemoScreen, add render route
- [x] 4.3 Modify `src/components/ui/index.ts` — export Tooltip

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `tools/texpacker/ui/tooltip.svg` | Created | Added the dedicated thin-border tooltip source asset |
| `src/assets/ui/ui.json` | Modified | Regenerated atlas metadata with reproducible tooltip frame |
| `src/assets/ui/ui.png` | Modified | Regenerated UI atlas bitmap including the tooltip shell |
| `src/assets/ui/spritesheets.json` | Modified | Preserved the tooltip-to-ui spritesheet mapping |
| `src/components/ui/Tooltip.asset.test.ts` | Created | Added asset reproducibility coverage for the missing tooltip source and atlas entries |
| `src/components/ui/tooltipPosition.test.ts` | Created | Added placement helper tests for top, bottom, left, and right |
| `src/components/ui/tooltipPosition.ts` | Created | Added the pure placement helper used by the tooltip |
| `src/components/ui/Tooltip.test.tsx` | Created | Added hover delay, immediate hide, and single-child guard coverage |
| `src/components/ui/tooltipLayout.test.ts` | Created | Added coverage for the roomier tooltip shell padding and absolute overlay anchoring |
| `src/components/ui/tooltipLayerController.test.ts` | Created | Added coverage for global tooltip layer ownership and hide semantics |
| `src/components/ui/tooltipLayout.ts` | Created | Centralized tooltip shell spacing and measured bounds helpers |
| `src/components/ui/tooltipLayerController.ts` | Created | Added the controller that keeps the active tooltip in a single global layer |
| `src/components/ui/TooltipLayer.tsx` | Created | Added a top-level tooltip layer provider that renders tooltips above sibling panels |
| `src/components/ui/Tooltip.tsx` | Created | Implemented tooltip timing, measurement, positioning, and nine-slice shell rendering |
| `src/components/screens/demos/TooltipDemoScreen.tsx` | Created | Added placement and mixed-content tooltip demos |
| `src/components/screens/DemoHubScreen.tsx` | Modified | Wired the tooltip demo route into the demo hub |
| `src/components/ui/index.ts` | Modified | Exported the Tooltip component |
| `src/app/App.tsx` | Modified | Wrapped the app screen tree with the global tooltip layer provider |

## TDD Cycle Evidence

| Task | Test File | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-----------|-------|------------|-----|-------|-------------|----------|
| 1.1 | `src/components/ui/Tooltip.asset.test.ts` | Unit | N/A (new) | ✅ Written before asset creation | ✅ `pnpm test src/components/ui/Tooltip.asset.test.ts` | ✅ 2 cases | ✅ Clean |
| 1.2 | `src/components/ui/Tooltip.asset.test.ts` | Unit | N/A (new) | ✅ Written before asset generation | ✅ `pnpm test src/components/ui/Tooltip.asset.test.ts` | ✅ 2 cases | ✅ Clean |
| 2.1 | `src/components/ui/tooltipPosition.test.ts` | Unit | N/A (new) | ✅ Written before helper creation | ✅ `pnpm test src/components/ui/tooltipPosition.test.ts` | ✅ 2 cases | ✅ Clean |
| 2.2 | `src/components/ui/tooltipPosition.test.ts` | Unit | N/A (new) | ✅ Written before helper creation | ✅ `pnpm test src/components/ui/tooltipPosition.test.ts` | ✅ 2 cases | ✅ Clean |
| 3.1 | `src/components/ui/Tooltip.test.tsx` | Unit | N/A (new) | ✅ Written before component creation | ✅ `pnpm test src/components/ui/Tooltip.test.tsx` | ✅ 4 cases | ✅ Clean |
| 3.2 | `src/components/ui/Tooltip.test.tsx` | Unit | N/A (new) | ✅ Written before component creation | ✅ `pnpm test src/components/ui/Tooltip.test.tsx` | ✅ 4 cases | ✅ Clean |
| 4.1 | None | Unit | N/A (new) | FAILED — demo screen was implemented before a dedicated test existed | N/A | N/A | ✅ Clean |
| 4.2 | None | Unit | N/A (no pre-existing route test) | FAILED — demo hub wiring was implemented before a dedicated test existed | N/A | N/A | ✅ Clean |
| 4.3 | None | Unit | N/A (no pre-existing export test) | FAILED — export wiring was implemented before a dedicated test existed | N/A | N/A | ✅ Clean |
| R1 | `src/components/ui/Tooltip.asset.test.ts` | Unit | ✅ 2/2 | ✅ Updated before the SVG remediation | ✅ `pnpm test src/components/ui/Tooltip.asset.test.ts` | ✅ 2 shell invariants | ✅ Clean |
| R2 | `src/components/ui/tooltipLayout.test.ts` | Unit | ✅ 4/4 (`Tooltip.test.tsx`) | ✅ Written before padding/layout extraction | ✅ `pnpm test src/components/ui/tooltipLayout.test.ts` | ✅ 2 cases | ✅ Clean |
| R3 | `src/components/ui/tooltipLayerController.test.ts` + `src/components/ui/Tooltip.test.tsx` | Unit | ✅ 4/4 (`Tooltip.test.tsx`) | ✅ Written before global layer controller/provider work | ✅ `pnpm test src/components/ui/tooltipLayerController.test.ts` + `pnpm test src/components/ui/Tooltip.test.tsx` | ✅ 2 ownership cases | ✅ Clean |

## Test Summary

- **Total tests written**: 12
- **Total tests passing**: 12
- **Layers used**: Unit (12), Integration (0), E2E (0)
- **Approval tests**: None — no refactoring tasks
- **Pure functions created**: 1

## Commands Run

- `pnpm test src/components/ui/Tooltip.asset.test.ts`
- `pnpm test src/components/ui/tooltipPosition.test.ts`
- `pnpm test src/components/ui/Tooltip.test.tsx`
- `pnpm test src/components/ui/tooltipLayout.test.ts`
- `pnpm test src/components/ui/tooltipLayerController.test.ts`
- `pnpm generate-assets`
- `pnpm linter-check`
- `pnpm build`

## Deviations from Design

- The original design explicitly kept portal/layer rendering out of scope. This follow-up batch intentionally added a global tooltip layer provider because local subtree rendering could not guarantee top-layer behavior after visual review.
- Demo wiring and export tasks landed without dedicated test-first coverage. The implementation matches the design behavior, but those tasks should receive follow-up tests if strict TDD compliance must be absolute.

## Issues Found

- The generated atlas already referenced `tooltip`, but `tools/texpacker/ui/tooltip.svg` was missing. The new source asset restores reproducible asset generation.
- `pnpm build` still fails on a pre-existing unresolved import in `src/importers/texturesImporter.ts` for `../assets/textures/spritesheets.json`. This failure is outside the tooltip remediation files and remained after regenerating assets.

## Follow-up Remediation

- Increased tooltip shell padding to `16x12` with a slightly larger internal gap so content clears the border visually.
- Simplified `tools/texpacker/ui/tooltip.svg` to a single opaque rect with one thin border, then regenerated the UI atlas.
- Moved live tooltip rendering into `TooltipLayerProvider`, so tooltips now mount in a screen-level absolute layer instead of inside the trigger subtree.

## Status

9/9 tasks complete. Follow-up remediation applied and ready for verify, with the historical strict-TDD compliance caveat on tasks 4.1-4.3 and a separate pre-existing build failure outside this change.
