import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { InputAction, type KeybindMap } from '../types/input'

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

interface InputStore {
	keybinds: KeybindMap
	updateKeybind: (action: InputAction, keys: string[]) => void
	resetKeybinds: () => void
	resetKeybind: (action: InputAction) => void
}

export const useInputStore = create<InputStore>()(
	devtools(
		persist(
			(set) => ({
				keybinds: DEFAULT_KEYBINDS,

				updateKeybind: (action, keys) =>
					set(
						(state) => ({
							keybinds: { ...state.keybinds, [action]: keys },
						}),
						false,
						'updateKeybind',
					),

				resetKeybinds: () =>
					set({ keybinds: DEFAULT_KEYBINDS }, false, 'resetKeybinds'),

				resetKeybind: (action) =>
					set(
						(state) => ({
							keybinds: {
								...state.keybinds,
								[action]: DEFAULT_KEYBINDS[action],
							},
						}),
						false,
						'resetKeybind',
					),
			}),
			{
				name: 'input-storage',
				storage: createJSONStorage(() => localStorage),
			},
		),
		{ name: 'InputStore' },
	),
)
