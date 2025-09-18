import { useEffect, useRef, useState } from 'react'
import { GAME_CONSTANTS } from '../constants/game'
import { useAppSelector } from '../store/hooks'

const ANIMATION_DURATION = 250 // milliseconds - like original client (slower, more deliberate movement)

export const useSmoothCamera = () => {
	const reduxPlayerPosition = useAppSelector((state) => state.player.position)

	// Use the correct initial camera position (same as constants)
	const [cameraX, setCameraX] = useState(GAME_CONSTANTS.CAMERA.DEFAULT_X)
	const [cameraY, setCameraY] = useState(GAME_CONSTANTS.CAMERA.DEFAULT_Y)

	const animationRef = useRef<number | null>(null)
	const isAnimating = useRef(false)
	const currentCameraPosition = useRef({
		x: GAME_CONSTANTS.CAMERA.DEFAULT_X,
		y: GAME_CONSTANTS.CAMERA.DEFAULT_Y,
	})
	const lastPlayerPosition = useRef({
		tileX: 50, // This should match the initial player position
		tileY: 50,
	})

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

	const calculateCameraPositionForPlayer = (playerTileX: number, playerTileY: number) => {
		// Convert player tile position to camera position
		// Camera shows player at center of viewport
		const centerTileIndexX = Math.floor(GAME_CONSTANTS.VIEWPORT.TILES_HORIZONTAL / 2)
		const centerTileIndexY = Math.floor(GAME_CONSTANTS.VIEWPORT.TILES_VERTICAL / 2)

		// Calculate where camera should be to center player
		const playerPixelX = (playerTileX - GAME_CONSTANTS.MAP.MIN_X) * GAME_CONSTANTS.TILE_SIZE
		const playerPixelY = (playerTileY - GAME_CONSTANTS.MAP.MIN_Y) * GAME_CONSTANTS.TILE_SIZE

		const targetCameraX = -(playerPixelX - centerTileIndexX * GAME_CONSTANTS.TILE_SIZE)
		const targetCameraY = -(playerPixelY - centerTileIndexY * GAME_CONSTANTS.TILE_SIZE)

		return clampCameraPosition(targetCameraX, targetCameraY)
	}

	// React to player position changes and animate camera
	useEffect(() => {
		const currentPlayerPos = reduxPlayerPosition
		const lastPos = lastPlayerPosition.current

		// Check if player position changed
		if (currentPlayerPos.tileX !== lastPos.tileX || currentPlayerPos.tileY !== lastPos.tileY) {
			// Player moved, animate camera to follow
			// Use actual camera state values instead of ref to avoid desync
			const startX = cameraX
			const startY = cameraY

			const targetPos = calculateCameraPositionForPlayer(currentPlayerPos.tileX, currentPlayerPos.tileY)
			const finalTargetX = targetPos.x
			const finalTargetY = targetPos.y

			// Update current position reference
			currentCameraPosition.current = { x: finalTargetX, y: finalTargetY }
			lastPlayerPosition.current = { tileX: currentPlayerPos.tileX, tileY: currentPlayerPos.tileY }

			// If no movement needed, don't animate
			if (startX === finalTargetX && startY === finalTargetY) {
				return
			}

			// Cancel previous animation
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}

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
					isAnimating.current = false
				}
			}

			isAnimating.current = true
			animationRef.current = requestAnimationFrame(animate)
		}
	}, [reduxPlayerPosition])

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
		isAnimating: isAnimating.current,
	}
}
