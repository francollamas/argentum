import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useState } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useInput } from '../../hooks/useInput'
import { InputAction } from '../../types/input'
import { MapRenderer } from './MapRenderer'

extend({ Container })

type MapNavigatorProps = {
	mapNumber: number
}

export const MapNavigator: FC<MapNavigatorProps> = ({ mapNumber }) => {
	const [cameraX, setCameraX] = useState(
		GAME_CONSTANTS.CAMERA.DEFAULT_X * GAME_CONSTANTS.TILE_SIZE,
	)
	const [cameraY, setCameraY] = useState(
		GAME_CONSTANTS.CAMERA.DEFAULT_Y * GAME_CONSTANTS.TILE_SIZE,
	)

	useInput({
		[InputAction.MOVE_UP]: () =>
			setCameraY((prev) => prev + GAME_CONSTANTS.TILE_SIZE),
		[InputAction.MOVE_DOWN]: () =>
			setCameraY((prev) => prev - GAME_CONSTANTS.TILE_SIZE),
		[InputAction.MOVE_LEFT]: () =>
			setCameraX((prev) => prev + GAME_CONSTANTS.TILE_SIZE),
		[InputAction.MOVE_RIGHT]: () =>
			setCameraX((prev) => prev - GAME_CONSTANTS.TILE_SIZE),
	})

	return (
		<pixiContainer x={cameraX} y={cameraY}>
			<MapRenderer mapNumber={mapNumber} />
		</pixiContainer>
	)
}
