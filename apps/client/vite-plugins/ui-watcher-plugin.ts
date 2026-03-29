import { exec } from 'node:child_process'
import type { Plugin } from 'vite'

export const uiWatcherPlugin = (): Plugin => ({
	name: 'texpacker-ui-watcher',
	configureServer(server) {
		const watchPath = './tools/texpacker/ui'
		server.watcher.add(watchPath)

		const handleFileChange = (file: string) => {
			if (!file.endsWith('.svg')) return

			exec('pnpm --silent generate-ui', () => {
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
