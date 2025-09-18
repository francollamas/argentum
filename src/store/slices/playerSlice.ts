import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface PlayerState {
	position: {
		tileX: number
		tileY: number
	}
	isInRoofTrigger: boolean
}

const initialState: PlayerState = {
	position: {
		tileX: 50, // Initial position - matches GAME_CONSTANTS.CAMERA.DEFAULT_X/Y
		tileY: 50,
	},
	isInRoofTrigger: false,
}

export const playerSlice = createSlice({
	name: 'player',
	initialState,
	reducers: {
		setPlayerPosition: (
			state,
			action: PayloadAction<{ tileX: number; tileY: number }>,
		) => {
			state.position.tileX = action.payload.tileX
			state.position.tileY = action.payload.tileY
		},
		setIsInRoofTrigger: (state, action: PayloadAction<boolean>) => {
			state.isInRoofTrigger = action.payload
		},
		movePlayer: (
			state,
			action: PayloadAction<{
				tileX: number
				tileY: number
				isInRoofTrigger: boolean
			}>,
		) => {
			state.position.tileX = action.payload.tileX
			state.position.tileY = action.payload.tileY
			state.isInRoofTrigger = action.payload.isInRoofTrigger
		},
	},
})

export const { setPlayerPosition, setIsInRoofTrigger, movePlayer } =
	playerSlice.actions
export default playerSlice.reducer
