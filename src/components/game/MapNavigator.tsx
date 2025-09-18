import { extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import type { FC } from 'react'
import { useRef, useEffect } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useSmoothCamera } from '../../hooks/useSmoothCamera'
import { MapRenderer } from './MapRenderer'

extend({ Container, Graphics })

type MapNavigatorProps = {
	mapNumber: number
}

export const MapNavigator: FC<MapNavigatorProps> = ({ mapNumber }) => {
	const { cameraX, cameraY } = useSmoothCamera()

	const maskRef = useRef<Graphics>(null)
	const gameContainerRef = useRef<Container>(null)

	// Set up the mask when refs are available
	useEffect(() => {
		if (maskRef.current && gameContainerRef.current) {
			gameContainerRef.current.mask = maskRef.current
		}
	})

	return (
		<pixiContainer>
			{/* Viewport mask - defines the clipping area */}
			<pixiGraphics
				ref={maskRef}
				draw={(g) => {
					g.clear()
					g.rect(0, 0, GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH, GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT)
					g.fill(0xffffff)
				}}
			/>

			{/* Game content with camera transform and mask applied */}
			<pixiContainer
				ref={gameContainerRef}
				x={cameraX}
				y={cameraY}
			>
				<MapRenderer mapNumber={mapNumber} cameraX={cameraX} cameraY={cameraY} />
			</pixiContainer>
		</pixiContainer>
	)
}
