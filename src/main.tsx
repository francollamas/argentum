import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, ReactReduxContext } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './app/App.js'
import { persistor, store } from './store/store.ts'
import './index.css'
import { Application } from '@pixi/react'
import { logger } from './utils/logger'
import '@pixi/layout/react'
import '@pixi/layout'

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
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ReactReduxContext.Consumer>
					{(contextValue) => (
						<Application
							preference='webgpu'
							backgroundColor={0x000000}
							resolution={window.devicePixelRatio}
							autoDensity={true}
							antialias={true}
							resizeTo={window}
						>
							<ReactReduxContext.Provider value={contextValue}>
								<App />
							</ReactReduxContext.Provider>
						</Application>
					)}
				</ReactReduxContext.Consumer>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
)
