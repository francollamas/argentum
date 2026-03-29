import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fontWatcherPlugin } from './vite-plugins/font-watcher-plugin'
import { uiWatcherPlugin } from './vite-plugins/ui-watcher-plugin'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig({
	base: './', // Esto asegura que las rutas sean relativas a la raíz del proyecto
	build: {
		assetsDir: 'assets', // Especifica la carpeta donde se colocarán los activos
		target:
			process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13', // Tauri uses Chromium on Windows and WebKit on macOS and Linux
		minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
		sourcemap: !!process.env.TAURI_ENV_DEBUG, // produce sourcemaps for debug builds
	},
	assetsInclude: ['**/*.bin', '**/*.mmap'], // Incluye los archivos binarios

	plugins: [react(), uiWatcherPlugin(), fontWatcherPlugin()],

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
				}
			: undefined,

		watch: {
			// tell vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**'],
		},
	},
	// Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
	envPrefix: ['VITE_', 'TAURI_ENV_*'],
})
