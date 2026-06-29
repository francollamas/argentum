---
name: pixi-layout
description: >
  Expert guide for @pixi/layout — Yoga-based flexbox layout system for PixiJS.
  Trigger: When building UI layouts in PixiJS, using flexbox in PixiJS, or integrating @pixi/layout with @pixi/react.
---

## When to Use

- Building UI layouts, HUDs, menus, or responsive interfaces in PixiJS
- Using flexbox-style positioning for PixiJS display objects
- Integrating `@pixi/layout` with `@pixi/react`
- Needing scrollable containers, backgrounds, or borders in PixiJS
- Sizing sprites/text with `objectFit` / `objectPosition` (like CSS)

## Installation

```bash
npm install pixi.js @pixi/react @pixi/layout
```

## Critical Imports

```ts
// MUST import before creating Application (registers mixins)
import "@pixi/layout";

// React typings (adds layout JSX types globally)
import "@pixi/layout/react";

// Components
import {
  LayoutContainer,
  LayoutSprite,
  LayoutText,
  LayoutGraphics,
  Sprite,
  Text,
  Graphics,
} from "@pixi/layout/components";

// System access
import { Layout, LayoutSystem, getYogaConfig } from "@pixi/layout";

// Tailwind helper (experimental)
import { tw } from "@pixi/layout/tailwind";

// DevTools (optional, dev only)
import "@pixi/layout/devtools";
```

## Core Concepts

### Opt-in Layout

Layout is **only applied when explicitly enabled**. Children without `layout` are unaffected.

```ts
sprite.layout = true; // enable with defaults
sprite.layout = { width: 100 }; // enable with styles
sprite.layout = false; // disable
```

When `visible = false`, the node is excluded from layout calculations.

### Containers vs Leaf Nodes

| Type          | Examples                                                   | Behavior                                                                  |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Container** | `Container`, `LayoutContainer`                             | Arranges children via flexbox. Cannot use `objectFit`/`objectPosition`.   |
| **Leaf node** | `Sprite`, `Text`, `Graphics`, `BitmapText`, `TilingSprite` | Visual content. Uses `objectFit`/`objectPosition`. No children in layout. |

A Container can act as leaf: `layout = { isLeaf: true, objectFit: 'contain' }` (useful for PixiJS UI components that wrap multiple elements).

### Intrinsic Sizing

Leaf nodes default to `width: 'intrinsic', height: 'intrinsic'` (uses PixiJS bounds). Has a performance cost on many nodes. Prefer fixed sizes when possible:

```ts
sprite.layout = true; // equivalent to { width: 'intrinsic', height: 'intrinsic' }

// Better for performance:
sprite.layout = { width: texture.width, height: texture.height };
```

### Transform Origin & Normalization

- `position.x/y` are always `0`, `scale.x/y` are always `1` when layout is enabled
- Use `transformOrigin` (not `anchor`/`pivot`) for rotation/scaling pivot
- `anchor` and `pivot` are **ignored** when layout is active

```ts
sprite.layout = {
  width: 300,
  height: 300,
  objectFit: "cover",
  transformOrigin: "center",
};
sprite.rotation = 0.2; // rotates around center of layout box
sprite.scale = 2; // scales as if box was 600x600
```

Real position/scale available via: `sprite.layout.realX`, `sprite.layout.realY`, `sprite.layout.realScaleX`, `sprite.layout.realScaleY`.

### applySizeDirectly

For PixiJS UI components that override `width`/`height` setters:

```ts
progressBar.layout = { width: 300, height: 50, applySizeDirectly: true };
```

## Components

### LayoutContainer

Full flex container with background, border, overflow, and scroll support.

```ts
import { LayoutContainer } from "@pixi/layout/components";

const box = new LayoutContainer({
  layout: {
    width: 300,
    height: 300,
    padding: 10,
    gap: 10,
    overflow: "scroll",
    backgroundColor: 0x202020,
    borderColor: 0xffffff,
    borderRadius: 12,
    borderWidth: 1,
  },
  trackpad: { maxSpeed: 400, constrain: true }, // scroll physics
  // background: new Sprite(texture), // custom background (disables auto bg/border)
});
```

### LayoutView Wrappers

Single-child wrappers with background/border support: `LayoutSprite`, `LayoutText`, `LayoutGraphics`, `LayoutBitmapText`, `LayoutTilingSprite`, `LayoutNineSliceSprite`, `LayoutAnimatedSprite`, `LayoutHTMLText`, `LayoutMesh`.

```ts
const bunny = new LayoutSprite({
  texture,
  layout: {
    width: 100,
    height: 100,
    objectFit: "contain",
    backgroundColor: 0x444444,
    borderRadius: 8,
  },
});
```

### Re-exported PixiJS Components

`@pixi/layout/components` re-exports `Sprite`, `Text`, `Graphics`, etc. with layout applied **after** initialization (important for correct intrinsic sizing). Use these for plain leaf nodes without background/border needs.

**Key rule**: `backgroundColor`, `borderRadius`, `borderColor`, `overflow` only work on `Layout*` components, NOT on plain PixiJS objects.

## React Integration

### Boilerplate Setup

```tsx
import "@pixi/layout";
import "@pixi/layout/react"; // TypeScript JSX types
import { Container } from "pixi.js";
import { Application, extend, useApplication } from "@pixi/react";
import {
  LayoutContainer,
  LayoutSprite,
  LayoutText,
  Sprite,
} from "@pixi/layout/components";

// Register components for JSX (call once at module level)
extend({ Container, LayoutContainer, LayoutSprite, LayoutText, Sprite });
```

### LayoutResizer (responsive root)

```tsx
const LayoutResizer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const layoutRef = useRef<Container>(null);
  const { app } = useApplication();

  app.stage.layout = {
    width: window.innerWidth,
    height: window.innerHeight,
    justifyContent: "center",
    alignItems: "center",
  };

  app.renderer.on("resize", () => {
    app.stage.layout = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  return children;
};
```

### JSX Tag Names

After `extend()`, use **camelCase** tag names in JSX:

| Import            | JSX tag             |
| ----------------- | ------------------- |
| `Container`       | `<pixiContainer>`   |
| `LayoutContainer` | `<layoutContainer>` |
| `LayoutSprite`    | `<layoutSprite>`    |
| `LayoutText`      | `<layoutText>`      |
| `Sprite`          | `<sprite>`          |

### React App Shell

```tsx
export const App: React.FC = () => (
  <Application resizeTo={window} background="#1C1C1D">
    <LayoutResizer>{/* your layout tree here */}</LayoutResizer>
  </Application>
);
```

## React Examples

### Basic Flexbox Layout

```tsx
<layoutContainer
  layout={{
    width: 200,
    height: 250,
    padding: 10,
    gap: 10,
    flexDirection: "column",
    flexWrap: "wrap",
    alignContent: "flex-start",
    backgroundColor: "#0f172a",
  }}
>
  <layoutContainer
    layout={{
      height: 50,
      width: 50,
      backgroundColor: "#1e293b",
      borderWidth: 1,
      borderColor: "#fff",
    }}
  />
  <layoutContainer
    layout={{
      height: 50,
      width: 50,
      backgroundColor: "#1e293b",
      borderWidth: 1,
      borderColor: "#fff",
    }}
  />
  <layoutContainer
    layout={{
      height: 50,
      width: 50,
      backgroundColor: "#1e293b",
      borderWidth: 1,
      borderColor: "#fff",
    }}
  />
</layoutContainer>
```

### Mobile App Layout (absolute + flex)

```tsx
<layoutContainer
  layout={{
    width: 250,
    height: 475,
    padding: 10,
    flexDirection: "column",
    alignContent: "flex-start",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#fff",
  }}
>
  {/* Header */}
  <layoutContainer
    layout={{
      height: 60,
      backgroundColor: "#334155",
      borderWidth: 1,
      borderColor: "#fff",
    }}
  />
  {/* Content areas */}
  <layoutContainer
    layout={{ flex: 1, marginInline: 10, backgroundColor: "#334155" }}
  />
  <layoutContainer
    layout={{ flex: 2, marginInline: 10, backgroundColor: "#334155" }}
  />
  {/* Bottom nav - absolute */}
  <layoutContainer
    layout={{
      position: "absolute",
      width: "100%",
      bottom: 0,
      height: 64,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      backgroundColor: "#334155",
    }}
  >
    <layoutContainer
      layout={{ height: 40, width: 40, backgroundColor: "#475569" }}
    />
    <layoutContainer
      layout={{ height: 40, width: 40, backgroundColor: "#475569" }}
    />
    <layoutContainer
      layout={{ height: 40, width: 40, backgroundColor: "#475569" }}
    />
  </layoutContainer>
</layoutContainer>
```

### Sprite Grid with objectFit

```tsx
// After loading textures
<layoutContainer
  layout={{
    width: "80%",
    height: "80%",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  }}
>
  {textures.map((tex, i) => (
    <layoutSprite
      key={i}
      texture={tex}
      layout={{ width: 64, height: 64, objectFit: "contain" }}
    />
  ))}
</layoutContainer>
```

### Scrollable Container

```tsx
<layoutContainer
  layout={{
    width: 300,
    height: 400,
    overflow: "scroll",
    flexDirection: "column",
    gap: 8,
    padding: 12,
    backgroundColor: 0x202020,
    borderRadius: 12,
  }}
  trackpad={{ maxSpeed: 400, constrain: true, xConstrainPercent: -1 }}
>
  {items.map((item, i) => (
    <layoutContainer
      key={i}
      layout={{ height: 60, backgroundColor: 0x334155, borderRadius: 8 }}
    />
  ))}
</layoutContainer>
```

### Text with Word Wrap

```tsx
<layoutText
  text="This is a long line that should wrap inside the box."
  style={{ fill: 0xffffff, wordWrap: true }}
  layout={{ width: 250, height: 250 }}
/>
```

## Style Reference

### Sizing

| Property                | Values                                          | Notes                          |
| ----------------------- | ----------------------------------------------- | ------------------------------ |
| `width`, `height`       | `number` \| `'N%'` \| `'auto'` \| `'intrinsic'` | Border-box sizing              |
| `minWidth`, `minHeight` | `number` \| `'N%'`                              | Higher priority than flex      |
| `maxWidth`, `maxHeight` | `number` \| `'N%'`                              | Higher priority than flex      |
| `aspectRatio`           | `number` (e.g. `1.5` for 3:2)                   | Overrides cross-axis dimension |

### Flexbox

| Property                     | Values                                                                                                                   | Default                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `flexDirection`              | `'row'` \| `'row-reverse'` \| `'column'` \| `'column-reverse'`                                                           | `'row'`                            |
| `flexWrap`                   | `'nowrap'` \| `'wrap'` \| `'wrap-reverse'`                                                                               | `'nowrap'`                         |
| `flexGrow`                   | `number >= 0`                                                                                                            | `0`                                |
| `flexShrink`                 | `number >= 0`                                                                                                            | `1`                                |
| `flexBasis`                  | `number` \| `'auto'`                                                                                                     | `'auto'`                           |
| `flex`                       | `number`                                                                                                                 | Shorthand for grow                 |
| `justifyContent`             | `'flex-start'` \| `'center'` \| `'flex-end'` \| `'space-between'` \| `'space-around'` \| `'space-evenly'`                |                                    |
| `alignItems`                 | `'flex-start'` \| `'center'` \| `'flex-end'` \| `'stretch'` \| `'baseline'`                                              |                                    |
| `alignContent`               | `'flex-start'` \| `'center'` \| `'flex-end'` \| `'stretch'` \| `'space-between'` \| `'space-around'` \| `'space-evenly'` | `'stretch'`                        |
| `alignSelf`                  | Same as `alignItems`                                                                                                     | Per-child override                 |
| `gap`, `rowGap`, `columnGap` | `number`                                                                                                                 | Space between children (not edges) |

### Spacing

| Property                                          | Description                                           |
| ------------------------------------------------- | ----------------------------------------------------- |
| `margin`, `marginTop/Bottom/Left/Right`           | Space outside border box                              |
| `marginInline`                                    | Shorthand for left + right margin                     |
| `padding`, `paddingTop/Bottom/Left/Right`         | Space inside border box                               |
| `borderWidth`, `borderTop/Bottom/Left/RightWidth` | Border thickness (visual only on Layout\* components) |

### Positioning

| Property                         | Values                                               |
| -------------------------------- | ---------------------------------------------------- |
| `position`                       | `'relative'` (default) \| `'absolute'` \| `'static'` |
| `top`, `left`, `bottom`, `right` | `number` \| `'N%'`                                   |
| `start`, `end`                   | Direction-aware insets                               |

`absolute` removes from flex flow. `relative` uses insets as offsets from computed position. `static` ignores insets.

### Object Fitting (leaf nodes only)

| Property          | Values                                                             |
| ----------------- | ------------------------------------------------------------------ |
| `objectFit`       | `'fill'` \| `'contain'` \| `'cover'` \| `'none'` \| `'scale-down'` |
| `objectPosition`  | `'center'` \| `'top left'` \| `'bottom 10px right 20px'` etc.      |
| `transformOrigin` | `'center'` \| `'top left'` \| `'top 0px left 50px'` etc.           |

Text nodes default to `objectFit: 'scale-down'` (preserves font size).

### Visual (Layout\* components only)

| Property          | Description                                  |
| ----------------- | -------------------------------------------- |
| `backgroundColor` | Fill color (`number` or `'#hex'`)            |
| `borderColor`     | Border color (required for border to render) |
| `borderRadius`    | Corner radius                                |
| `overflow`        | `'visible'` \| `'hidden'` \| `'scroll'`      |

### Debug (requires `enableDebug`)

| Property                                      | Description                        |
| --------------------------------------------- | ---------------------------------- |
| `debug`                                       | Toggle debug overlay for this node |
| `debugHeat`                                   | Heatmap for layout performance     |
| `debugDrawMargin/Padding/Border/Flex/Content` | Toggle individual debug layers     |

## Runtime API

```ts
// Force recalculation next frame
sprite.layout.forceUpdate();

// Read computed layout box
const box = sprite.layout.computedLayout;
// box.left, box.top, box.width, box.height

// Read PixiJS-specific adjustments
const pixi = sprite.layout.computedPixiLayout;
// pixi.x, pixi.y, pixi.offsetX, pixi.offsetY, pixi.scaleX, pixi.scaleY

// Layout event
sprite.on("layout", (layout) => {
  const box = layout.computedLayout;
  // react to layout changes
});
// or: sprite.onLayout = (layout) => { ... };
```

### LayoutSystem

```ts
// Init with options
await app.init({
  layout: { autoUpdate: true, enableDebug: false, throttle: 100 },
});

// Access system
const system = app.renderer.layout;

// Manual update (if autoUpdate: false)
system.update(app.stage);

// Toggle debug at runtime
system.enableDebug(true);
```

### Default Styles Override

```ts
import { Layout } from "@pixi/layout";

Layout.defaultStyle = {
  leaf: { width: "intrinsic", height: "intrinsic" },
  container: { width: "auto", height: "auto" },
  shared: {
    transformOrigin: "50%",
    objectPosition: "center",
    flexShrink: 1,
    flexDirection: "row",
    alignContent: "stretch",
    flexWrap: "nowrap",
    overflow: "visible",
  },
};
```

## Updating Styles at Runtime

Partial updates merge with existing styles (no need to provide full object):

```ts
sprite.layout = { width: 200, objectFit: "contain" };

// Later, only update what changed:
sprite.layout = { width: 300, objectFit: "cover" };
```

## Tailwind Helper

The `tw` tagged template converts Tailwind-style class strings into `@pixi/layout` style objects. **Experimental** — not all Tailwind classes are supported yet.

```ts
import { tw } from "@pixi/layout/tailwind";

// Static usage
const container = new Container({
  layout: tw`flex flex-col items-center justify-center w-full h-full`,
});
// Produces: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }
```

```ts
// Dynamic usage with template literals
const layout = tw`flex ${isVertical ? "flex-col" : "flex-row"} gap-4`;
```

### React usage

```tsx
<layoutContainer layout={tw`flex flex-col items-center gap-4 w-full h-full`}>
  <layoutContainer layout={tw`w-80% h-80% bg-red-500`} />
</layoutContainer>
```

Class names follow Tailwind conventions: `flex-col`, `items-center`, `justify-between`, `gap-4`, `w-full`, `h-full`, `p-4`, `m-2`, `flex-1`, `flex-wrap`, etc.

## DevTools

The PixiJS DevTools browser extension can inspect layout properties in real-time.

### Setup

```ts
// Add this import to enable DevTools communication
import "@pixi/layout/devtools";
```

Install the extension from:

- [Chrome Web Store](https://chrome.google.com/webstore/detail/pixijs-devtools/dlkffcaaoccbofklocbjcmppahjjboce)
- [GitHub Releases](https://github.com/pixijs/devtools/releases)

### Features

- **Inspect Layout**: View layout properties of any display object in real-time
- **Visual Helpers**: `⬥` icon indicates a layout object; flash button highlights it on screen
- **Reset Layout**: Reset a node to its default layout values

### Built-in Debug Renderer

Separate from DevTools, the built-in debug renderer draws margin, border, padding, flex, and content areas in different colors:

```ts
// Enable at init
await app.init({
  layout: { enableDebug: true },
});

// Or toggle at runtime (async, loads debug module dynamically)
app.renderer.layout.enableDebug(true);
app.renderer.layout.enableDebug(false);
```

Per-node debug control (requires `enableDebug` to be active):

```ts
sprite.layout = {
  debug: true, // toggle full overlay for this node
  debugHeat: true, // heatmap for layout recalculation performance
  debugDrawMargin: true, // show margin area
  debugDrawPadding: true, // show padding area
  debugDrawBorder: true, // show border area
  debugDrawFlex: true, // show flex area
  debugDrawContent: true, // show content area
};
```

## Yoga Configuration

The layout engine uses [Yoga](https://www.yogalayout.dev/) under the hood. You can customize its global configuration after app init:

```ts
import { getYogaConfig, Errata } from '@pixi/layout';

await app.init({ ... });

const config = getYogaConfig();
```

### Configuration Options

| Method                                                | Description                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `config.setErrata(Errata.Classic)`                    | Controls how Yoga handles edge cases and legacy behavior. `Classic` matches older Yoga versions. |
| `config.setPointScaleFactor(n)`                       | Scaling factor for point-based measurements. Useful for high-DPI or custom coordinate systems.   |
| `config.setUseWebDefaults(true)`                      | Enables web-standard default values (closer to browser CSS behavior).                            |
| `config.setExperimentalFeatureEnabled(feature, true)` | Toggles experimental Yoga features.                                                              |

### Full Example

```ts
import { getYogaConfig, Errata } from "@pixi/layout";

await app.init({
  background: "#1099bb",
  resizeTo: window,
  layout: { autoUpdate: true, throttle: 100 },
});

const config = getYogaConfig();
config.setErrata(Errata.Classic);
config.setPointScaleFactor(1);
config.setUseWebDefaults(true);
```

Configuration changes are **global** — they affect all layout calculations. Set them early in your app lifecycle.

See [Yoga docs](https://www.yogalayout.dev/docs/getting-started/configuring-yoga) for the full list of options and their effects.

## Common Gotchas

1. **Import order**: `import '@pixi/layout'` MUST come before `new Application()` or `app.init()`
2. **`backgroundColor`/`borderRadius`/`overflow`** only work on `LayoutContainer`/`LayoutView` components, NOT on plain `Container`/`Sprite`
3. **`anchor` and `pivot` are ignored** when layout is active. Use `transformOrigin` instead
4. **`position.x/y` is always `0`** and **`scale.x/y` is always `1`** on layout nodes. Use `layout.realX`/`layout.realY` to read actual position
5. **Intrinsic sizing has performance cost**. Use fixed sizes (`width: 100`) for many nodes instead of `layout = true`
6. **`objectFit`/`objectPosition`** only apply to leaf nodes, not containers
7. **Text `objectFit` defaults to `'scale-down'`**, not `'fill'`
8. **`visible = false`** removes node from layout calculations entirely
9. **Re-exported components** from `@pixi/layout/components` ensure layout is applied last in constructor. Prefer using them
10. **`overflow: 'scroll'`** requires `LayoutContainer` or `LayoutView`. Configure physics via `trackpad` option
11. **For React**: call `extend()` with all components you use at module level, before rendering
12. **Partial style updates merge** with existing styles. You don't need to re-specify everything

## Commands

```bash
# Install
npm install pixi.js @pixi/react @pixi/layout

# Enable debug in code
app.renderer.layout.enableDebug(true);
```
