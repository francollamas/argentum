<div align="center">

# 🏰 Argentum

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/francollamas/argentum)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A multiplatform reimplementation of the classic MMORPG "Argentum Online"

</div>

## 📋 About

Argentum is a project based on the classic game "Argentum Online", with a focus on multiplatform compatibility:

- 🖥️ **Desktop**: Windows, macOS, Linux
- 📱 **Mobile**: Android, iOS

This client is fully compatible with the original Argentum Online server version 0.13.0.

## ✨ Features

- Modern codebase using TypeScript and React
- Cross-platform support via Tauri
- Classic Argentum Online gameplay reimagined

## 🛠️ Technologies

<div align="center" style="display: flex; flex-wrap: nowrap; justify-content: center; align-items: center; gap: 12px; margin: 20px auto; width: 100%; overflow-x: auto; padding: 10px 0;">
  <a href="https://www.typescriptlang.org/" title="TypeScript" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; flex-shrink: 0;">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" style="width: 100%; height: 100%; object-fit: contain;" />
  </a>

  <a href="https://pixijs.com/" title="PixiJS" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; flex-shrink: 0;">
    <img src="https://pixijs.com/images/logo.svg" alt="PixiJS" style="width: 100%; height: 100%; object-fit: contain;" />
  </a>

  <a href="https://react.dev/" title="React" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; flex-shrink: 0;">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" style="width: 100%; height: 100%; object-fit: contain;" />
  </a>
  
  <a href="https://redux-toolkit.js.org/" title="Redux" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; flex-shrink: 0;">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="Redux Toolkit" style="width: 100%; height: 100%; object-fit: contain;" />
  </a>
  
  <a href="https://vitejs.dev/" title="Vite" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; flex-shrink: 0;">
    <img src="https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg" alt="Vite" style="width: 100%; height: 100%; object-fit: contain;" />
  </a>
  
  <a href="https://tauri.app/" title="Tauri" style="display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; flex-shrink: 0;">
    <img src="https://tauri.app/_astro/logo_light.Br3nqH4L.svg" alt="Tauri" style="width: 100%; height: 100%; object-fit: contain;" />
  </a>
</div>

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/francollamas/argentum.git

# Navigate to the project directory
cd argentum

# Install dependencies
pnpm install

# Generate assets (this generates the texture atlases)
pnpm generate-assets

# Start the development server
pnpm dev
```

## 💻 Development

```bash
# Run development server
pnpm dev

# Build the project
pnpm build

# Run tests
pnpm test

# Generate code coverage report
pnpm coverage

# Run linter
pnpm linter-check

# Fix linting issues
pnpm linter
```

## 📦 Deployment

Argentum uses Tauri for cross-platform deployment. Here are the commands for testing and building for different platforms:

### Development

```bash
# Run in development mode with hot-reload
pnpm tauri dev
```

### Desktop Platforms

```bash
# Build for current desktop platform
pnpm tauri build
```

### Mobile Platforms

```bash
# For Android
pnpm tauri android dev
pnpm tauri android build

# For iOS
pnpm tauri ios dev
pnpm tauri ios build
```

Built packages will be available in the `src-tauri/target` directory for desktop platforms and in platform-specific directories for mobile.

## 👥 Contributors

<div style="display: flex; align-items: center; gap: 20px;">
  <a href="https://github.com/francollamas" title="Franco Llamas - Project Creator and Maintainer">
    <img src="https://avatars.githubusercontent.com/u/48653836?v=4" alt="Franco Llamas" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #2d2d2d;" />
  </a>
  <div>
    <a href="https://github.com/francollamas" style="text-decoration: none; color: #58a6ff; font-weight: 600; font-size: 1.1em;">
      Franco Llamas
    </a>
    <div style="color: #8b949e; font-size: 0.9em;">Project Creator and Maintainer</div>
  </div>
</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
