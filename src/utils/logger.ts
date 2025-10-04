// Simple wrapper around Tauri's official logging plugin
import { debug, error, info, warn } from '@tauri-apps/plugin-log'

export const logger = {
	debug: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		debug(logMessage)
	},

	info: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		info(logMessage)
	},

	warn: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		warn(logMessage)
	},

	error: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		error(logMessage)
	},
}
