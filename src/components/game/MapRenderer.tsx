import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useRef } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useIsInRoofTrigger } from '../../hooks/usePlayer'
import { useRoofAnimation } from '../../hooks/useRoofAnimation'
import type { GameMap } from '../../types/map'
import { calculateViewportBounds } from '../../utils/viewport'
import { MapLayerRenderer } from './MapTileRenderer'

extend({ Container })

type MapRendererProps = {
	map: GameMap
	cameraX: number
	cameraY: number
}

export const MapRenderer: FC<MapRendererProps> = ({
	map,
	cameraX,
	cameraY,
}) => {
	const isInRoofTrigger = useIsInRoofTrigger(map)
	const layer4ContainerRef = useRef<Container>(null)

	// Handle roof fade animation
	useRoofAnimation(isInRoofTrigger, layer4ContainerRef)

	// Calculate bounds for different layers with appropriate padding
	const groundBounds = calculateViewportBounds(
		cameraX,
		cameraY,
		map,
		GAME_CONSTANTS.VIEWPORT.PADDING.GROUND,
	)
	const objectBounds = calculateViewportBounds(
		cameraX,
		cameraY,
		map,
		GAME_CONSTANTS.VIEWPORT.PADDING.OBJECTS,
	)
	const overlayBounds = calculateViewportBounds(
		cameraX,
		cameraY,
		map,
		GAME_CONSTANTS.VIEWPORT.PADDING.OVERLAY,
	)

	return (
		<pixiContainer>
			<MapLayerRenderer map={map} bounds={groundBounds} layer='ground' />
			<MapLayerRenderer map={map} bounds={groundBounds} layer='background' />
			<MapLayerRenderer map={map} bounds={objectBounds} layer='objects' />
			<MapLayerRenderer map={map} bounds={objectBounds} layer='foreground' />
			<pixiContainer ref={layer4ContainerRef}>
				<MapLayerRenderer map={map} bounds={overlayBounds} layer='overlay' />
			</pixiContainer>
		</pixiContainer>
	)
}
