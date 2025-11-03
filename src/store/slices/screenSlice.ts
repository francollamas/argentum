import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { Screen } from '../../types/screen'

interface ScreenState {
	currentScreen: Screen
}

const initialState: ScreenState = {
	currentScreen: 'login',
}

const screenSlice = createSlice({
	name: 'screen',
	initialState,
	reducers: {
		setScreen: (state, action: PayloadAction<Screen>) => {
			state.currentScreen = action.payload
		},
	},
})

export const { setScreen } = screenSlice.actions
export default screenSlice.reducer
