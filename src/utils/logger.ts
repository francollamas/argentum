// TODO: upgrade to use Tauri's plugin-log (it should work on all platforms)
// Logger wrapper that uses Tauri's plugin in desktop/mobile and console in browser
/* import { debug, error, info, warn } from '@tauri-apps/plugin-log'

const isTauri = '__TAURI_INTERNALS__' in window */

export const logger = {
	debug: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		// ALWAYS log to console for Safari Web Inspector
		console.debug(logMessage)
		/* 		if (isTauri) {
			debug(logMessage)
		} */
	},

	info: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		// ALWAYS log to console for Safari Web Inspector
		console.info(logMessage)
		/* 		if (isTauri) {
			info(logMessage)
		} */
	},

	warn: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		// ALWAYS log to console for Safari Web Inspector
		console.warn(logMessage)
		/* 		if (isTauri) {
			warn(logMessage)
		} */
	},

	error: (message: string, data?: unknown) => {
		const logMessage = data ? `${message} ${JSON.stringify(data)}` : message
		// ALWAYS log to console for Safari Web Inspector
		console.error(logMessage)
		/* 		if (isTauri) {
			error(logMessage)
		} */
	},
}
