import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { GameMap } from '../../types/map'

export interface WorldState {
	currentMap: GameMap | null
	mapNumber: number | null
}

const initialState: WorldState = {
	currentMap: null,
	mapNumber: null,
}

export const worldSlice = createSlice({
	name: 'world',
	initialState,
	reducers: {
		setCurrentMap: (state, action: PayloadAction<{ map: GameMap; mapNumber: number }>) => {
			state.currentMap = action.payload.map
			state.mapNumber = action.payload.mapNumber
		},
		clearMap: (state) => {
			state.currentMap = null
			state.mapNumber = null
		},
	},
})

export const { setCurrentMap, clearMap } = worldSlice.actions
export default worldSlice.reducer