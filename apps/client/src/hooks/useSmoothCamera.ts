import { useCallback, useMemo } from 'react'
import { GAME_CONSTANTS } from '../constants/game'
import { usePlayerAnimatedPosition } from './usePlayer'

export const useSmoothCamera = () => {
	const playerAnimatedPosition = usePlayerAnimatedPosition()

	// Función para calcular la posición de la cámara basada en la posición animada del player
	const calculateCameraPosition = useCallback(
		(playerPixelX: number, playerPixelY: number) => {
			// Centrar cámara en el jugador
			const centerOffsetX = GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH / 2
			const centerOffsetY = GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT / 2

			// Calcular posición de cámara (negativa porque es el offset del mundo)
			let cameraX = -(playerPixelX - centerOffsetX)
			let cameraY = -(playerPixelY - centerOffsetY)

			// Aplicar límites del mapa
			const maxCameraX = 0
			const minCameraX = -(
				GAME_CONSTANTS.MAP.WIDTH_PIXELS - GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH
			)
			const maxCameraY = 0
			const minCameraY = -(
				GAME_CONSTANTS.MAP.HEIGHT_PIXELS -
				GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT
			)

			cameraX = Math.max(minCameraX, Math.min(maxCameraX, cameraX))
			cameraY = Math.max(minCameraY, Math.min(maxCameraY, cameraY))

			return { x: cameraX, y: cameraY }
		},
		[],
	)

	// Calcular posición de cámara basada en la posición animada del player
	const cameraPosition = useMemo(() => {
		return calculateCameraPosition(
			playerAnimatedPosition.pixelX,
			playerAnimatedPosition.pixelY,
		)
	}, [
		playerAnimatedPosition.pixelX,
		playerAnimatedPosition.pixelY,
		calculateCameraPosition,
	])

	return {
		cameraX: cameraPosition.x,
		cameraY: cameraPosition.y,
		isAnimating: false, // Para compatibilidad
	}
}
