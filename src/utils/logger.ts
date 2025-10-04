// Simple wrapper around Tauri's official logging plugin
import { info, warn, error, debug } from '@tauri-apps/plugin-log'

export const logger = {
	debug: (message: string, data?: any) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		debug(logMessage)
	},

	info: (message: string, data?: any) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		info(logMessage)
	},

	warn: (message: string, data?: any) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		warn(logMessage)
	},

	error: (message: string, data?: any) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		error(logMessage)
	}
}