import { GAME_CONSTANTS } from '../constants/game'
import type { GameMap } from '../types/map'

export interface ViewportBounds {
	startX: number
	endX: number
	startY: number
	endY: number
	viewportLeft: number
	viewportTop: number
	viewportRight: number
	viewportBottom: number
}

export const calculateViewportBounds = (
	cameraX: number,
	cameraY: number,
	map: GameMap,
	padding: number = 0,
): ViewportBounds => {
	const viewportLeft = -cameraX
	const viewportTop = -cameraY
	const viewportRight = viewportLeft + GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH
	const viewportBottom = viewportTop + GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT

	const startX = Math.max(
		0,
		Math.floor(viewportLeft / GAME_CONSTANTS.TILE_SIZE) - padding,
	)
	const endX = Math.min(
		map.width - 1,
		Math.floor(viewportRight / GAME_CONSTANTS.TILE_SIZE) + padding,
	)
	const startY = Math.max(
		0,
		Math.floor(viewportTop / GAME_CONSTANTS.TILE_SIZE) - padding,
	)
	const endY = Math.min(
		map.height - 1,
		Math.floor(viewportBottom / GAME_CONSTANTS.TILE_SIZE) + padding,
	)

	return {
		startX,
		endX,
		startY,
		endY,
		viewportLeft,
		viewportTop,
		viewportRight,
		viewportBottom,
	}
}

export const getTilePositionInPixels = (tileX: number, tileY: number) => ({
	x: tileX * GAME_CONSTANTS.TILE_SIZE,
	y: tileY * GAME_CONSTANTS.TILE_SIZE,
})
