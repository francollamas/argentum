# Design: Tooltip UI

## Technical Approach

Implement `Tooltip` as an in-canvas wrapper built with `@pixi/react` + `@pixi/layout`, following the measured-layout pattern already used in `src/components/ui/Slider.tsx`. A relative root will render one trigger wrapper plus an absolutely positioned tooltip layer. Hover starts a short timer; timer completion mounts the tooltip shell hidden, waits for layout measurements from both trigger and tooltip nodes, computes offsets for the requested placement, then reveals it. Pointer out cancels pending show and hides immediately.

## Architecture Decisions

### Decision: Measure layout instead of hard-coded offsets

**Choice**: Read `layout.computedLayout` from trigger and tooltip refs, subscribing to `layout` events as `Slider.tsx` does.
**Alternatives considered**: Fixed placement offsets; DOM-style measurement.
**Rationale**: The UI already relies on Pixi layout events, and natural sizing is a hard requirement.

### Decision: Use a sibling tooltip layer with `eventMode='none'`

**Choice**: Keep the trigger in its own measured wrapper and render the tooltip as an absolute sibling inside the same relative root.
**Alternatives considered**: Clone the child and inject handlers; attach hover to a root containing both trigger and tooltip.
**Rationale**: This preserves the single trigger contract, keeps child behavior intact, and guarantees immediate hide when the pointer leaves the trigger.

### Decision: Reuse the existing UI atlas pipeline

**Choice**: Add `tools/texpacker/ui/tooltip.svg` and regenerate `src/assets/ui/ui.png`, `src/assets/ui/ui.json`, and `src/assets/ui/spritesheets.json`.
**Alternatives considered**: Inline drawing with `Graphics`; loading a standalone texture.
**Rationale**: All UI chrome already ships through `uiManager`/`useUITexture`. Also, the generated atlas already references `tooltip`, so the source SVG must exist to keep assets reproducible.

## Data Flow

`pointerover` on trigger wrapper
→ start delay timer
→ timer completes
→ mount hidden tooltip
→ `layout` events provide trigger/tooltip sizes
→ resolve `{x,y}` from placement helper
→ show tooltip
→ `pointerout`
→ clear timer + hide immediately

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/Tooltip.tsx` | Create | Tooltip wrapper, timing, measurement, placement, single-child validation |
| `src/components/ui/index.ts` | Modify | Export `Tooltip` |
| `src/components/screens/demos/TooltipDemoScreen.tsx` | Create | Demo for top/bottom/left/right placements and mixed ReactNode content |
| `src/components/screens/DemoHubScreen.tsx` | Modify | Wire Tooltip demo import and route |
| `tools/texpacker/ui/tooltip.svg` | Create | Minimal thin-border nine-slice source asset |
| `src/assets/ui/ui.json` | Modify | Generated tooltip frame metadata |
| `src/assets/ui/ui.png` | Modify | Generated tooltip atlas bitmap |
| `src/assets/ui/spritesheets.json` | Modify | Generated texture name mapping |
| `src/components/ui/Tooltip.test.tsx` | Create | Vitest coverage for delay, cancel, and placement helper behavior |

## Interfaces / Contracts

```ts
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

type TooltipProps = {
  content: ReactNode
  placement?: TooltipPlacement
  delayMs?: number
  children: ReactElement
  layout?: Record<string, unknown>
}
```

`Tooltip` will enforce `Children.only(children)`. Position calculation should live in a small pure helper inside the same module or `src/components/ui/tooltipPosition.ts` so timing/render code stays separate from placement math.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Delay, cancel, single-child validation | Vitest with fake timers and component rendering |
| Unit | Placement math for top/bottom/left/right | Pure helper assertions from known trigger/tooltip bounds |
| Integration | DemoHub wiring and tooltip content rendering | Render demo screen and assert tooltip route/components mount |
| E2E | Not available | No E2E layer configured |

## Migration / Rollout

No migration required. Regenerate UI assets with `pnpm generate-assets` before verification.

## Open Questions

- [ ] Confirm the default hover delay value to encode in `Tooltip.tsx` and demos.
