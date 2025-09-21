import { extend, useTick } from '@pixi/react'
import * as TWEEN from '@tweenjs/tween.js'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useMapLoader } from '../../hooks/useMapLoader'
import { useIsInRoofTrigger } from '../../hooks/usePlayer'
import { calculateViewportBounds } from '../../utils/viewport'
import { MapLayerRenderer } from './MapTileRenderer'

extend({ Container })

type MapRendererProps = {
	mapNumber: number
	cameraX: number
	cameraY: number
}

export const MapRenderer: FC<MapRendererProps> = ({
	mapNumber,
	cameraX,
	cameraY,
}) => {
	const { map, loading, error } = useMapLoader(mapNumber)
	const isInRoofTrigger = useIsInRoofTrigger()

	const layer4ContainerRef = useRef<Container>(null)
	const lastRoofState = useRef<boolean | null>(null) // null means uninitialized
	const activeTweenRef = useRef<TWEEN.Tween<{ alpha: number }> | null>(null)

	// Update Tween.js animations on each frame
	useTick((ticker) => {
		if (activeTweenRef.current) {
			activeTweenRef.current.update(ticker.lastTime)
		}
	})

	// Animate roof fade when trigger state changes
	useEffect(() => {
		if (!layer4ContainerRef.current) return

		const container = layer4ContainerRef.current
		const targetAlpha = isInRoofTrigger ? 0 : 1

		// Skip if already at target
		if (Math.abs(container.alpha - targetAlpha) < 0.1) {
			lastRoofState.current = isInRoofTrigger
			return
		}

		// Stop any existing tween
		if (activeTweenRef.current) {
			activeTweenRef.current.stop()
		}

		// Create and start fade animation
		activeTweenRef.current = new TWEEN.Tween({ alpha: container.alpha })
			.to({ alpha: targetAlpha }, 500)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate((obj) => {
				container.alpha = obj.alpha
			})
			.onComplete(() => {
				activeTweenRef.current = null
			})
			.start()

		lastRoofState.current = isInRoofTrigger
	}, [isInRoofTrigger])

	if (loading || error || !map) {
		return <pixiContainer />
	}

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
