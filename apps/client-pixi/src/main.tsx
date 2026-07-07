import '@pixi/layout'
import '@pixi/layout/react'
import './config/pixiExtensions'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.js'
import './index.css'
import { Application } from '@pixi/react'
import { logger } from './utils/logger'

// Capturar errores JavaScript y loguearlos
window.addEventListener('error', (event) => {
	logger.error(`JavaScript Error: ${event.message}`, {
		source: event.filename,
		line: event.lineno,
		column: event.colno,
	})
})

window.addEventListener('unhandledrejection', (event) => {
	logger.error('Unhandled Promise Rejection', event.reason)
})

// Log de inicio de la aplicación
logger.info('Argentum application started')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Application
			preference='webgpu'
			backgroundColor={0x000000}
			resolution={window.devicePixelRatio}
			autoDensity={true}
			antialias={false}
			resizeTo={window}
		>
			<App />
		</Application>
	</React.StrictMode>,
)
