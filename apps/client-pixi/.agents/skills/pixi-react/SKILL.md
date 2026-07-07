---
name: pixi-react
description: >
  Generate UI elements and components using @pixi/react (PixiJS v8 + React v19).
  Trigger: When creating PixiJS UI components, scenes, sprites, graphics, text, or
  interactive elements using React declarative syntax with @pixi/react.
---

## When to Use

- Creating PixiJS components in React (sprites, graphics, text, containers, filters)
- Setting up a new @pixi/react application or scene
- Adding interactivity (click, pointer, touch events) to PixiJS elements
- Animating elements with the ticker (useTick)
- Registering custom or third-party PixiJS components via extend
- Typing custom components in TypeScript

## Critical Patterns

### 1. ALWAYS call `extend()` before using JSX elements

Nothing is pre-registered. Every PixiJS class you use in JSX **must** be registered first.
Forgetting this causes: `"X is not part of the PIXI namespace! Did you forget to extend?"`.

```tsx
import { extend } from '@pixi/react';
import { Container, Sprite, Graphics, Text } from 'pixi.js';

// Call once at module level (top of file, outside components)
extend({ Container, Sprite, Graphics, Text });
```

### 2. JSX elements use the `pixi` prefix

| PixiJS Class     | JSX Element           |
|------------------|-----------------------|
| `Container`      | `<pixiContainer>`     |
| `Sprite`         | `<pixiSprite>`        |
| `Graphics`       | `<pixiGraphics>`      |
| `Text`           | `<pixiText>`          |
| `TilingSprite`   | `<pixiTilingSprite>`  |
| `AnimatedSprite` | `<pixiAnimatedSprite>`|
| `HTMLText`       | `<pixiHtmlText>`      |
| `NineSliceSprite`| `<pixiNineSliceSprite>`|
| `Mesh`           | `<pixiMesh>`          |

Rule: `pixi` + PascalCase class name. The prefix is **mandatory** to avoid collisions with HTML/DOM elements.

### 3. `<Application>` is the root wrapper

Every @pixi/react tree must be wrapped in `<Application>`. It creates the PixiJS Application, canvas, and reconciler context.

```tsx
import { Application, extend } from '@pixi/react';
import { Container, Sprite } from 'pixi.js';

extend({ Container, Sprite });

function App() {
  return (
    <Application width={800} height={600} background="#1099bb">
      <pixiContainer x={100} y={100}>
        <pixiSprite texture={myTexture} />
      </pixiContainer>
    </Application>
  );
}
```

### 4. `useApplication` only works in CHILD components

It uses React Context, so it must be called **inside** the `<Application>` tree, not in the same component that renders `<Application>`.

```tsx
// WRONG - same component
const App = () => {
  const { app } = useApplication(); // Invariant violation!
  return <Application />;
};

// CORRECT - child component
const Scene = () => {
  const { app } = useApplication(); // Works
  return <pixiContainer />;
};
const App = () => (
  <Application>
    <Scene />
  </Application>
);
```

### 5. `useTick` callbacks MUST be memoized when mutating state

The callback is **not** memoized internally. If you mutate state inside `useTick`, the component re-renders, causing the callback to be removed and re-added every frame.

```tsx
// WRONG - causes infinite re-add/remove cycle
const Bad = () => {
  const [rot, setRot] = useState(0);
  useTick(() => setRot(r => r + 0.1)); // Re-created every render!
  return <pixiSprite rotation={rot} />;
};

// CORRECT - memoize the callback
const Good = () => {
  const [rot, setRot] = useState(0);
  const animate = useCallback(() => setRot(r => r + 0.1), []);
  useTick(animate);
  return <pixiSprite rotation={rot} />;
};
```

### 6. `draw` prop is Graphics-only

The special `draw` prop only works on `<pixiGraphics>`. Using it on other elements logs a warning.

```tsx
<pixiGraphics draw={(g) => {
  g.clear();
  g.setFillStyle({ color: 'red' });
  g.rect(0, 0, 100, 100);
  g.fill();
}} />
```

---

## API Reference

### Exports from `@pixi/react`

| Export                  | Kind      | Purpose                                      |
|-------------------------|-----------|----------------------------------------------|
| `Application`           | Component | Root wrapper, creates PixiJS app + canvas     |
| `extend`                | Function  | Register PixiJS classes for JSX use           |
| `createRoot`            | Function  | Low-level root creation (advanced)            |
| `applyProps`            | Function  | Apply props to a PixiJS instance (advanced)   |
| `useApplication`        | Hook      | Access parent PixiJS Application              |
| `useExtend`             | Hook      | Memoized version of `extend()`                |
| `useTick`               | Hook      | Attach callback to application Ticker         |
| `PixiElements`          | Type      | JSX element type map                          |
| `PixiReactElementProps` | Type      | Props type for custom components              |
| `UnprefixedPixiElements`| Type      | Unprefixed element types (opt-in)             |
| `ApplicationRef`        | Type      | Ref type for `<Application>`                  |

### `<Application>` Props

Accepts all `PIXI.ApplicationOptions` (width, height, background, antialias, etc.) plus:

| Prop                    | Type                                        | Description                           |
|-------------------------|---------------------------------------------|---------------------------------------|
| `children`              | `ReactNode`                                 | Pixi component tree                   |
| `className`             | `string`                                    | CSS class for the canvas wrapper      |
| `defaultTextStyle`      | `TextStyle \| TextStyleOptions`             | Set default text style globally       |
| `destroyOptions`        | `DestroyOptions`                            | Options for app.destroy()             |
| `extensions`            | `ExtensionFormatLoose[]`                    | PixiJS extensions to load             |
| `onInit`                | `(app: Application) => void`                | Callback after app initializes        |
| `rendererDestroyOptions`| `RendererDestroyOptions`                    | Options for renderer.destroy()        |
| `resizeTo`              | `HTMLElement \| Window \| RefObject<HTML>`  | Auto-resize target (supports refs)    |
| `ref`                   | `Ref<ApplicationRef>`                       | Imperative handle                     |

`ApplicationRef` exposes: `getApplication()` and `getCanvas()`.

### `useApplication()`

```ts
const { app, isInitialised, isInitialising } = useApplication();
```

Returns the PixiJS `Application` instance and initialization state. Must be inside `<Application>`.

### `useTick(callback | options)`

Simple form:
```ts
useTick((ticker) => { /* runs every frame */ });
```

With enable/disable:
```ts
useTick(() => { /* ... */ }, isEnabled); // boolean second arg
```

Options form:
```ts
useTick({
  callback() { this.current.rotation += 0.1; },
  context: spriteRef,
  isEnabled: true,
  priority: UPDATE_PRIORITY.HIGH,
});
```

### `extend(components)`

```ts
extend({ Container, Sprite, Graphics, Text });
```

Registers classes in the internal catalogue. Call at module scope (top-level, outside components).
`useExtend()` is the hook version (memoized, safe to call inside components).

---

## Props System

### How props map to PixiJS instances

Every writable property of the underlying PixiJS class is available as a JSX prop:

```tsx
<pixiSprite
  x={100}
  y={200}
  anchor={0.5}
  scale={1.5}
  rotation={Math.PI / 4}
  alpha={0.8}
  visible={true}
  tint={0xff0000}
  texture={myTexture}
  width={64}
  height={64}
/>
```

### Nested/dashed props

Use `-` as a path separator to set nested properties:

```tsx
<pixiSprite position-x={100} position-y={200} scale-x={2} scale-y={1} />
// Equivalent to: instance.position.x = 100; instance.position.y = 200; etc.
```

### Constructor options

Props are passed to the PixiJS constructor AND applied as setters afterward. No special handling needed.

### Refs

Standard React refs work on all pixi elements:

```tsx
const spriteRef = useRef<Sprite>(null);
<pixiSprite ref={spriteRef} />
// spriteRef.current is the PixiJS Sprite instance
```

### Children

Only elements backed by `Container` (or subclasses) accept children. Containers nest naturally:

```tsx
<pixiContainer>
  <pixiSprite texture={bg} />
  <pixiContainer x={50} y={50}>
    <pixiText text="Hello" />
  </pixiContainer>
</pixiContainer>
```

### Filters as children

Filters are first-class children. When a Filter is added as a child, it auto-attaches to the parent's `filters` array:

```tsx
extend({ Container, BlurFilter });

<pixiContainer>
  <pixiBlurFilter strength={8} />
  <pixiSprite texture={myTexture} />
</pixiContainer>
```

---

## Event Handlers

Events use React-style PascalCase naming. The element must have `eventMode` set (e.g., `'static'` or `'dynamic'`).

### Common Events

| Prop               | PixiJS Event          |
|--------------------|-----------------------|
| `onClick`          | `onclick`             |
| `onPointerDown`    | `onpointerdown`       |
| `onPointerUp`      | `onpointerup`         |
| `onPointerMove`    | `onpointermove`       |
| `onPointerOver`    | `onpointerover`       |
| `onPointerOut`     | `onpointerout`        |
| `onPointerEnter`   | `onpointerenter`      |
| `onPointerLeave`   | `onpointerleave`      |
| `onMouseDown`      | `onmousedown`         |
| `onMouseUp`        | `onmouseup`           |
| `onMouseMove`      | `onmousemove`         |
| `onTouchStart`     | `ontouchstart`        |
| `onTouchEnd`       | `ontouchend`          |
| `onTouchMove`      | `ontouchmove`         |
| `onWheel`          | `onwheel`             |
| `onRightClick`     | `onrightclick`        |

Additional events exist: `onPointerCancel`, `onPointerTap`, `onPointerUpOutside`, `onMouseOver`, `onMouseOut`, `onMouseEnter`, `onMouseLeave`, `onMouseUpOutside`, `onTouchCancel`, `onTouchEndOutside`, `onTap`, `onRightDown`, `onRightUp`, `onRightUpOutside`, `onGlobalPointerMove`, `onGlobalMouseMove`, `onGlobalTouchMove`.

All event handler types are `FederatedEventHandler<FederatedPointerEvent>` (or `FederatedWheelEvent` for `onWheel`).

> **Warning**: Using lowercase pixi-style event names (e.g., `onclick` instead of `onClick`) triggers a console warning.

---

## TypeScript

### Custom components

Register custom components in the type system via module augmentation:

```ts
// global.d.ts
import { type PixiReactElementProps } from '@pixi/react';
import { type Viewport } from 'pixi-viewport';

declare module '@pixi/react' {
  interface PixiElements {
    viewport: PixiReactElementProps<typeof Viewport>;
  }
}
```

### Extending built-in component props

```ts
import { type PixiElements } from '@pixi/react';
import { type Texture } from 'pixi.js';

type TilingSpriteProps = PixiElements['pixiTilingSprite'] & {
  image?: string;
  texture?: Texture;
};
```

### Unprefixed elements (opt-in)

Enable `<container>` instead of `<pixiContainer>`:

```ts
// global.d.ts
import { type UnprefixedPixiElements } from '@pixi/react';

declare module '@pixi/react' {
  interface PixiElements extends UnprefixedPixiElements {}
}
```

> **Note**: Prefixed elements are always available even after enabling unprefixed. Recommended to stick with prefixed to avoid collisions with react-dom or @react-three/fiber.

---

## Code Examples

### 1. Basic Setup

```tsx
import { Application, extend } from '@pixi/react';
import { Container, Sprite, Graphics, Text } from 'pixi.js';

extend({ Container, Sprite, Graphics, Text });

export default function App() {
  return (
    <Application width={800} height={600} background="#1099bb">
      <pixiContainer x={100} y={100}>
        <pixiText text="Hello PixiJS!" style={{ fontSize: 24, fill: 'white' }} />
      </pixiContainer>
    </Application>
  );
}
```

### 2. Interactive Sprite with Asset Loading

```tsx
import { Assets, Texture } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { useTick } from '@pixi/react';

export function BunnySprite() {
  const spriteRef = useRef(null);
  const [texture, setTexture] = useState(Texture.EMPTY);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load('https://pixijs.com/assets/bunny.png')
        .then((result) => setTexture(result));
    }
  }, [texture]);

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      eventMode="static"
      onClick={() => setIsActive(!isActive)}
      onPointerOver={() => console.log('hover')}
      scale={isActive ? 1.5 : 1}
      texture={texture}
      x={200}
      y={200}
    />
  );
}
```

### 3. Graphics with Draw Callback

```tsx
import { useCallback } from 'react';

function MyGraphics() {
  const draw = useCallback((g) => {
    g.clear();
    // Red rectangle
    g.setFillStyle({ color: 0xff0000 });
    g.rect(0, 0, 200, 100);
    g.fill();
    // Blue circle
    g.setFillStyle({ color: 0x0000ff });
    g.circle(100, 150, 50);
    g.fill();
    // Green line
    g.setStrokeStyle({ width: 3, color: 0x00ff00 });
    g.moveTo(0, 0);
    g.lineTo(200, 200);
    g.stroke();
  }, []);

  return <pixiGraphics draw={draw} x={50} y={50} />;
}
```

### 4. Animation with useTick (Memoized)

```tsx
import { useCallback, useRef } from 'react';
import { useTick } from '@pixi/react';

function RotatingSprite({ texture }) {
  const spriteRef = useRef(null);

  useTick({
    callback() {
      this.current.rotation += 0.02;
    },
    context: spriteRef,
  });

  return (
    <pixiSprite ref={spriteRef} texture={texture} anchor={0.5} x={400} y={300} />
  );
}
```

### 5. Conditional Tick with Enable/Disable

```tsx
import { useCallback, useState } from 'react';
import { useTick } from '@pixi/react';

function PausableAnimation({ texture }) {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const animate = useCallback(() => setRotation(r => r + 0.05), []);
  useTick(animate, !isPaused);

  return (
    <pixiSprite
      texture={texture}
      rotation={rotation}
      anchor={0.5}
      x={400}
      y={300}
      eventMode="static"
      onClick={() => setIsPaused(p => !p)}
    />
  );
}
```

### 6. Filters

```tsx
import { extend } from '@pixi/react';
import { Container, Sprite, BlurFilter } from 'pixi.js';

extend({ Container, Sprite, BlurFilter });

function BlurredSprite({ texture }) {
  return (
    <pixiContainer>
      <pixiBlurFilter strength={4} quality={4} />
      <pixiSprite texture={texture} x={100} y={100} />
    </pixiContainer>
  );
}
```

### 7. Custom Component (pixi-viewport)

```tsx
import { Application, extend } from '@pixi/react';
import { Container, Sprite } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

extend({ Container, Sprite, Viewport });

function Scene() {
  return (
    <Application width={800} height={600}>
      <pixiViewport screenWidth={800} screenHeight={600} worldWidth={2000} worldHeight={2000}>
        <pixiSprite texture={mapTexture} />
      </pixiViewport>
    </Application>
  );
}
```

### 8. Responsive Application with resizeTo

```tsx
import { Application } from '@pixi/react';
import { useRef } from 'react';

function ResponsiveApp() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh' }}>
      <Application resizeTo={containerRef} background="#1099bb">
        {/* scene content */}
      </Application>
    </div>
  );
}
```

### 9. Application with Imperative Ref

```tsx
import { Application, type ApplicationRef } from '@pixi/react';
import { useRef } from 'react';

function AppWithRef() {
  const appRef = useRef<ApplicationRef>(null);

  const handleScreenshot = () => {
    const app = appRef.current?.getApplication();
    const canvas = appRef.current?.getCanvas();
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      console.log(dataUrl);
    }
  };

  return (
    <>
      <button onClick={handleScreenshot}>Screenshot</button>
      <Application ref={appRef} width={800} height={600}>
        {/* scene */}
      </Application>
    </>
  );
}
```

---

## Commands

```bash
# Install dependencies
npm install pixi.js@^8.2.6 @pixi/react

# Peer dependency: React 18+ or 19
npm install react react-dom
```

---

## Common Gotchas

| Gotcha | Solution |
|--------|----------|
| `"X is not part of the PIXI namespace"` | Call `extend({ X })` before using `<pixiX>` |
| `useApplication` throws invariant error | Move hook call to a **child** of `<Application>`, not the same component |
| `useTick` callback fires erratically | Memoize the callback with `useCallback` when mutating state |
| Sprite/element not responding to clicks | Set `eventMode="static"` (or `"dynamic"`) on the element |
| `<container>` not recognized | Use `<pixiContainer>` (prefixed) or opt-in to unprefixed via TypeScript |
| `draw` prop ignored on non-Graphics | `draw` only works on `<pixiGraphics>` |
| Filters not applying | Extend the filter class (`extend({ BlurFilter })`) and add as child of a container |
| Props not updating nested values | Use dashed notation: `position-x={100}` instead of `position={{ x: 100 }}` |
| Text style not applying to existing text | `defaultTextStyle` on `<Application>` is not retroactive; only affects new text elements |
| Bundle too large | Only `extend()` the classes you actually use; unused classes won't be bundled |
