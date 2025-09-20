import { useTick } from '@pixi/react'
import { useRef, useState } from 'react'
import { GAME_CONSTANTS } from '../constants/game'
import { useAppSelector } from '../store/hooks'
import {
	selectIsInRoofTrigger,
	selectPlayerPosition,
	selectPlayerTileX,
	selectPlayerTileY,
} from '../store/slices/playerSlice'

export const usePlayerPosition = () => {
	return useAppSelector(selectPlayerPosition)
}

export const usePlayerTileX = () => {
	return useAppSelector(selectPlayerTileX)
}

export const usePlayerTileY = () => {
	return useAppSelector(selectPlayerTileY)
}

export const useIsInRoofTrigger = () => {
	return useAppSelector(selectIsInRoofTrigger)
}

export const usePlayer = () => {
	const position = usePlayerPosition()
	const isInRoofTrigger = useIsInRoofTrigger()

	return {
		position,
		isInRoofTrigger,
		tileX: position.tileX,
		tileY: position.tileY,
	}
}

export const usePlayerAnimatedPosition = () => {
	const playerPosition = usePlayerPosition()

	// Convertir posición de tile a pixels
	const getPixelPosition = (tileX: number, tileY: number) => {
		return {
			x: (tileX - GAME_CONSTANTS.MAP.MIN_X) * GAME_CONSTANTS.TILE_SIZE,
			y: (tileY - GAME_CONSTANTS.MAP.MIN_Y) * GAME_CONSTANTS.TILE_SIZE,
		}
	}

	// Estado de la posición animada actual
	const [animatedPosition, setAnimatedPosition] = useState(() =>
		getPixelPosition(playerPosition.tileX, playerPosition.tileY),
	)

	// Referencias para tracking del movimiento
	const targetPositionRef = useRef(animatedPosition)
	const previousPlayerPositionRef = useRef({
		tileX: playerPosition.tileX,
		tileY: playerPosition.tileY,
	})

	// Actualizar posición objetivo cuando el jugador se mueve
	if (
		playerPosition.tileX !== previousPlayerPositionRef.current.tileX ||
		playerPosition.tileY !== previousPlayerPositionRef.current.tileY
	) {
		targetPositionRef.current = getPixelPosition(
			playerPosition.tileX,
			playerPosition.tileY,
		)

		previousPlayerPositionRef.current = {
			tileX: playerPosition.tileX,
			tileY: playerPosition.tileY,
		}
	}

	// Animación suave hacia la posición objetivo
	useTick((ticker) => {
		const target = targetPositionRef.current
		const current = animatedPosition

		// Calcular la diferencia
		const deltaX = target.x - current.x
		const deltaY = target.y - current.y

		// Si la diferencia es muy pequeña, saltar directamente al objetivo
		if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
			if (deltaX !== 0 || deltaY !== 0) {
				setAnimatedPosition({ x: target.x, y: target.y })
			}
			return
		}

		// Velocidad exacta de caminata: 32 píxeles en 250ms = 128 px/s
		// A 60fps: 128/60 = 2.133 píxeles por frame
		const moveSpeed = 2.133 * ticker.deltaTime // 2.133 pixels per frame at 60fps

		const distanceX = Math.abs(deltaX)
		const distanceY = Math.abs(deltaY)

		let newX = current.x
		let newY = current.y

		// Movimiento lineal en X
		if (distanceX > 0) {
			const stepX = Math.min(moveSpeed, distanceX) * Math.sign(deltaX)
			newX = current.x + stepX
		}

		// Movimiento lineal en Y
		if (distanceY > 0) {
			const stepY = Math.min(moveSpeed, distanceY) * Math.sign(deltaY)
			newY = current.y + stepY
		}

		setAnimatedPosition({
			x: Math.round(newX),
			y: Math.round(newY),
		})
	})

	return {
		pixelX: animatedPosition.x,
		pixelY: animatedPosition.y,
		tileX: playerPosition.tileX,
		tileY: playerPosition.tileY,
	}
}
