import { useMemo } from 'react'
import { GAME_CONSTANTS } from '../constants/game'
import { useWorldViewportMetrics } from '../store/viewportStore'
import type { GameMap } from '../types/map'
import { usePlayerAnimatedPosition } from './usePlayer'

type CameraPositionInput = {
	playerPixelX: number
	playerPixelY: number
	mapWidthPixels: number
	mapHeightPixels: number
	viewportWidth: number
	viewportHeight: number
	worldZoom: number
}

const calculateClampedCameraAxis = (
	targetCamera: number,
	viewportSize: number,
	worldSize: number,
) => {
	const scaledWorldSize = worldSize

	if (scaledWorldSize <= viewportSize) {
		return Math.round((viewportSize - scaledWorldSize) / 2)
	}

	const maxCamera = 0
	const minCamera = viewportSize - scaledWorldSize

	return Math.round(Math.max(minCamera, Math.min(maxCamera, targetCamera)))
}

export const calculateCameraPosition = ({
	playerPixelX,
	playerPixelY,
	mapWidthPixels,
	mapHeightPixels,
	viewportWidth,
	viewportHeight,
	worldZoom,
}: CameraPositionInput) => {
	const centerOffsetX = viewportWidth / 2
	const centerOffsetY = viewportHeight / 2
	const targetCameraX = centerOffsetX - playerPixelX * worldZoom
	const targetCameraY = centerOffsetY - playerPixelY * worldZoom

	return {
		x: calculateClampedCameraAxis(
			targetCameraX,
			viewportWidth,
			mapWidthPixels * worldZoom,
		),
		y: calculateClampedCameraAxis(
			targetCameraY,
			viewportHeight,
			mapHeightPixels * worldZoom,
		),
	}
}

export const useSmoothCamera = (map?: GameMap) => {
	const playerAnimatedPosition = usePlayerAnimatedPosition()
	const { worldViewportHeight, worldViewportWidth, worldZoom } =
		useWorldViewportMetrics()
	const mapWidthPixels =
		(map?.width ?? GAME_CONSTANTS.MAP.WIDTH) * GAME_CONSTANTS.TILE_SIZE
	const mapHeightPixels =
		(map?.height ?? GAME_CONSTANTS.MAP.HEIGHT) * GAME_CONSTANTS.TILE_SIZE

	const cameraPosition = useMemo(() => {
		return calculateCameraPosition({
			playerPixelX: playerAnimatedPosition.pixelX,
			playerPixelY: playerAnimatedPosition.pixelY,
			mapWidthPixels,
			mapHeightPixels,
			viewportWidth: worldViewportWidth,
			viewportHeight: worldViewportHeight,
			worldZoom,
		})
	}, [
		mapHeightPixels,
		mapWidthPixels,
		playerAnimatedPosition.pixelX,
		playerAnimatedPosition.pixelY,
		worldViewportHeight,
		worldViewportWidth,
		worldZoom,
	])

	return {
		cameraX: cameraPosition.x,
		cameraY: cameraPosition.y,
		worldZoom,
		isAnimating: false, // Para compatibilidad
	}
}
