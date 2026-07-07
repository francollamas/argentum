import { useCallback, useEffect } from 'react'
import { movementService } from '../services/movement'
import { usePlayerStore } from '../store'
import { InputAction } from '../types/input'
import type { GameMap } from '../types/map'
import { useKeyPressed } from './useKeyPressed'
import { usePlayerPosition } from './usePlayer'

const MOVEMENT_INTERVAL = 250 // milliseconds between movements
const POLLING_INTERVAL = 16 // ~60fps

export type MovementDirection = 'up' | 'down' | 'left' | 'right'

let lastMoveTimestamp = 0
let isMovementLocked = false

interface UsePlayerMovementProps {
	map?: GameMap
}

export const useDirectionalPlayerMovement = ({
	map,
}: UsePlayerMovementProps = {}) => {
	const movePlayer = usePlayerStore((state) => state.movePlayer)

	useEffect(() => {
		if (map) {
			movementService.setMap(map)
		}
	}, [map])

	const moveInDirection = useCallback(
		(direction: MovementDirection): boolean => {
			const currentTime = performance.now()
			const playerPosition = usePlayerStore.getState().position

			if (currentTime - lastMoveTimestamp < MOVEMENT_INTERVAL) {
				return false
			}

			const nextPosition = movementService.calculateNextPosition(
				playerPosition.tileX,
				playerPosition.tileY,
				direction,
			)

			if (!movementService.isValidPosition(nextPosition.x, nextPosition.y)) {
				return false
			}

			movePlayer({
				tileX: nextPosition.x,
				tileY: nextPosition.y,
			})

			lastMoveTimestamp = currentTime
			return true
		},
		[movePlayer],
	)

	return { moveInDirection }
}

export const usePlayerMovement = ({ map }: UsePlayerMovementProps = {}) => {
	const { isActionPressed } = useKeyPressed()
	const { moveInDirection } = useDirectionalPlayerMovement({ map })
	const playerPosition = usePlayerPosition()

	const getNextDirection = useCallback((): MovementDirection | null => {
		if (isActionPressed(InputAction.MOVE_UP)) return 'up'
		if (isActionPressed(InputAction.MOVE_DOWN)) return 'down'
		if (isActionPressed(InputAction.MOVE_LEFT)) return 'left'
		if (isActionPressed(InputAction.MOVE_RIGHT)) return 'right'
		return null
	}, [isActionPressed])

	useEffect(() => {
		const checkMovement = () => {
			if (!isMovementLocked) {
				const direction = getNextDirection()
				if (direction) {
					isMovementLocked = true
					moveInDirection(direction)

					setTimeout(() => {
						isMovementLocked = false
					}, 50)
				}
			}
		}

		const intervalId = setInterval(checkMovement, POLLING_INTERVAL)
		return () => clearInterval(intervalId)
	}, [getNextDirection, moveInDirection])

	return {
		playerTileX: playerPosition.tileX,
		playerTileY: playerPosition.tileY,
	}
}
