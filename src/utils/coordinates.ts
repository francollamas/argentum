import { GAME_CONSTANTS } from '../constants/game'

/**
 * Coordinates utility functions for converting between tile and pixel positions
 */

/**
 * Converts tile coordinates to pixel coordinates
 * @param tileX - Tile X coordinate (world coordinates)
 * @param tileY - Tile Y coordinate (world coordinates)
 * @returns Object with pixel x and y coordinates
 */
export const tileToPixel = (
	tileX: number,
	tileY: number,
): { x: number; y: number } => {
	return {
		x: (tileX - GAME_CONSTANTS.MAP.MIN_X) * GAME_CONSTANTS.TILE_SIZE,
		y: (tileY - GAME_CONSTANTS.MAP.MIN_Y) * GAME_CONSTANTS.TILE_SIZE,
	}
}

/**
 * Converts pixel coordinates to tile coordinates
 * @param pixelX - Pixel X coordinate
 * @param pixelY - Pixel Y coordinate
 * @returns Object with tile x and y coordinates (world coordinates)
 */
export const pixelToTile = (
	pixelX: number,
	pixelY: number,
): { x: number; y: number } => {
	return {
		x: Math.floor(pixelX / GAME_CONSTANTS.TILE_SIZE) + GAME_CONSTANTS.MAP.MIN_X,
		y: Math.floor(pixelY / GAME_CONSTANTS.TILE_SIZE) + GAME_CONSTANTS.MAP.MIN_Y,
	}
}

/**
 * Converts array index to pixel coordinates (for rendering)
 * Used when you have an array index and need to know where to render it
 * @param arrayX - X index in the map tiles array
 * @param arrayY - Y index in the map tiles array
 * @returns Object with pixel x and y coordinates
 */
export const arrayIndexToPixel = (
	arrayX: number,
	arrayY: number,
): { x: number; y: number } => {
	return {
		x: arrayX * GAME_CONSTANTS.TILE_SIZE,
		y: arrayY * GAME_CONSTANTS.TILE_SIZE,
	}
}

/**
 * Converts world tile coordinates to array index
 * @param worldTileX - Tile X coordinate (world coordinates)
 * @param worldTileY - Tile Y coordinate (world coordinates)
 * @returns Object with array x and y indices
 */
export const worldTileToArrayIndex = (
	worldTileX: number,
	worldTileY: number,
): { x: number; y: number } => {
	return {
		x: worldTileX - GAME_CONSTANTS.MAP.MIN_X,
		y: worldTileY - GAME_CONSTANTS.MAP.MIN_Y,
	}
}

/**
 * Converts array index to world tile coordinates
 * @param arrayX - X index in the map tiles array
 * @param arrayY - Y index in the map tiles array
 * @returns Object with world tile x and y coordinates
 */
export const arrayIndexToWorldTile = (
	arrayX: number,
	arrayY: number,
): { x: number; y: number } => {
	return {
		x: arrayX + GAME_CONSTANTS.MAP.MIN_X,
		y: arrayY + GAME_CONSTANTS.MAP.MIN_Y,
	}
}
