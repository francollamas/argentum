import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { InputAction, type KeybindMap } from '../../types/input'

const DEFAULT_KEYBINDS: KeybindMap = {
	[InputAction.MOVE_UP]: ['ArrowUp'],
	[InputAction.MOVE_DOWN]: ['ArrowDown'],
	[InputAction.MOVE_LEFT]: ['ArrowLeft'],
	[InputAction.MOVE_RIGHT]: ['ArrowRight'],
	[InputAction.ATTACK]: [' ', 'Enter'],
	[InputAction.CAST_SPELL]: ['c', 'C'],
	[InputAction.USE_ITEM]: ['u', 'U'],
	[InputAction.OPEN_INVENTORY]: ['i', 'I'],
	[InputAction.OPEN_CHAT]: ['t', 'T'],
	[InputAction.TOGGLE_RUN]: ['Shift'],
	[InputAction.INTERACT]: ['e', 'E'],
	[InputAction.TOGGLE_FULLSCREEN]: ['F11'],
}

type InputState = {
	keybinds: KeybindMap
}

const initialState: InputState = {
	keybinds: DEFAULT_KEYBINDS,
}

const inputSlice = createSlice({
	name: 'input',
	initialState,
	reducers: {
		updateKeybind: (
			state,
			action: PayloadAction<{ action: InputAction; keys: string[] }>,
		) => {
			state.keybinds[action.payload.action] = action.payload.keys
		},
		resetKeybinds: (state) => {
			state.keybinds = DEFAULT_KEYBINDS
		},
		resetKeybind: (state, action: PayloadAction<InputAction>) => {
			state.keybinds[action.payload] = DEFAULT_KEYBINDS[action.payload]
		},
	},
})

export const { updateKeybind, resetKeybinds, resetKeybind } = inputSlice.actions
export default inputSlice.reducer
