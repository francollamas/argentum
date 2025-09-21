# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Argentum is a multiplatform reimplementation of the classic MMORPG "Argentum Online" built with TypeScript, React, PixiJS, and Tauri. It's compatible with original Argentum Online server version 0.13.0 and targets desktop (Windows, macOS, Linux) and mobile (Android, iOS) platforms.

## Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Generate texture atlases (required before first run)
pnpm generate-assets

# Start development server
pnpm dev

# Start Tauri development (desktop app)
pnpm tauri dev

# Mobile development
pnpm tauri android dev
pnpm tauri ios dev
```

### Building
```bash
# Build web version
pnpm build

# Build desktop app
pnpm tauri build

# Build mobile
pnpm tauri android build
pnpm tauri ios build
```

### Testing and Quality
```bash
# Run tests
pnpm test

# Generate coverage report
pnpm coverage

# Lint check
pnpm linter-check

# Fix linting issues
pnpm linter
```

## Architecture Overview

### Core Technologies
- **React 19** with TypeScript for UI components
- **PixiJS 8** for 2D game rendering via @pixi/react
- **Redux Toolkit** with redux-persist for state management
- **Tauri** for cross-platform native app compilation
- **Vite** for build tooling and development server
- **Biome** for linting and formatting
- **Vitest** for testing

### Key Architectural Components

#### Asset Pipeline
The project uses a sophisticated texture atlas system:
- `scripts/generate-assets.ts` generates packed texture atlases using free-tex-packer-cli
- `src/importers/texturesImporter.ts` handles dynamic texture imports
- `src/managers/textureManager.ts` provides singleton-based texture caching and loading
- Assets are organized in `tools/texpacker/` with `.ftpp` project files

#### Resource Loading System
- `src/hooks/useResources.ts` orchestrates loading of all game assets
- `src/loaders/` contains specialized loaders for different asset types:
  - `spriteLoader.ts` - General game sprites
  - `characterPartsLoader.ts` - Character bodies, heads, helmets, shields, weapons
  - `specialEffectsLoader.ts` - Visual effects
- Uses PixiJS parsers and extensions for custom asset formats

#### React-PixiJS Integration
- `src/main.tsx` sets up the PixiJS Application wrapper around React
- `src/app/App.tsx` contains the main game container with resource loading check
- `src/components/common/CustomSprite.tsx` provides React components for PixiJS sprites
- `src/hooks/useTexture.ts` and `useSprite.ts` provide React hooks for game assets

#### State Management
- Redux store configured in `src/store/store.ts` with persistence
- `src/store/slices/userSlice.ts` manages user-related state
- Redux DevTools integration for development

#### Mobile/Desktop Configuration
- Vite config detects mobile platforms via TAURI_ENV_PLATFORM
- Configures different HMR settings for mobile development
- Tauri configuration in `src-tauri/tauri.conf.json` defines app metadata and build settings

### Important File Locations
- Main entry: `src/main.tsx`
- Asset generation: `scripts/generate-assets.ts`
- Texture definitions: Generated in `src/assets/textures/spritesheets.json`
- Type definitions: `src/types/` (sprites.ts, textureData.ts, general.ts)
- Build config: `vite.config.ts`, `tsconfig.json`
- Linting: `biome.json`

### Development Notes
- Always run `pnpm generate-assets` after adding new textures
- Mobile development requires setting up Android/iOS development environments
- The project uses ES modules and strict TypeScript configuration
- Asset files in `src/assets/` and generated types in `src/types/assets.d.ts` are ignored by Biome linting