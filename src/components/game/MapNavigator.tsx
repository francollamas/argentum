import { extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { DEBUG_MODE } from '../../config/debug'
import { GAME_CONSTANTS } from '../../constants/game'
import { useMapLoader } from '../../hooks/useMapLoader'
import { usePlayerMovement } from '../../hooks/usePlayerMovement'
import { useSmoothCamera } from '../../hooks/useSmoothCamera'
import { useAppDispatch } from '../../store/hooks'
import { setCurrentMap } from '../../store/slices/worldSlice'
import { DebugOverlay } from '../debug/DebugOverlay'
import { MapRenderer } from './MapRenderer'

extend({ Container, Graphics })

type MapNavigatorProps = {
	mapNumber: number
}

export const MapNavigator: FC<MapNavigatorProps> = ({ mapNumber }) => {
	const { map } = useMapLoader(mapNumber)
	const { cameraX, cameraY } = useSmoothCamera()
	const { playerTileX, playerTileY } = usePlayerMovement({ map })
	const dispatch = useAppDispatch()

	const maskRef = useRef<Graphics>(null)
	const gameContainerRef = useRef<Container>(null)

	// Update Redux with current map when it loads
	useEffect(() => {
		if (map) {
			dispatch(setCurrentMap({ map, mapNumber }))
		}
	}, [map, mapNumber, dispatch])

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
					g.rect(
						0,
						0,
						GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH,
						GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT,
					)
					g.fill(0xffffff)
				}}
			/>

			{/* Game content with camera transform and mask applied */}
			<pixiContainer ref={gameContainerRef} x={cameraX} y={cameraY}>
				<MapRenderer
					mapNumber={mapNumber}
					cameraX={cameraX}
					cameraY={cameraY}
				/>
				{DEBUG_MODE && map && (
					<DebugOverlay map={map} cameraX={cameraX} cameraY={cameraY} />
				)}
			</pixiContainer>
		</pixiContainer>
	)
}
