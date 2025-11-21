import { exec } from 'node:child_process'
import type { Plugin } from 'vite'

export const fontWatcherPlugin = (): Plugin => ({
	name: 'font-watcher',
	configureServer(server) {
		const watchPath = './tools/fonts'
		server.watcher.add(watchPath)

		const handleFileChange = (file: string) => {
			if (!file.includes('tools/fonts')) return

			exec('pnpm --silent generate-fonts', () => {
				server.ws.send({
					type: 'full-reload',
					path: '*',
				})
			})
		}

		server.watcher.on('change', handleFileChange)
		server.watcher.on('add', handleFileChange)
		server.watcher.on('unlink', handleFileChange)
	},
})
