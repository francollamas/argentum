# Repository Guidelines

## Project Structure & Module Organization
- `src/main.tsx` boots the React/Pixi client; `src/app/App.tsx` wires the root view and Zustand stores.
- UI lives under `src/components` (`game` rendering, `screens` flows, `ui/common` primitives). Hooks are in `src/hooks`, runtime managers/loaders in `src/managers` and `src/loaders`, and Zustand stores in `src/store`.
- Game data and generated atlases land in `src/assets`; avoid hand-editing anything generated there.
- Tauri shell code and platform builds live in `src-tauri`; web build artifacts go to `dist/`.
- Helper tools sit in `scripts/` (asset generation) and `tools/` (texture packer projects). `docs/` and `agent/` hold planning notes.

## Build, Test, and Development Commands
- Install deps: `pnpm install`
- Web dev server: `pnpm dev` (Vite, hot reload)
- Desktop/mobile dev via Tauri: `pnpm tauri dev`
- Production web bundle: `pnpm build` → `dist/`
- Native packages: `pnpm tauri build` (outputs to `src-tauri/target` or platform dirs)
- Unit tests: `pnpm test`; coverage: `pnpm coverage`
- Lint/format check: `pnpm linter-check`; auto-fix: `pnpm linter`
- Asset pipelines: `pnpm generate-textures` and `pnpm generate-ui` (requires `tools/texpacker` inputs)
- Texture atlas generation: `pnpm generate-assets` is mandatory after adding or updating textures

## Project Overview & Tech Stack
- Argentum is a multiplatform TypeScript/React/PixiJS/Tauri MMORPG client targeting the new custom server (currently in development — features requiring server interaction are built alongside their matching server counterpart)
- Core stack: React 19, PixiJS 8 (@pixi/react, @pixi/layout), Zustand, Vite, Biome, Vitest; Tauri v2 for desktop builds

## Coding Style & Naming Conventions
- TypeScript + React + Pixi; prefer functional components and Zustand stores.
- Formatter/linter is Biome (tabs for indent, single quotes, semicolons only when required).
- File names are PascalCase for components (`GameView.tsx`), camelCase for utilities (`logger.ts`), and `.ts`/`.tsx` modules stay colocated with their feature.
- Hooks start with `use`, components with nouns, constants in `UPPER_SNAKE_CASE`, and types/interfaces in `PascalCase`.
- Keep side effects isolated; favor pure helpers in `utils/` and Zustand stores in `src/store/`.
- Code must be self-documenting; avoid code comments and keep logic small, focused, and readable.
- All code is written in English.

## Architecture & Loading Principles
- Texture atlases are generated via `pnpm generate-assets` using atlasify; avoid hand-editing generated outputs.
- Binary loaders in `src/loaders/` register PixiJS parsers for proprietary formats (sprites.bin, .mmap, .dir.bin); register extensions before loading.
- Asset loading is orchestrated through `useResources`, which must complete before rendering (enforced in `src/app/App.tsx`).
- Dynamic asset imports rely on `import.meta.glob`.
- PixiJS application wrapper prefers WebGPU and is configured in `src/main.tsx`.
- Game view hierarchy flows `App.tsx` → `GameView.tsx` → map/player components; sprites go through `useSprite` and `CustomSprite` for texture loading/animation.
- Zustand powers client state; stores live in `src/store/` and are consumed directly via store hooks (no dispatch/selector boilerplate).
- Maps load on demand via `useMapLoader` with only one cached at a time; textures cache through `textureManager.ts`; binary assets are parsed through registered Pixi extensions.

## React-Pixi Integration Rules
- Always use JSX with `@pixi/react`; avoid imperative PixiJS component creation.
- Use `@pixi/layout` for UI layout (flexbox-style via Yoga) — it integrates directly with `@pixi/react`.
- When using `extend()`, declare it inside the component rather than globally.
- Follow existing component patterns before introducing new implementations.
- For documentation lookups, do not search inside `.node_modules`; use the Context7 MCP instead.
- Three agent skills exist for this stack and are strong candidates whenever building UI or game scenes:
  - **pixi-react** (`.agents/skills/pixi-react/`) — generating components, sprites, graphics, text, and interactive elements with `@pixi/react`
  - **pixi-layout** (`.agents/skills/pixi-layout/`) — building flexbox UI layouts with `@pixi/layout` inside PixiJS
  - **pixi-doc-router** (`.agents/skills/pixi-doc-router/`) — routing PixiJS requests to the right local skill or official PixiJS docs before building custom solutions

## Component Architecture & Code Quality
- Prefer small, reusable components and extract business logic into hooks or utilities; follow SOLID and composition over inheritance.
- If components accumulate complex `useEffect` hooks, extract them into dedicated hooks to preserve readability.
- Check existing components under `src/components/` before creating new ones.

## Testing Guidelines
- Vitest is configured; add colocated `*.test.ts(x)` files next to the code they cover.
- Target at least happy-path coverage for new stores, hooks, and rendering helpers; include edge-case stubs for asset loading failures.
- Use `pnpm test` locally; run `pnpm coverage` when altering core rendering or networking paths.

## Key Workflows
- Adding textures: place assets in `tools/texpacker/textures-normal/` or `textures-bigger/`, then run `pnpm generate-assets` to refresh atlases.
- Texture atlas generation uses the local `atlasify` devDependency installed via `pnpm install`.
- Custom binary parsers: extend PixiJS asset loading with `ExtensionType.LoadParser` and register via `extensions.add()` before loading assets (see `src/loaders/`).

## Important Constraints
- Assets must be fully loaded before game render starts; App-level gating enforces this.
- Map rendering uses four-layer rendering with viewport culling; only one map is cached for memory control.
- Run `pnpm generate-assets` after texture changes to avoid build failures.
- Debug mode toggles live in `src/config/debug.ts`.
- Features that require server interaction must be developed together with their matching server implementation; purely client-side features (UI, rendering, local state) can ship independently.

## Commit & Pull Request Guidelines
- Match the existing short, imperative commit line style (e.g., `Add MSDF fonts`, `Improve UI scaling`); keep subjects <= 72 chars.
- For PRs, include: short summary of scope, linked issues or task IDs, screenshots/GIFs for UI changes, and notes on testing (`pnpm test`, `pnpm linter-check`, relevant Tauri builds).
- Keep PRs scoped and reviewable; prefer follow-up PRs for unrelated refactors.
