# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Argentum is a multiplatform reimplementation of the classic MMORPG "Argentum Online" built with TypeScript, React, PixiJS, and Tauri. It's compatible with original Argentum Online server version 0.13.0 and targets desktop (Windows, macOS, Linux) and mobile (Android, iOS) platforms.

## Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Generate texture atlases (REQUIRED before first run or after adding textures)
pnpm generate-assets

# Start development server (web only)
pnpm dev

# Start Tauri development (desktop app with hot-reload)
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

# Build mobile apps
pnpm tauri android build
pnpm tauri ios build
```

### Testing and Quality
```bash
# Run tests
pnpm test

# Generate coverage report
pnpm coverage

# Lint check (no fixes)
pnpm linter-check

# Fix linting issues automatically
pnpm linter
```

## Architecture Overview

### Core Technologies
- **React 19** with TypeScript for UI components
- **PixiJS 8** for 2D game rendering via @pixi/react
- **Redux Toolkit** with redux-persist for state management
- **Tauri v2** for cross-platform native app compilation
- **Vite** for build tooling and development server
- **Biome** for linting and formatting
- **Vitest** for testing

### Key Architectural Components

#### Asset Pipeline
The project uses a sophisticated texture atlas system:
- `scripts/generate-assets.ts` generates packed texture atlases using free-tex-packer-cli
- Two texture packer projects in `tools/texpacker/`: `normal.ftpp` and `bigger.ftpp`
- `src/importers/texturesImporter.ts` handles dynamic texture imports via Vite's import.meta.glob
- `src/managers/textureManager.ts` provides singleton-based texture caching and loading
- Generated spritesheets are stored in `src/assets/textures/` with a mapping in `spritesheets.json`

#### Binary Asset Loading System
The game loads original Argentum Online binary data files:
- **Sprites** (`sprites.bin`) - Contains sprite frame data and animations
- **Character parts** (`.dir.bin` and `.odir.bin` files) - Bodies, heads, helmets, shields, weapons with directional data
- **Maps** (`.mmap` files) - Map tile data with layers, blocking info, and triggers
- Custom PixiJS parsers in `src/loaders/` handle these proprietary formats:
  - `spriteLoader.ts` - Parses sprite.bin format
  - `characterPartsLoader.ts` - Parses directional sprite data
  - `mapLoader.ts` - Parses map binary format with 4-layer tile system
  - `specialEffectsLoader.ts` - Handles special effects data
- Parsers are registered via PixiJS extensions system in `useResources` hook

#### Resource Loading System
- `src/hooks/useResources.ts` orchestrates loading of all game assets
- Registers custom PixiJS parsers via extensions.add()
- Loads binary asset files from `src/assets/inits/` directory
- Importers in `src/importers/` use Vite's glob imports to dynamically load assets
- All assets must be loaded before the game renders (checked in App.tsx)

#### React-PixiJS Integration
- `src/main.tsx` sets up the PixiJS Application wrapper around React with WebGPU preference
- `src/app/App.tsx` contains the main game container with resource loading check
- `src/components/game/GameView.tsx` orchestrates map rendering, camera, and player movement
- `src/components/common/CustomSprite.tsx` provides React components for PixiJS sprites with auto-animation
- `src/hooks/useSprite.ts` loads sprite textures from packed atlases based on sprite IDs
- Uses @pixi/react's extend() to expose PixiJS components as JSX elements (pixiContainer, pixiSprite, etc.)

#### Map System
- Maps are stored as binary `.mmap` files in `src/assets/maps/`
- Each tile has 4 layers, blocking flag, optional trigger, and water detection
- `src/importers/mapsImporter.ts` dynamically imports maps via Vite glob
- `src/hooks/useMapLoader.ts` loads maps on demand (only one cached at a time)
- Map rendering uses viewport culling with configurable padding per layer
- Game constants in `src/constants/game.ts` define tile size (32px), map bounds (100x100), viewport size (17x13 tiles)

#### State Management
- Redux store configured in `src/store/store.ts` with redux-persist
- `src/store/slices/` contains state slices:
  - `inputSlice.ts` - Input preferences and controls
  - `playerSlice.ts` - Player state and position
- Persisted to localStorage, survives page refreshes
- Redux DevTools integration for development

#### Camera and Movement
- `src/hooks/useSmoothCamera.ts` manages camera positioning
- `src/hooks/usePlayerMovement.ts` handles keyboard input and player movement
- Camera follows player with smooth transitions
- Viewport masking ensures only visible area is shown

#### Mobile/Desktop Configuration
- Vite config detects mobile platforms via TAURI_ENV_PLATFORM
- Different build targets: Chrome 105 for Windows, Safari 13 for macOS/Linux
- HMR configured for mobile development with custom host/port
- Tauri config in `src-tauri/tauri.conf.json`:
  - Bundle identifier: `com.francollamas.argentum`
  - Default window: 800x600
  - Supports all platforms via Tauri v2

### Important File Locations
- **Main entry**: `src/main.tsx`
- **Asset generation**: `scripts/generate-assets.ts`
- **Texture definitions**: Generated in `src/assets/textures/spritesheets.json`
- **Binary assets**: `src/assets/inits/*.bin`
- **Map files**: `src/assets/maps/*.mmap`
- **Type definitions**: `src/types/` (sprites.ts, textureData.ts, general.ts, map.ts, input.ts)
- **Game constants**: `src/constants/game.ts`
- **Build config**: `vite.config.ts`, `tsconfig.json`
- **Linting**: `biome.json`
- **Logger utility**: `src/utils/logger.ts` (wraps console, Tauri plugin-log commented out)

### Development Workflows

#### Adding New Textures
1. Add texture files to `tools/texpacker/textures-normal/` or `textures-bigger/`
2. Run `pnpm generate-assets` to regenerate atlases
3. New textures will be available via their sprite IDs

#### Working with Maps
- Map files are binary `.mmap` format from original Argentum Online
- Maps are loaded dynamically by number (e.g., map 60)
- Only one map is cached at a time to save memory
- Maps use a 4-layer rendering system with viewport culling

#### Custom Binary Parsers
- All binary parsers extend PixiJS's asset loading system
- Use `ExtensionType.LoadParser` to create custom parsers
- Test function determines if parser handles a URL
- Load function returns parsed data structure
- Register parsers via `extensions.add()` before loading assets

### Development Notes
- **CRITICAL**: Always run `pnpm generate-assets` after adding new textures or the build will fail
- Mobile development requires platform-specific setup (Android SDK, Xcode)
- The project uses ES modules and strict TypeScript configuration
- Asset files in `src/assets/` and generated types in `src/types/assets.d.ts` are ignored by Biome
- Debug mode can be toggled via `src/config/debug.ts` for overlay features
- Vite's glob imports enable dynamic asset loading without explicit imports
