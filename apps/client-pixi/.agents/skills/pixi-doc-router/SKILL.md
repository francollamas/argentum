---
name: pixi-doc-router
description: >
  Route PixiJS-related requests to the right local skill or official PixiJS docs
  before implementing custom solutions. Trigger: When planning or implementing
  game, UI, rendering, resize, interaction, or performance changes that may
  already be covered by PixiJS.
---

## When to Use

- Planning a game or UI change that might already be supported by PixiJS
- Deciding whether a request belongs to `pixi-react`, `pixi-layout`, or PixiJS core docs
- Looking for the official PixiJS way to handle resize, input, scene graph, rendering, assets, or performance
- Preventing custom DOM, CSS, or engine workarounds when PixiJS already provides a solution

## Critical Patterns

### 1. Route local skills before external docs

Use the existing local skills first when the request falls into their area:

| If the request is about... | Use first |
|---|---|
| React declarative Pixi components, JSX, `extend()`, `Application`, refs, hooks, scenes | `pixi-react` |
| Layout inside the canvas, flexbox UI, overflow, objectFit, responsive Pixi UI | `pixi-layout` |

Do not query Context7 for `@pixi/react` or `@pixi/layout` before routing to those local skills.

### 2. Use official PixiJS docs for Pixi core

If the request is about PixiJS core behavior, consult official PixiJS documentation before implementing custom logic.

Use Context7 with:

- `/pixijs/pixijs`

Prefer the official docs site for stable public references, then the API docs when class-level details are needed.

### 3. Avoid non-Pixi workarounds for Pixi problems

- Do not solve canvas resize with HTML or CSS hacks if PixiJS `Application` and `ResizePlugin` cover it.
- Do not solve pointer or wheel interaction with DOM listeners if PixiJS events cover it.
- Do not build ad-hoc layout systems for UI rendered inside PixiJS.
- Do not optimize rendering blindly; check PixiJS performance guidance first.

### 4. Match the request to the right documentation entry

| Request type | Use | URL |
|---|---|---|
| App setup, renderer, canvas lifecycle | PixiJS Application guide | `https://pixijs.com/8.x/guides/components/application` |
| Responsive canvas resize | PixiJS Resize Plugin guide | `https://pixijs.com/8.x/guides/components/application/resize-plugin` |
| Pointer, mouse, touch, wheel, hit testing | PixiJS Events guide | `https://pixijs.com/8.x/guides/components/events` |
| Frame updates, timing, priorities, FPS | PixiJS Ticker guide | `https://pixijs.com/8.x/guides/components/ticker` |
| Scene graph, grouping, z-order, cache as texture | PixiJS Container guide | `https://pixijs.com/8.x/guides/components/scene-objects/container` |
| Asset loading | PixiJS Assets guide | `https://pixijs.com/8.x/guides/components/assets` |
| Textures and texture lifecycle | PixiJS Textures guide | `https://pixijs.com/8.x/guides/components/textures` |
| Sprites | PixiJS Sprite guide | `https://pixijs.com/8.x/guides/components/scene-objects/sprite` |
| Vector drawing | PixiJS Graphics guide | `https://pixijs.com/8.x/guides/components/scene-objects/graphics` |
| Text rendering | PixiJS Text guide | `https://pixijs.com/8.x/guides/components/scene-objects/text` |
| Filters and blend behavior | PixiJS Filters guide | `https://pixijs.com/8.x/guides/components/filters` |
| Rendering and event performance | PixiJS Performance Tips | `https://pixijs.com/8.x/guides/concepts/performance-tips` |

### 5. Use the official PixiJS path when the request mentions these topics

| User asks about... | Preferred path |
|---|---|
| Resize, screen fit, responsive canvas | PixiJS `Application` + `ResizePlugin` |
| Click, hover, drag intent, wheel, hit area | PixiJS federated events |
| Render loop, animation timing | PixiJS `Ticker` |
| Layering, grouping, cached static trees | PixiJS `Container` and `cacheAsTexture()` |
| Sprite, graphics, text, textures, filters | PixiJS scene object guides |
| UI layout inside canvas | `pixi-layout` skill |
| React integration details | `pixi-react` skill |

## Code Examples

### Route to the right source first

```text
Request: "Make the game resize correctly on window changes"
Route: PixiJS core docs
Start with: Application guide + Resize Plugin guide
Avoid: CSS-only hacks for canvas sizing
```

```text
Request: "Build a responsive in-canvas inventory panel"
Route: pixi-layout
Start with: local `pixi-layout` skill
Avoid: custom layout math before checking layout primitives
```

```text
Request: "Add a clickable Pixi button in React"
Route: pixi-react
Start with: local `pixi-react` skill
Avoid: querying external docs before checking the local skill
```

## Commands

```bash
# Resolve PixiJS core docs in Context7
context7 resolve-library-id --libraryName "PixiJS" --query "PixiJS v8 official docs for resize, events, ticker, container, assets, textures, sprites, graphics, text, filters, performance"

# Query PixiJS core docs in Context7
context7 query-docs --libraryId "/pixijs/pixijs" --query "How does PixiJS v8 recommend handling responsive resize with Application and ResizePlugin?"

# Open official PixiJS docs directly
open "https://pixijs.com/8.x/guides/components/application"
open "https://pixijs.com/8.x/guides/components/application/resize-plugin"
open "https://pixijs.com/8.x/guides/components/events"
open "https://pixijs.com/8.x/guides/components/ticker"
open "https://pixijs.com/8.x/guides/concepts/performance-tips"
```
