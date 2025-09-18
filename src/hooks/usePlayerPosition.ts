import { useCallback, useRef, useState } from 'react'
import type { GameMap, TileCoordinates } from '../types/map'

export const usePlayerPosition = (initialTileX = 50, initialTileY = 50) => {
	const [playerTileX, setPlayerTileX] = useState(initialTileX)
	const [playerTileY, setPlayerTileY] = useState(initialTileY)
	const [isInRoofTrigger, setIsInRoofTrigger] = useState(false)

	const currentMap = useRef<GameMap | null>(null)

	const setCurrentMap = useCallback((map: GameMap) => {
		currentMap.current = map
	}, [])

	const getTileAt = useCallback((tileX: number, tileY: number) => {
		if (!currentMap.current) return null

		// Convert to array indices (maps are 1-based, arrays are 0-based)
		const arrayX = tileX - currentMap.current.bounds.minX
		const arrayY = tileY - currentMap.current.bounds.minY

		if (
			arrayX < 0 ||
			arrayX >= currentMap.current.width ||
			arrayY < 0 ||
			arrayY >= currentMap.current.height
		) {
			return null
		}

		return currentMap.current.tiles[arrayX][arrayY]
	}, [])

	const isValidPosition = useCallback(
		(tileX: number, tileY: number): boolean => {
			const tile = getTileAt(tileX, tileY)
			if (!tile) return false // Out of bounds

			return !tile.isBlocked
		},
		[getTileAt],
	)

	const checkRoofTrigger = useCallback(
		(tileX: number, tileY: number): boolean => {
			const tile = getTileAt(tileX, tileY)
			if (!tile) return false

			// TODO: Define which trigger values correspond to roofs
			// For now, assuming trigger values 1-4 are roof triggers
			return tile.trigger !== null && tile.trigger >= 1 && tile.trigger <= 4
		},
		[getTileAt],
	)

	const moveToTile = useCallback(
		(newTileX: number, newTileY: number): boolean => {
			if (!isValidPosition(newTileX, newTileY)) {
				return false // Movement blocked
			}

			setPlayerTileX(newTileX)
			setPlayerTileY(newTileY)

			// Check for roof trigger
			const hasRoofTrigger = checkRoofTrigger(newTileX, newTileY)
			setIsInRoofTrigger(hasRoofTrigger)

			return true // Movement successful
		},
		[isValidPosition, checkRoofTrigger],
	)

	const getPlayerCoordinates = useCallback(
		(): TileCoordinates => ({
			x: playerTileX,
			y: playerTileY,
		}),
		[playerTileX, playerTileY],
	)

	return {
		playerTileX,
		playerTileY,
		isInRoofTrigger,
		setCurrentMap,
		getTileAt,
		isValidPosition,
		moveToTile,
		getPlayerCoordinates,
	}
}
