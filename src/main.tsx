import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider, ReactReduxContext} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import App from './app/App.js'
import {persistor, store} from './store/store.ts'
import './index.css'
import {Application} from "@pixi/react";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ReactReduxContext.Consumer>
                    {(contextValue) => (
                        <Application backgroundColor={0x000000}>
                            <ReactReduxContext.Provider value={contextValue}>
                                <App/>
                            </ReactReduxContext.Provider>
                        </Application>
                    )}
                </ReactReduxContext.Consumer>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
)
