import { useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { movePlayer } from '../store/slices/playerSlice'
import { InputAction } from '../types/input'
import type { GameMap } from '../types/map'
import { useKeyPressed } from './useKeyPressed'
import { usePlayerPosition } from './usePlayerPosition'

const MOVEMENT_INTERVAL = 250 // milliseconds between movements

type MovementDirection = 'up' | 'down' | 'left' | 'right'

type UsePlayerMovementProps = {
	map?: GameMap
}

export const usePlayerMovement = ({ map }: UsePlayerMovementProps = {}) => {
	const { isActionPressed } = useKeyPressed()
	const playerPosition = usePlayerPosition()
	const dispatch = useAppDispatch()
	const reduxPlayerPosition = useAppSelector((state) => state.player.position)

	const lastMoveTime = useRef<number>(0)
	const isMoving = useRef(false)

	// Update map when it changes
	useEffect(() => {
		if (map) {
			playerPosition.setCurrentMap(map)
		}
	}, [map, playerPosition])

	const getNextDirection = useCallback((): MovementDirection | null => {
		if (isActionPressed(InputAction.MOVE_UP)) return 'up'
		if (isActionPressed(InputAction.MOVE_DOWN)) return 'down'
		if (isActionPressed(InputAction.MOVE_LEFT)) return 'left'
		if (isActionPressed(InputAction.MOVE_RIGHT)) return 'right'
		return null
	}, [isActionPressed])

	const movePlayerToTile = useCallback(
		(direction: MovementDirection): boolean => {
			const currentTime = performance.now()

			// Throttle movement
			if (currentTime - lastMoveTime.current < MOVEMENT_INTERVAL) {
				return false
			}

			// Calculate new player tile position
			let newPlayerTileX = reduxPlayerPosition.tileX
			let newPlayerTileY = reduxPlayerPosition.tileY

			switch (direction) {
				case 'up':
					newPlayerTileY = reduxPlayerPosition.tileY - 1
					break
				case 'down':
					newPlayerTileY = reduxPlayerPosition.tileY + 1
					break
				case 'left':
					newPlayerTileX = reduxPlayerPosition.tileX - 1
					break
				case 'right':
					newPlayerTileX = reduxPlayerPosition.tileX + 1
					break
			}

			// Check if movement is valid
			if (!playerPosition.isValidPosition(newPlayerTileX, newPlayerTileY)) {
				return false // Movement blocked
			}

			// Update Redux immediately with new player position
			const tile = playerPosition.getTileAt(newPlayerTileX, newPlayerTileY)
			const isInRoofTrigger =
				tile?.trigger !== null && [1, 2, 4].includes(tile?.trigger || 0)

			dispatch(
				movePlayer({
					tileX: newPlayerTileX,
					tileY: newPlayerTileY,
					isInRoofTrigger,
				}),
			)

			lastMoveTime.current = currentTime
			return true
		},
		[reduxPlayerPosition, playerPosition, dispatch],
	)

	// Check for movement with polling
	useEffect(() => {
		let intervalId: NodeJS.Timeout

		const checkMovement = () => {
			if (!isMoving.current) {
				const direction = getNextDirection()
				if (direction) {
					isMoving.current = true
					const _moved = movePlayerToTile(direction)

					// Schedule next movement check
					setTimeout(() => {
						isMoving.current = false
					}, 50) // Small delay to prevent spam
				}
			}
		}

		// Poll for input every 16ms (~60fps)
		intervalId = setInterval(checkMovement, 16)

		return () => {
			clearInterval(intervalId)
		}
	}, [getNextDirection, movePlayerToTile])

	return {
		// Expose current player position from Redux
		playerTileX: reduxPlayerPosition.tileX,
		playerTileY: reduxPlayerPosition.tileY,
	}
}
