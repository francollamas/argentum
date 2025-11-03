import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	persistReducer,
	persistStore,
	REGISTER,
	REHYDRATE,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import inputReducer from './slices/inputSlice'
import playerReducer from './slices/playerSlice'
import screenReducer from './slices/screenSlice'

const persistConfig = {
	key: 'root',
	storage: storage,
	whitelist: ['input', 'player', 'screen'], // Persist input preferences, player state, and current screen
}

const rootReducer = combineReducers({
	input: inputReducer,
	player: playerReducer,
	screen: screenReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
