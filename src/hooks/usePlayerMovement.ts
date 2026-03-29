import { useCallback, useEffect, useRef } from 'react'
import { movementService } from '../services/movement'
import { usePlayerStore } from '../store/playerStore'
import { InputAction } from '../types/input'
import type { GameMap } from '../types/map'
import { useKeyPressed } from './useKeyPressed'
import { usePlayerPosition } from './usePlayer'

const MOVEMENT_INTERVAL = 250 // milliseconds between movements
const POLLING_INTERVAL = 16 // ~60fps

type MovementDirection = 'up' | 'down' | 'left' | 'right'

interface UsePlayerMovementProps {
	map?: GameMap
}

export const usePlayerMovement = ({ map }: UsePlayerMovementProps = {}) => {
	const { isActionPressed } = useKeyPressed()
	const movePlayer = usePlayerStore((state) => state.movePlayer)
	const playerPosition = usePlayerPosition()

	const lastMoveTime = useRef<number>(0)
	const isMoving = useRef(false)

	// Update map when it changes
	useEffect(() => {
		if (map) {
			movementService.setMap(map)
		}
	}, [map])

	const getNextDirection = useCallback((): MovementDirection | null => {
		if (isActionPressed(InputAction.MOVE_UP)) return 'up'
		if (isActionPressed(InputAction.MOVE_DOWN)) return 'down'
		if (isActionPressed(InputAction.MOVE_LEFT)) return 'left'
		if (isActionPressed(InputAction.MOVE_RIGHT)) return 'right'
		return null
	}, [isActionPressed])

	const attemptMove = useCallback(
		(direction: MovementDirection): boolean => {
			const currentTime = performance.now()

			// Throttle movement
			if (currentTime - lastMoveTime.current < MOVEMENT_INTERVAL) {
				return false
			}

			const nextPosition = movementService.calculateNextPosition(
				playerPosition.tileX,
				playerPosition.tileY,
				direction,
			)

			// Check if movement is valid
			if (!movementService.isValidPosition(nextPosition.x, nextPosition.y)) {
				return false
			}

			// Update player position
			movePlayer({
				tileX: nextPosition.x,
				tileY: nextPosition.y,
			})

			lastMoveTime.current = currentTime
			return true
		},
		[playerPosition, movePlayer],
	)

	// Movement polling system
	useEffect(() => {
		const checkMovement = () => {
			if (!isMoving.current) {
				const direction = getNextDirection()
				if (direction) {
					isMoving.current = true
					attemptMove(direction)

					// Reset moving flag after short delay
					setTimeout(() => {
						isMoving.current = false
					}, 50)
				}
			}
		}

		const intervalId = setInterval(checkMovement, POLLING_INTERVAL)
		return () => clearInterval(intervalId)
	}, [getNextDirection, attemptMove])

	return {
		playerTileX: playerPosition.tileX,
		playerTileY: playerPosition.tileY,
	}
}
