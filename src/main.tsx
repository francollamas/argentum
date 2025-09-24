import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, ReactReduxContext } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './app/App.js'
import { persistor, store } from './store/store.ts'
import './index.css'
import { Application } from '@pixi/react'

// Capturar todos los errores JavaScript y loguearlos
window.addEventListener('error', (event) => {
	console.error('[JS ERROR]', event.error)
	console.error('[JS ERROR] Message:', event.message)
	console.error('[JS ERROR] Source:', event.filename, 'Line:', event.lineno, 'Column:', event.colno)
})

window.addEventListener('unhandledrejection', (event) => {
	console.error('[UNHANDLED PROMISE REJECTION]', event.reason)
})

// Override console methods para asegurar que se muestren
const originalConsole = {
	log: console.log,
	error: console.error,
	warn: console.warn,
}

console.log = (...args: any[]) => {
	originalConsole.log('[ARGENTUM LOG]', ...args)
}

console.error = (...args: any[]) => {
	originalConsole.error('[ARGENTUM ERROR]', ...args)
}

console.warn = (...args: any[]) => {
	originalConsole.warn('[ARGENTUM WARN]', ...args)
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ReactReduxContext.Consumer>
					{(contextValue) => (
						<Application backgroundColor={0x000000}>
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
