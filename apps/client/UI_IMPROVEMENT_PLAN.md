# UI Improvement Plan — Pixi Layout & Pixi React Compliance (v2)

## Objective

Refactor all existing UI components and build new ones so that:
1. Every component uses `@pixi/layout` (flexbox via Yoga) correctly — no manual `x`/`y` positioning inside layout trees.
2. Every component uses `@pixi/react` JSX correctly — proper `extend()`, no imperative hacks.
3. Tailwind helper (`tw`) is the preferred way to express layout styles.
4. Building UI feels like DOM development: composable, predictable, flex-based.
5. Each component is verified in its own dedicated demo screen, accessible from a main demo hub.

## Context for Future Sessions

- **Stack**: React 19, PixiJS 8, `@pixi/react`, `@pixi/layout`, Zustand, Vite, Biome, Tauri v2.
- **Fonts**: MSDF bitmap fonts generated at 42px base via `msdf-bmfont-xml`. Families: `medievalsharp-regular`, `opensans-regular`, `crimsomtext-regular`, `tahoma-regular`. All loaded via `Assets.load()` from `.fnt` files in `public/fonts/`.
- **Textures**: UI textures loaded via `useUITexture(name)` from `uiManager`. Nine-slice sprites are used for scalable backgrounds (Panel, Button, Input, ProgressBar).
- **Layout setup**: `LayoutResizer` component at root (`src/components/layout/LayoutResizer.tsx`) sets stage layout to screen dimensions and listens for resize events.
- **File conventions**: PascalCase for components, camelCase for utils. Biome formatter (tabs, single quotes, no semicolons). Components in `src/components/ui/`, hooks in `src/hooks/`.
- **Key `@pixi/layout` rules**:
  - `anchor` and `pivot` are **ignored** on layout nodes. Use `transformOrigin`.
  - `position.x/y` is always `0` and `scale.x/y` is always `1` on layout nodes.
  - `backgroundColor`, `borderRadius`, `overflow` only work on `layoutContainer`/`layoutSprite` (Layout* components), not plain `pixiContainer`.
  - `objectFit`/`objectPosition` only work on leaf nodes, not containers.
  - NineSliceSprite inside a layout needs `applySizeDirectly: true` or absolute positioning to act as background.
  - Use `isLeaf: true` on containers that should be treated as leaf nodes by layout.
  - Prefer `tw` tagged template for layout styles. Merge with object spread for dynamic values.
- **Skills available**: Two agent skills exist under `.agents/skills/`:
  - `pixi-react` — generating components, sprites, graphics, text, and interactive elements with `@pixi/react`
  - `pixi-layout` — building flexbox UI layouts with `@pixi/layout` inside PixiJS. **Load these skills at the start of each session.**

## Viewport & Scaling Strategy

The client uses an **Adaptive / Expand Viewport** — no fixed design resolution, no letterboxing, no stretching.

- **Application**: `resizeTo={window}`, `resolution={window.devicePixelRatio}`, `autoDensity={true}`. The canvas fills the window. Coordinates are in CSS pixels.
- **LayoutResizer**: Sets the root layout container to `app.screen.width` x `app.screen.height` (actual screen dimensions). On resize, updates layout dimensions. No scaling is applied.
- **UI components**: Use `@pixi/layout` flexbox to adapt to available space. Panels anchor to edges (top-left, bottom-center, etc.), content centers. Text stays at fixed pixel size — **never scales**.
- **Game world** (future): Expandable viewport — camera centered on player, more tiles visible on bigger screens. Separate container from UI overlay. The game world can have its own scale for tile rendering.

### Text scaling rule

`@pixi/layout` defaults text to `flexShrink: 1` + `objectFit: 'scale-down'`, which causes text to shrink when the parent container is too small. **All text nodes must use `flexShrink: 0`** to prevent unwanted scaling. If text overflows, the parent container handles it (`overflow: 'hidden'` or `overflow: 'scroll'`).

### Layer architecture (target)

```
Stage (no layout)
  └── LayoutResizer (layout root, actual screen dimensions)
        ├── WorldContainer (map, camera, tiles) — expandable, own scale
        └── UIOverlay (HUD, anchored to edges via flex)
```

Non-game screens (login, character creation, etc.) replace the WorldContainer with their own centered layout content.

---

## Demo Screen Architecture

Instead of a single monolithic `LayoutDemoScreen`, we use:

- **`DemoHubScreen`** (`src/components/screens/DemoHubScreen.tsx`) — Main screen with a list of buttons, one per demo. Simple state-based routing (useState with screen name). On button press, sets the active screen. No need for back navigation — refreshing the page returns to the hub.
- **Per-component demo screens** (`src/components/screens/demos/`) — Each screen tests one component (or a small group) with all variants and edge cases. Named `{Component}DemoScreen.tsx`.
- The old `LayoutDemoScreen.tsx` is deprecated (code commented out, references removed from `App.tsx`). `App.tsx` renders `DemoHubScreen` instead.

---

## Key Problems Identified

| # | Problem | Where | Impact |
|---|---------|-------|--------|
| 1 | `scale` prop used to size components | Button, CheckBox, Switch, RadioGroup, LayoutDemoScreen | Layout calculates on unscaled dimensions -> wrong sizes in flex flow |
| 2 | Manual `x`/`y` positioning inside layout containers | Button (textX/textY), Input (textX), ProgressBar (label x/y), RadioGroup (offsetX/offsetY), CheckBox/Switch (icon+text x/y) | Defeats the purpose of flexbox layout |
| 3 | `anchor` used on layout nodes | Label, Input, ProgressBar (via Label), CheckBox, Switch | Ignored by layout engine — text not positioned correctly |
| 4 | Manual text measurement hack | Button (creates temp BitmapText to measure) | Fragile, unnecessary with flexbox centering |
| 5 | Invisible hit-rect Graphics hack | CheckBox, Switch | Unnecessary — layout + eventMode handles hit areas |
| 6 | Font size `* 0.5` multiplier | Input | Hack to compensate for large base font |
| 7 | `extend()` called in every component file | All components | Redundant, should be centralized |
| 8 | Panel has no layout — just visual wrapper | Panel | Every consumer must add inner layoutContainer with duplicated width/height |
| 9 | LayoutDemoScreen uses hardcoded pixel grid | LayoutDemoScreen | Not responsive, not using flex properly |
| 10 | Components don't participate in parent flex correctly | Most components report size via `layout={{ width, height }}` on root but use manual internals | Inconsistent — some work in flex, some don't |

---

## Steps

### Step 0: Deprecate LayoutDemoScreen, create DemoHub, centralize `extend()`, add font variants
**Status**: `done`

**What**:
1. Comment out all code in `src/components/screens/LayoutDemoScreen.tsx` and remove its import/usage from `App.tsx`.
2. Create `src/components/screens/DemoHubScreen.tsx` — a simple screen with state-based routing. Initially shows a column of buttons (one per future demo). When a button is pressed, it renders the corresponding demo screen. Refreshing resets to the hub. Wire it into `App.tsx` in place of `LayoutDemoScreen`.
3. Create `src/config/pixiExtensions.ts` that calls `extend()` once with ALL PixiJS classes used across the project (Container, Sprite, NineSliceSprite, BitmapText, Graphics, etc.) plus LayoutContainer and other `@pixi/layout` components. Import this file in `main.tsx` before anything else.
4. Remove all per-component `extend()` calls from every UI component file.
5. Add font size variants to `src/config/typography.ts`. New variant scheme:
   - `titleLg` (48), `title` (36), `titleSm` (24)
   - `body` (18), `bodySm` (14)
   - `label` (16), `labelSm` (12)
   - `button` (18), `buttonSm` (14)
   - Keep `fontFamily` mappings as they are. These sizes are the **actual render sizes** — no multipliers needed.
   - Review and adjust sizes after seeing them rendered. The key principle: **no more scale multipliers on font sizes**.

**Verify**: `pnpm linter-check` passes. App boots without `extend()` errors. DemoHub screen renders with placeholder buttons. All existing components may look wrong — that's expected, we fix them in subsequent steps.

---

### Step 1: Label
**Status**: `pending`

**What**:
- Remove `anchor` prop (ignored by layout). Use layout alignment from parent instead.
- Remove `x`/`y` props — Label should be positioned by parent flex layout.
- Accept `font` (typography variant name) and `color` props.
- Keep `layout={{ width: 'intrinsic', height: 'intrinsic' }}` (current approach is correct for text).
- Support an optional `layoutStyle` pass-through prop for layout overrides (e.g., `alignSelf`, `flex`).

**API after refactor**:
```tsx
<Label text="Hello" font="title" color={Colors.gold} />
<Label text="Subtitle" font="body" color={Colors.silver} />
```

**Verify**: Create `src/components/screens/demos/LabelDemoScreen.tsx`. Show Labels with each font variant (`titleLg`, `title`, `titleSm`, `body`, `bodySm`, `label`, `labelSm`, `button`, `buttonSm`) and various colors. Add button to DemoHub. Screenshot review with user.

---

### Step 2: Panel
**Status**: `pending`

**What**:
- Panel becomes a **flex layout container** with NineSliceSprite background.
- NineSliceSprite is positioned with `position: 'absolute'` inside the layout container, filling the full area (`width: '100%'`, `height: '100%'`).
- Panel accepts layout-related props: `padding`, `gap`, `flexDirection` (defaulting to `column`, `padding: 16`, `gap: 8`).
- Also accepts `width` and `height` (number or string like `'auto'`).
- Children are direct flex children — **no need for inner `layoutContainer` wrapper** in consumers.
- The root element should be a `layoutContainer` (not `pixiContainer`) so it can participate in layout properly.

**API after refactor**:
```tsx
<Panel padding={16} gap={8} flexDirection="column" width={300}>
  <Label text="Title" font="title" />
  <Label text="Content goes here" font="body" />
</Panel>
```

**Verify**: Create `src/components/screens/demos/PanelDemoScreen.tsx`. Show Panels with various configurations: different padding/gap, column vs row, auto-height vs fixed, nested panels. Add button to DemoHub. Screenshot review with user.

---

### Step 3: Button
**Status**: `pending`

**What**:
- Remove `scale`-based sizing entirely. Button renders at actual pixel size.
- Remove manual text measurement hack (`new BitmapText()` for measuring).
- Use flexbox to center text inside button: `justifyContent: 'center'`, `alignItems: 'center'`.
- NineSliceSprite as background via `position: 'absolute'`, `width: '100%'`, `height: '100%'`.
- Sizing: auto-size based on text content + padding, OR accept explicit `width`/`height`.
- `variant` controls padding and font variant (not scale). E.g., `normal` uses `button` font with more padding, `small` uses `buttonSm` font with less padding.
- Remove `x`/`y` props — positioned by parent flex.
- Keep hover/press state logic (texture swapping).

**API after refactor**:
```tsx
<Button text="Conectar" onPress={handleConnect} />
<Button text="OK" variant="small" onPress={handleOK} />
<Button text="Wide" width={200} onPress={handleWide} />
```

**Verify**: Create `src/components/screens/demos/ButtonDemoScreen.tsx`. Show both variants, buttons with short/long text, explicit width, row of buttons, disabled state if applicable. Add button to DemoHub. Screenshot review with user.

---

### Step 4: CheckBox
**Status**: `pending`

**What**:
- Remove `scale` prop. Sprite renders at intrinsic texture size (or explicit fixed size).
- Remove invisible hit-rect Graphics hack. Set `eventMode='static'` on the root container — layout gives it proper bounds.
- Use flexbox row layout: icon sprite + text label with `gap`.
- Vertical centering via `alignItems: 'center'`.
- Remove `anchor` on text — layout handles positioning.
- Remove `x`/`y` props — positioned by parent flex.

**API after refactor**:
```tsx
<CheckBox checked={equipped} onChange={setEquipped} text="Espada de hierro" />
<CheckBox checked={selected} onChange={setSelected} text="Option" variant="radio" />
```

**Verify**: Create `src/components/screens/demos/CheckBoxDemoScreen.tsx`. Show normal and radio variants, checked/unchecked states, with and without text, inside a Panel. Add button to DemoHub. Screenshot review with user.

---

### Step 5: Switch
**Status**: `pending`

**What**:
- Same refactor pattern as CheckBox. Remove `scale`, remove hit-rect hack, use flexbox.
- Use flexbox row: switch sprite + text label with `gap` and `alignItems: 'center'`.
- Remove `anchor` on text.
- Remove `x`/`y` props.

**API after refactor**:
```tsx
<Switch enabled={music} onChange={setMusic} text="Musica" />
```

**Verify**: Create `src/components/screens/demos/SwitchDemoScreen.tsx`. Show on/off states, with and without text, inside a Panel with multiple switches. Add button to DemoHub. Screenshot review with user.

---

### Step 6: RadioGroup
**Status**: `pending`

**What**:
- Remove `scale` prop and manual offset calculation (`offsetX`/`offsetY`).
- Use flexbox: parent container with `flexDirection: column` (or `row`) and `gap`.
- Each item is a CheckBox with `variant='radio'`.
- RadioGroup manages selected state and delegates rendering to CheckBox items.
- Remove `x`/`y` props.

**API after refactor**:
```tsx
<RadioGroup
  items={[{ text: 'Guerrero' }, { text: 'Mago' }, { text: 'Arquero' }]}
  selectedIndex={selectedClass}
  onChange={setSelectedClass}
  direction="vertical"
  gap={8}
/>
```

**Verify**: Create `src/components/screens/demos/RadioGroupDemoScreen.tsx`. Show vertical and horizontal variants, different item counts, inside Panels. Add button to DemoHub. Screenshot review with user.

---

### Step 7: ProgressBar
**Status**: `pending`

**What**:
- Remove manual `x`/`y` positioning for label and value text.
- Background NineSliceSprite and fill NineSliceSprite are positioned absolutely.
- Text overlay (label + value) is a flex row on top: label left-aligned, value centered or right-aligned.
- Use layout `position: 'absolute'` for the background and fill layers, and a relative flex container for the text layer.
- Remove `x`/`y` props — positioned by parent flex.
- Accept `width` and `height` or use flex sizing.

**API after refactor**:
```tsx
<ProgressBar value={320} max={500} fillColor={Colors.barHp} label="HP" textVariant="amount" />
```

**Verify**: Create `src/components/screens/demos/ProgressBarDemoScreen.tsx`. Show bars with various fill levels (0%, 42%, 100%), different colors (HP, MP, Stamina, XP), amount vs percentage text, inside a Panel. Add button to DemoHub. Screenshot review with user.

---

### Step 8: Input
**Status**: `pending`

**What**:
- Remove `fontSize * 0.5` hack. Use the `body` font variant from typography (18px).
- Remove manual `textX`/`textY` calculation. Use flexbox to position text inside the input (`alignItems: 'center'`, padding for horizontal inset).
- NineSliceSprite background via `position: 'absolute'`.
- Keep DOM input strategy (invisible `<input>` for keyboard capture) — this is the correct approach for PixiJS text input and maximizes platform compatibility.
- Remove `x`/`y` props — positioned by parent flex.
- Input should fill available width by default (`flex: 1` or explicit `width`).
- `align` prop controls `justifyContent` for the text.

**API after refactor**:
```tsx
<Input placeholder="Username" value={username} onChange={setUsername} />
<Input placeholder="Password" value={password} onChange={setPassword} secure />
```

**Verify**: Create `src/components/screens/demos/InputDemoScreen.tsx`. Show normal input, password input, different alignments (left, center), placeholder states, active/inactive, inside a Panel. Add button to DemoHub. Screenshot review with user.

---

### Step 9: Divider (NEW)
**Status**: `pending`

**What**:
- Simple horizontal or vertical line component.
- Uses `layoutContainer` with `backgroundColor` and fixed thickness (1-2px).
- Direction: `horizontal` (default, full width via `alignSelf: 'stretch'` or `width: '100%'`, `height: 1`) or `vertical`.

**API**:
```tsx
<Divider />
<Divider direction="vertical" color={Colors.metalDark} thickness={2} />
```

**Verify**: Create `src/components/screens/demos/DividerDemoScreen.tsx`. Show horizontal dividers between Labels inside a Panel, vertical dividers between elements in a row. Add button to DemoHub. Screenshot review with user.

---

### Step 10: Slider (NEW)
**Status**: `pending`

**What**:
- Horizontal slider with track, fill, and draggable handle.
- Track and fill use `layoutContainer` with `backgroundColor` or NineSliceSprites.
- Handle is a sprite that responds to `onPointerDown` + global `onPointerMove` for drag.
- Props: `value`, `min`, `max`, `onChange`, `width` (or flex sizing).
- Track is the base container. Fill and handle are positioned absolutely within it.

**API**:
```tsx
<Slider value={volume} min={0} max={100} onChange={setVolume} />
```

**Verify**: Create `src/components/screens/demos/SliderDemoScreen.tsx`. Show slider with label showing current value, multiple sliders with different ranges, inside a Panel. Add button to DemoHub. Screenshot review with user.

---

### Step 11: IconButton (NEW)
**Status**: `pending`

**What**:
- Square button with an icon sprite (from UI texture atlas).
- NineSliceSprite background with hover/press states (reuse Button texture logic).
- Uses flexbox centering for the icon sprite.
- Props: `icon` (texture name via `useUITexture`), `size`, `onPress`.

**API**:
```tsx
<IconButton icon="sword-icon" size={48} onPress={handleAttack} />
```

**Verify**: Create `src/components/screens/demos/IconButtonDemoScreen.tsx`. Show row of icon buttons with different icons, different sizes, hover/press states. Add button to DemoHub. Screenshot review with user.

---

### Step 12: TabBar (NEW)
**Status**: `pending`

**What**:
- Row of tab buttons, one active at a time.
- Each tab is a Button-like element with active/inactive visual state (different tint or texture).
- Uses flexbox row layout with `gap`.
- Props: `tabs` (array of `{ label: string }`), `activeIndex`, `onChange`.

**API**:
```tsx
<TabBar
  tabs={[{ label: 'Stats' }, { label: 'Skills' }, { label: 'Items' }]}
  activeIndex={activeTab}
  onChange={setActiveTab}
/>
```

**Verify**: Create `src/components/screens/demos/TabBarDemoScreen.tsx`. Show TabBar with 3 tabs, content below switches when tab changes, inside a Panel. Add button to DemoHub. Screenshot review with user.

---

### Step 13: ScrollView (NEW)
**Status**: `pending`

**What**:
- Wraps `layoutContainer` with `overflow: 'scroll'` and `trackpad` physics config.
- Props: `width`, `height`, `direction` (vertical/horizontal/both), `children`.
- Handles scroll physics configuration internally (maxSpeed, constrain, etc.).
- Direction maps to constraining the unused axis.

**API**:
```tsx
<ScrollView width={300} height={200}>
  {items.map(item => <Label key={item.id} text={item.name} font="body" />)}
</ScrollView>
```

**Verify**: Create `src/components/screens/demos/ScrollViewDemoScreen.tsx`. Show ScrollView with 20+ items, verify scroll/drag works smoothly, inside a Panel. Add button to DemoHub. Screenshot review with user.

---

### Step 14: Dropdown/Select (NEW)
**Status**: `pending`

**What**:
- Closed state: shows selected value in an Input-like container with down-arrow indicator.
- Open state: shows a ScrollView (or simple list) with options below the trigger.
- Uses `position: 'absolute'` for the dropdown list relative to the trigger.
- Props: `options` (string array), `selectedIndex`, `onChange`, `placeholder`.
- Closes on selection or click outside.

**API**:
```tsx
<Dropdown
  options={['Servidor 1', 'Servidor 2', 'Servidor 3']}
  selectedIndex={selectedServer}
  onChange={setSelectedServer}
  placeholder="Elegir servidor"
/>
```

**Verify**: Create `src/components/screens/demos/DropdownDemoScreen.tsx`. Show dropdown closed and verify it opens, selects, closes. Multiple dropdowns on screen. Add button to DemoHub. Screenshot review with user.

---

### Step 15: Tooltip (NEW)
**Status**: `pending`

**What**:
- Appears on `onPointerOver` of a target element, disappears on `onPointerOut`.
- Panel-styled popup with text content.
- Positioned near the pointer using absolute positioning relative to the layout root.
- Auto-positions to avoid going off-screen edges.
- Props: wraps children, `content` (string or ReactNode), `position` hint (top/bottom/left/right).

**API**:
```tsx
<Tooltip content="Espada de hierro - Damage: 15-25">
  <IconButton icon="sword-icon" size={48} />
</Tooltip>
```

**Verify**: Create `src/components/screens/demos/TooltipDemoScreen.tsx`. Show elements with tooltips on hover, verify positioning near edges of screen. Add button to DemoHub. Screenshot review with user.

---

### Step 16: Dialog/Modal (NEW)
**Status**: `pending`

**What**:
- Fullscreen overlay (semi-transparent `layoutContainer` with `backgroundColor` at low alpha) with centered Panel.
- Panel has title bar, content area, and action buttons row at the bottom.
- Uses flexbox: column for overall layout, row for the buttons.
- Props: `title`, `children`, `actions` (array of `{ text, onPress }`), `onClose`, `visible`.
- When `visible=false`, component returns null (excluded from layout).

**API**:
```tsx
<Dialog
  visible={showDialog}
  title="Confirmar"
  onClose={() => setShowDialog(false)}
  actions={[
    { text: 'Cancelar', onPress: handleCancel },
    { text: 'Aceptar', onPress: handleAccept },
  ]}
>
  <Label text="Estas seguro?" font="body" />
</Dialog>
```

**Verify**: Create `src/components/screens/demos/DialogDemoScreen.tsx`. Show button that opens dialog, dialog has title + text + action buttons, closes on action. Add button to DemoHub. Screenshot review with user.

---

### Step 17: Full Integration Demo
**Status**: `pending`

**What**:
- Create `src/components/screens/demos/FullDemoScreen.tsx` — a single screen that combines ALL components into realistic UI panels (login form, settings, inventory, stats, etc.), similar to the original LayoutDemoScreen but using the new refactored components.
- Uses flex layout for the entire screen — `flexWrap: 'wrap'` with `gap` to auto-arrange panels.
- No hardcoded pixel grid.
- Panels have explicit widths but flexible heights (content-sized).
- Add button to DemoHub.

**Verify**: Full visual review with user. Screenshot. Iterate until everything looks correct and functional together.

---

### Step 18: Final Cleanup
**Status**: `pending`

**What**:
- Delete the commented-out `LayoutDemoScreen.tsx` file entirely.
- Remove any unused imports, dead code, old hacks across all UI files.
- Run `pnpm linter` to auto-fix formatting.
- Run `pnpm linter-check` to verify.
- Run `pnpm test` to ensure no regressions.
- Run `pnpm build` to verify production build.
- Update this plan marking all steps as `done`.

---

## Execution Protocol

1. **Start each session** by reading this plan file for full context. Also load the `pixi-layout` and `pixi-react` skills.
2. Find the first step with status `pending` — that's the current task.
3. Implement the step following the description and API.
4. Create/update the corresponding demo screen in `src/components/screens/demos/`.
5. Add the demo screen button to `DemoHubScreen`.
6. Run `pnpm linter-check` to ensure code quality.
7. Tell the user the step is ready for visual review.
8. User reviews screenshot and provides feedback.
9. Iterate until the step is approved by the user.
10. Mark step status as `done` in this file.
11. Move to next step (or end session if context is getting large).

## Layout Considerations

These guidelines apply to all steps and demo screens. They complement the Component API Principles below.

### Spacing: prefer `gap` on parent containers over `margin` on children

When elements need spacing between them, the parent container should define it via `gap` — not each child via `margin`. This keeps spacing decisions in one place and makes the layout predictable.

**Do this** — parent owns the rhythm:
```tsx
<layoutContainer layout={tw`flex-col gap-6`}>
  <SectionA />
  <SectionB />
  <SectionC />
</layoutContainer>
```

**Avoid this** — children managing their own spacing:
```tsx
<layoutContainer layout={tw`flex-col`}>
  <SectionA />
  <SectionB layoutStyle={{ marginTop: 16 }} />
  <SectionC layoutStyle={{ marginTop: 16 }} />
</layoutContainer>
```

When spacing is **not uniform** (e.g., sections need more separation than items within a section), group related elements into sub-containers, each with its own `gap`, and use the parent's `gap` for inter-section spacing:

```tsx
<layoutContainer layout={tw`flex-col gap-6`}>       {/* between sections */}
  <layoutContainer layout={tw`flex-col gap-3`}>      {/* within section */}
    <Label text="Section Title" font="titleSm" />
    <Label text="Item 1" font="body" />
    <Label text="Item 2" font="body" />
  </layoutContainer>
  <layoutContainer layout={tw`flex-col gap-3`}>
    <Label text="Another Section" font="titleSm" />
    <Label text="Item A" font="body" />
  </layoutContainer>
</layoutContainer>
```

### Child self-alignment: `alignSelf` is fine on the child

`alignSelf` is part of the flexbox spec — it exists for a child to override the parent's `alignItems` as an exception. This is not a hack; it's idiomatic flexbox. No need to wrap in a container just for alignment.

```tsx
<layoutContainer layout={tw`flex-col items-start`}>
  <Label text="Left" font="body" />
  <Label text="Centered" font="body" layoutStyle={{ alignSelf: 'center' }} />
</layoutContainer>
```

### Intrinsic size props: `width`/`height` on children are fine

When a child has a specific intrinsic size requirement (e.g., a fixed-width label column in a table-like row, or a color swatch square), setting `width`/`height` directly on the child is correct. No wrapper needed — it's a property of the element, not of the surrounding layout.

### Rule of thumb

| What you need | Who decides | How |
|---------------|-------------|-----|
| Spacing between siblings | Parent container | `gap` |
| Non-uniform section spacing | Parent + sub-containers | Nested `gap` at different levels |
| One child aligned differently | The child itself | `alignSelf` |
| Fixed size of an element | The element itself | `width` / `height` in layout |

---

## Component API Principles

These rules apply to ALL UI components going forward:

- **No `x`/`y` props** — components are positioned by parent flex layout.
- **No `scale` props** — size is controlled via layout (width/height, flex, padding).
- **No `anchor`/`pivot`** — alignment is done via flexbox (`alignItems`, `justifyContent`).
- **No manual measurement** — flexbox handles sizing and centering automatically.
- **Layout props via `tw`** — prefer `tw\`flex-col items-center gap-4\`` over manual style objects.
- **`eventMode='static'`** on interactive elements — no invisible hit-rect hacks needed.
- **Textures via `useUITexture()`** — consistent texture loading from UI atlas.
- **Fonts via typography variants** — no raw font sizes in components, always reference a variant name.
- **Colors via `Colors` object** — centralized palette in `src/components/ui/colors.ts`.
- **NineSliceSprite backgrounds** use `position: 'absolute'`, `width: '100%'`, `height: '100%'` inside a layout container.
- **`flexShrink: 0` on all text nodes** — prevents text from scaling down when parent containers shrink. Text must always render at its intended pixel size.
