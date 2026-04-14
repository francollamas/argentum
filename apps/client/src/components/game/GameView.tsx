import type { Container, Graphics } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { DEBUG_MODE } from '../../config/debug'
import { useMapLoader } from '../../hooks/useMapLoader'
import { usePlayerMovement } from '../../hooks/usePlayerMovement'
import { useSmoothCamera } from '../../hooks/useSmoothCamera'
import { useWorldViewportMetrics } from '../../store/viewportStore'
import { DebugOverlay } from '../debug/DebugOverlay'
import { MapRenderer } from './MapRenderer'

type GameViewProps = {
	mapNumber: number
}

/**
 * Main game view component that orchestrates the game world rendering
 * Handles map loading, camera positioning, and player movement
 */
export const GameView: FC<GameViewProps> = ({ mapNumber }) => {
	const { map, loading, error } = useMapLoader(mapNumber)
	const { cameraX, cameraY, worldZoom } = useSmoothCamera(map || undefined)
	const {
		worldViewportHeight,
		worldViewportWidth,
		worldViewportX,
		worldViewportY,
	} = useWorldViewportMetrics()
	usePlayerMovement({ map: map || undefined }) // Only need for side effects, not return values

	const maskRef = useRef<Graphics>(null)
	const gameContainerRef = useRef<Container>(null)

	// Set up the mask when refs are available
	useEffect(() => {
		if (maskRef.current && gameContainerRef.current) {
			gameContainerRef.current.mask = maskRef.current
		}
	})

	// Don't render anything until map is fully loaded
	if (loading || error || !map) {
		return (
			<pixiGraphics
				draw={(g) => {
					g.clear()
					g.rect(
						worldViewportX,
						worldViewportY,
						worldViewportWidth,
						worldViewportHeight,
					)
					g.fill(0x120c09)
				}}
			/>
		)
	}

	return (
		<pixiContainer>
			{/* Viewport mask - defines the clipping area */}
			<pixiGraphics
				ref={maskRef}
				draw={(g) => {
					g.clear()
					g.rect(
						worldViewportX,
						worldViewportY,
						worldViewportWidth,
						worldViewportHeight,
					)
					g.fill(0x000000)
				}}
			/>

			{/* Game content with camera transform and mask applied */}
			<pixiContainer
				ref={gameContainerRef}
				x={cameraX}
				y={cameraY}
				scale={worldZoom}
				roundPixels
			>
				<MapRenderer map={map} cameraX={cameraX} cameraY={cameraY} />
				{DEBUG_MODE && (
					<DebugOverlay map={map} cameraX={cameraX} cameraY={cameraY} />
				)}
			</pixiContainer>
		</pixiContainer>
	)
}
