// Logger wrapper that uses Tauri's plugin in desktop/mobile and console in browser
import { debug, error, info, warn } from '@tauri-apps/plugin-log'

const isTauri = '__TAURI_INTERNALS__' in window

export const logger = {
	debug: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		if (isTauri) {
			debug(logMessage)
		} else {
			console.debug(logMessage)
		}
	},

	info: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		if (isTauri) {
			info(logMessage)
		} else {
			console.info(logMessage)
		}
	},

	warn: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		if (isTauri) {
			warn(logMessage)
		} else {
			console.warn(logMessage)
		}
	},

	error: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		if (isTauri) {
			error(logMessage)
		} else {
			console.error(logMessage)
		}
	},
}
