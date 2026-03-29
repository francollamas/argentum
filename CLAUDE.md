# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Argentum is a multiplatform MMORPG client reimplementation built with TypeScript, React, PixiJS, and Tauri. Compatible with Argentum Online server v0.13.0.

**Tech Stack**: React 19, PixiJS 8 (@pixi/react), Redux Toolkit, Tauri v2, Vite, Biome, Vitest

## Critical Commands

```bash
pnpm generate-assets  # REQUIRED after adding textures
pnpm dev             # Web development
pnpm tauri dev       # Desktop development
pnpm linter          # Fix linting issues
```

## Architecture Principles

### Asset Pipeline Architecture
- **Texture atlases**: Generated via `pnpm generate-assets` using free-tex-packer-cli
- **Binary loaders**: Custom PixiJS parsers in `src/loaders/` handle proprietary formats (sprites.bin, .mmap, .dir.bin)
- **Loading orchestration**: `useResources` hook registers parsers and loads all assets before rendering
- **Dynamic imports**: All importers use Vite's `import.meta.glob` for dynamic asset loading

**Key constraint**: Assets MUST be loaded before game renders (enforced in App.tsx)

### React-PixiJS Integration Pattern
- PixiJS Application wrapper configured in `src/main.tsx` with WebGPU preference
- Game view hierarchy: `App.tsx` → `GameView.tsx` → map/player components
- Sprite management: `useSprite` hook + `CustomSprite` component handle texture loading and animation

### State Management Pattern
- Redux Toolkit with redux-persist for localStorage persistence
- Slices in `src/store/slices/`: input, player state
- **ALWAYS** use `useAppDispatch()` and `useAppSelector()` typed hooks

### Resource Loading Strategy
- **Maps**: Loaded on-demand via `useMapLoader`, only one cached at a time
- **Textures**: Singleton-based caching via `textureManager.ts`
- **Binary assets**: Parsed through registered PixiJS extensions

## Development Guidelines

### PixiJS Integration Rules
- **ALWAYS use JSX with @pixi/react** - NEVER create PixiJS components imperatively
- When using `extend()` (e.g., `extend({ Text })`), declare it **inside the component**, NOT globally
- Study existing codebase patterns before adding new code

### Code Quality Standards
- **NO CODE COMMENTS** - Code must be self-documenting
- **Readability first** - Prioritize clarity above all
- Small, focused functions with single responsibility
- Extract complex logic into separate utilities or custom hooks
- **Complex useEffect()** - When components have multiple complex useEffect hooks that harm readability, extract them into separate custom hooks
- All code in English

### Component Architecture
- **Check existing components first** before creating new ones (see `src/components/`)
- Keep components small and reusable
- Extract business logic to hooks or utilities
- Follow SOLID principles and composition over inheritance

### When Uncertain
- **ASK first** - Never assume requirements or implementation details
- Follow existing codebase patterns and conventions
- Maintain architectural consistency

## Key Workflows

### Adding Textures
1. Add files to `tools/texpacker/textures-normal/` or `textures-bigger/`
2. Run `pnpm generate-assets`
3. Textures available via sprite IDs

### Custom Binary Parsers
- Extend PixiJS asset loading with `ExtensionType.LoadParser`
- Register via `extensions.add()` before loading assets
- See existing parsers in `src/loaders/` for patterns

## Important Constraints
- **CRITICAL**: Run `pnpm generate-assets` after adding textures or build fails
- Maps use 4-layer rendering with viewport culling
- Only one map cached at a time for memory management
- Debug mode via `src/config/debug.ts`