import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface PlayerPosition {
	tileX: number
	tileY: number
}

export interface PlayerState {
	position: PlayerPosition
	isInRoofTrigger: boolean
}

const initialState: PlayerState = {
	position: {
		tileX: 90, // Initial position
		tileY: 40,
	},
	isInRoofTrigger: false,
}

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setPlayerPosition: (state, action: PayloadAction<PlayerPosition>) => {
			state.position = action.payload
		},
		setIsInRoofTrigger: (state, action: PayloadAction<boolean>) => {
			state.isInRoofTrigger = action.payload
		},
		movePlayer: (
			state,
			action: PayloadAction<PlayerPosition & { isInRoofTrigger: boolean }>,
		) => {
			state.position.tileX = action.payload.tileX
			state.position.tileY = action.payload.tileY
			state.isInRoofTrigger = action.payload.isInRoofTrigger
		},
	},
})

export const { setPlayerPosition, setIsInRoofTrigger, movePlayer } =
	playerSlice.actions

// Selectors
export const selectPlayerPosition = (state: RootState): PlayerPosition =>
	state.player.position
export const selectIsInRoofTrigger = (state: RootState): boolean =>
	state.player.isInRoofTrigger
export const selectPlayerTileX = (state: RootState): number =>
	state.player.position.tileX
export const selectPlayerTileY = (state: RootState): number =>
	state.player.position.tileY

export default playerSlice.reducer
