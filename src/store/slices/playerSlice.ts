import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface PlayerPosition {
	tileX: number
	tileY: number
}

export interface PlayerState {
	position: PlayerPosition
}

const initialState: PlayerState = {
	position: {
		tileX: 90, // Initial position
		tileY: 40,
	},
}

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setPlayerPosition: (state, action: PayloadAction<PlayerPosition>) => {
			state.position = action.payload
		},
		movePlayer: (state, action: PayloadAction<PlayerPosition>) => {
			state.position.tileX = action.payload.tileX
			state.position.tileY = action.payload.tileY
		},
	},
})

export const { setPlayerPosition, movePlayer } = playerSlice.actions

export default playerSlice.reducer
