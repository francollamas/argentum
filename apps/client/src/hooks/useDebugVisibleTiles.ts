import { useMemo } from 'react'
import type { GameMap } from '../types/map'
import { arrayIndexToPixel, arrayIndexToWorldTile } from '../utils/coordinates'
import { calculateViewportBounds } from '../utils/viewport'

export interface DebugTileInfo {
	arrayX: number
	arrayY: number
	worldTileX: number
	worldTileY: number
	pixelX: number
	pixelY: number
	isBlocked: boolean
	trigger: number | null
}

/**
 * Hook to calculate visible tiles for debug overlay
 * @param cameraX - Camera X position
 * @param cameraY - Camera Y position
 * @param map - The game map
 * @param padding - Extra padding around viewport (default: 2)
 * @returns Array of debug tile information
 */
export const useDebugVisibleTiles = (
	cameraX: number,
	cameraY: number,
	map: GameMap,
	padding: number = 2,
): DebugTileInfo[] => {
	const bounds = calculateViewportBounds(cameraX, cameraY, map, padding)

	return useMemo(() => {
		const tiles: DebugTileInfo[] = []

		for (let y = bounds.startY; y <= bounds.endY; y++) {
			for (let x = bounds.startX; x <= bounds.endX; x++) {
				const tile = map.tiles[x][y]
				if (!tile) continue

				const { x: pixelX, y: pixelY } = arrayIndexToPixel(x, y)
				const { x: worldTileX, y: worldTileY } = arrayIndexToWorldTile(x, y)

				tiles.push({
					arrayX: x,
					arrayY: y,
					worldTileX,
					worldTileY,
					pixelX,
					pixelY,
					isBlocked: tile.isBlocked,
					trigger: tile.trigger,
				})
			}
		}

		return tiles
	}, [bounds, map.tiles])
}
