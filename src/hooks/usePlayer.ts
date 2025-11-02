import { useTick } from '@pixi/react'
import { useRef, useState } from 'react'
import { movementService } from '../services/movement'
import { useAppSelector } from '../store/hooks'
import { tileToPixel } from '../utils/coordinates'

export const usePlayerPosition = () => {
	return useAppSelector((state) => state.player.position)
}

export const useIsInRoofTrigger = () => {
	const position = usePlayerPosition()
	return movementService.isRoofTrigger(position.tileX, position.tileY)
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

	// Estado de la posición animada actual
	const [animatedPosition, setAnimatedPosition] = useState(() =>
		tileToPixel(playerPosition.tileX, playerPosition.tileY),
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
		targetPositionRef.current = tileToPixel(
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
