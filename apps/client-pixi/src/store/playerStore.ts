import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

export interface PlayerPosition {
	tileX: number
	tileY: number
}

interface PlayerStore {
	position: PlayerPosition
	setPosition: (position: PlayerPosition) => void
	movePlayer: (position: PlayerPosition) => void
}

export const usePlayerStore = create<PlayerStore>()(
	devtools(
		persist(
			(set) => ({
				position: { tileX: 50, tileY: 50 },
				setPosition: (position) => set({ position }, false, 'setPosition'),
				movePlayer: (position) => set({ position }, false, 'movePlayer'),
			}),
			{
				name: 'player-storage',
				storage: createJSONStorage(() => localStorage),
			},
		),
		{ name: 'PlayerStore' },
	),
)
