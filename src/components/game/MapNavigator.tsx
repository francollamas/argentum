import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useInput } from '../../hooks/useInput'
import { InputAction } from '../../types/input'
import { MapRenderer } from './MapRenderer'

extend({ Container })

type MapNavigatorProps = {
	mapNumber: number
	viewportWidth?: number
	viewportHeight?: number
}

export const MapNavigator: FC<MapNavigatorProps> = ({
	mapNumber,
	viewportWidth = GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH,
	viewportHeight = GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT,
}) => {
	const [cameraX, setCameraX] = useState(
		GAME_CONSTANTS.CAMERA.DEFAULT_X * GAME_CONSTANTS.TILE_SIZE,
	)
	const [cameraY, setCameraY] = useState(
		GAME_CONSTANTS.CAMERA.DEFAULT_Y * GAME_CONSTANTS.TILE_SIZE,
	)

	const moveUp = useCallback(() => {
		setCameraY((prev) => prev + GAME_CONSTANTS.TILE_SIZE)
	}, [])

	const moveDown = useCallback(() => {
		setCameraY((prev) => prev - GAME_CONSTANTS.TILE_SIZE)
	}, [])

	const moveLeft = useCallback(() => {
		setCameraX((prev) => prev + GAME_CONSTANTS.TILE_SIZE)
	}, [])

	const moveRight = useCallback(() => {
		setCameraX((prev) => prev - GAME_CONSTANTS.TILE_SIZE)
	}, [])

	useInput({
		[InputAction.MOVE_UP]: moveUp,
		[InputAction.MOVE_DOWN]: moveDown,
		[InputAction.MOVE_LEFT]: moveLeft,
		[InputAction.MOVE_RIGHT]: moveRight,
	})

	return (
		<pixiContainer x={cameraX} y={cameraY}>
			<MapRenderer
				mapNumber={mapNumber}
				viewportWidth={viewportWidth}
				viewportHeight={viewportHeight}
			/>
		</pixiContainer>
	)
}
