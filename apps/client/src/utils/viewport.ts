import { GAME_CONSTANTS } from '../constants/game'
import type { GameMap } from '../types/map'
import { arrayIndexToPixel } from './coordinates'

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

type VisibleWorldBoundsInput = {
	cameraX: number
	cameraY: number
	viewportWidth: number
	viewportHeight: number
	worldZoom: number
}

type ViewportBoundsInput = VisibleWorldBoundsInput & {
	map: GameMap
	padding?: number
}

export const calculateVisibleWorldBounds = ({
	cameraX,
	cameraY,
	viewportWidth,
	viewportHeight,
	worldZoom,
}: VisibleWorldBoundsInput) => {
	const safeZoom = worldZoom <= 0 ? 1 : worldZoom
	const viewportLeft = -cameraX / safeZoom
	const viewportTop = -cameraY / safeZoom
	const viewportRight = viewportLeft + viewportWidth / safeZoom
	const viewportBottom = viewportTop + viewportHeight / safeZoom

	return {
		viewportLeft,
		viewportTop,
		viewportRight,
		viewportBottom,
	}
}

export const calculateViewportBounds = (
	input: ViewportBoundsInput,
): ViewportBounds => {
	const {
		cameraX,
		cameraY,
		map,
		padding = 0,
		viewportWidth,
		viewportHeight,
		worldZoom,
	} = input
	const { viewportLeft, viewportTop, viewportRight, viewportBottom } =
		calculateVisibleWorldBounds({
			cameraX,
			cameraY,
			viewportWidth,
			viewportHeight,
			worldZoom,
		})

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

/**
 * @deprecated Use arrayIndexToPixel from utils/coordinates instead
 * This function will be removed in a future version
 */
export const getTilePositionInPixels = (
	arrayX: number,
	arrayY: number,
): { x: number; y: number } => arrayIndexToPixel(arrayX, arrayY)
