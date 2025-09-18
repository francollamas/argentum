import { useState, useRef, useCallback, useEffect } from 'react'
import { GAME_CONSTANTS } from '../constants/game'
import { useKeyPressed } from './useKeyPressed'
import { usePlayerPosition } from './usePlayerPosition'
import { InputAction } from '../types/input'
import type { GameMap } from '../types/map'

const ANIMATION_DURATION = 250 // milliseconds - like original client (slower, more deliberate movement)

type MovementDirection = 'up' | 'down' | 'left' | 'right'

type UseSmoothCameraProps = {
	map?: GameMap
}

export const useSmoothCamera = ({ map }: UseSmoothCameraProps = {}) => {
	const [cameraX, setCameraX] = useState(GAME_CONSTANTS.CAMERA.DEFAULT_X)
	const [cameraY, setCameraY] = useState(GAME_CONSTANTS.CAMERA.DEFAULT_Y)
	const { isActionPressed } = useKeyPressed()
	const playerPosition = usePlayerPosition()

	const animationRef = useRef<number | null>(null)
	const isAnimating = useRef(false)
	const currentPosition = useRef({ x: GAME_CONSTANTS.CAMERA.DEFAULT_X, y: GAME_CONSTANTS.CAMERA.DEFAULT_Y })

	// Update map when it changes
	useEffect(() => {
		if (map) {
			playerPosition.setCurrentMap(map)
		}
	}, [map, playerPosition])

	// Calculate map bounds in pixels
	const mapWidthPixels = GAME_CONSTANTS.MAP.WIDTH_PIXELS
	const mapHeightPixels = GAME_CONSTANTS.MAP.HEIGHT_PIXELS

	// Camera limits (negative because camera position is inverted)
	const minCameraX = -(mapWidthPixels - GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH)
	const maxCameraX = 0
	const minCameraY = -(mapHeightPixels - GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT)
	const maxCameraY = 0

	const clampCameraPosition = (x: number, y: number) => {
		const clampedX = Math.max(minCameraX, Math.min(maxCameraX, x))
		const clampedY = Math.max(minCameraY, Math.min(maxCameraY, y))
		return { x: clampedX, y: clampedY }
	}

	const getNextDirection = useCallback((): MovementDirection | null => {
		if (isActionPressed(InputAction.MOVE_UP)) return 'up'
		if (isActionPressed(InputAction.MOVE_DOWN)) return 'down'
		if (isActionPressed(InputAction.MOVE_LEFT)) return 'left'
		if (isActionPressed(InputAction.MOVE_RIGHT)) return 'right'
		return null
	}, [isActionPressed])

	const startMovement = useCallback((direction: MovementDirection) => {
		const startX = currentPosition.current.x
		const startY = currentPosition.current.y

		// Calculate new target position
		let newTargetX = startX
		let newTargetY = startY

		switch (direction) {
			case 'up':
				newTargetY = startY + GAME_CONSTANTS.TILE_SIZE
				break
			case 'down':
				newTargetY = startY - GAME_CONSTANTS.TILE_SIZE
				break
			case 'left':
				newTargetX = startX + GAME_CONSTANTS.TILE_SIZE
				break
			case 'right':
				newTargetX = startX - GAME_CONSTANTS.TILE_SIZE
				break
		}

		const clamped = clampCameraPosition(newTargetX, newTargetY)
		const finalTargetX = clamped.x
		const finalTargetY = clamped.y

		// If no movement needed, don't animate
		if (startX === finalTargetX && startY === finalTargetY) {
			return
		}

		// Update current position to target
		currentPosition.current = { x: finalTargetX, y: finalTargetY }

		const deltaX = finalTargetX - startX
		const deltaY = finalTargetY - startY
		const startTime = performance.now()

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

			// Linear interpolation for consistent feel like original
			const x = startX + deltaX * progress
			const y = startY + deltaY * progress

			// Round to prevent subpixel rendering and tile gaps
			setCameraX(Math.round(x))
			setCameraY(Math.round(y))

			if (progress < 1) {
				animationRef.current = requestAnimationFrame(animate)
			} else {
				// Animation complete, check if should continue moving
				isAnimating.current = false
				const nextDirection = getNextDirection()
				if (nextDirection) {
					startMovement(nextDirection)
				}
			}
		}

		isAnimating.current = true
		animationRef.current = requestAnimationFrame(animate)
	}, [minCameraX, maxCameraX, minCameraY, maxCameraY, getNextDirection])

	// Check for movement when not animating with polling
	useEffect(() => {
		let intervalId: NodeJS.Timeout

		const checkMovement = () => {
			if (!isAnimating.current) {
				const direction = getNextDirection()
				if (direction) {
					startMovement(direction)
				}
			}
		}

		// Poll for input every 16ms (~60fps)
		intervalId = setInterval(checkMovement, 16)

		return () => {
			clearInterval(intervalId)
		}
	}, [getNextDirection, startMovement])

	// Movement functions - simple triggers that will be handled by the effect
	const moveCameraUp = useCallback(() => {}, [])
	const moveCameraDown = useCallback(() => {}, [])
	const moveCameraLeft = useCallback(() => {}, [])
	const moveCameraRight = useCallback(() => {}, [])

	// Cleanup animation on unmount
	useEffect(() => {
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}
		}
	}, [])

	return {
		cameraX,
		cameraY,
		moveCameraUp,
		moveCameraDown,
		moveCameraLeft,
		moveCameraRight,
		isAnimating: isAnimating.current,
	}
}