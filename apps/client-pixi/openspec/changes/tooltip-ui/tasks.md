# Tasks: Tooltip UI

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~330 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Tooltip component + demo + tests | PR 1 | Single PR; base=main |

## Phase 1: Asset & Infrastructure

- [x] 1.1 Create `tools/texpacker/ui/tooltip.svg` with thin-border nine-slice source asset
- [x] 1.2 Run `pnpm generate-assets` to regenerate UI atlas (ui.json, ui.png, spritesheets.json)

## Phase 2: Placement Helper (TDD)

- [x] 2.1 [RED] Write failing tests for `tooltipPosition.ts` — placement math for top/bottom/left/right with known trigger/tooltip bounds
- [x] 2.2 [GREEN] Create `src/components/ui/tooltipPosition.ts` with pure `resolvePlacement()` helper

## Phase 3: Tooltip Component (TDD)

- [x] 3.1 [RED] Write failing tests for Tooltip: hover delay timer, immediate cancel on pointer out, single-child validation
- [x] 3.2 [GREEN] Create `src/components/ui/Tooltip.tsx` with 300ms delay, layout measurement, nine-slice shell using `useUITexture('tooltip')`, and `Children.only` guard

## Phase 4: Demo & Integration

- [x] 4.1 Create `src/components/screens/demos/TooltipDemoScreen.tsx` with demos for top/bottom/left/right placements and mixed ReactNode content
- [x] 4.2 Modify `src/components/screens/DemoHubScreen.tsx` — import TooltipDemoScreen, add render route
- [x] 4.3 Modify `src/components/ui/index.ts` — export Tooltip
