import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
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
	persist(
		(set) => ({
			keybinds: DEFAULT_KEYBINDS,

			updateKeybind: (action, keys) =>
				set((state) => ({
					keybinds: { ...state.keybinds, [action]: keys },
				})),

			resetKeybinds: () => set({ keybinds: DEFAULT_KEYBINDS }),

			resetKeybind: (action) =>
				set((state) => ({
					keybinds: {
						...state.keybinds,
						[action]: DEFAULT_KEYBINDS[action],
					},
				})),
		}),
		{
			name: 'input-storage',
			storage: createJSONStorage(() => localStorage),
		},
	),
)
