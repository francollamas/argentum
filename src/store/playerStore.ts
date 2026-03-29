import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

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
	persist(
		(set) => ({
			position: { tileX: 90, tileY: 40 },
			setPosition: (position) => set({ position }),
			movePlayer: (position) => set({ position }),
		}),
		{
			name: 'player-storage',
			storage: createJSONStorage(() => localStorage),
		},
	),
)
