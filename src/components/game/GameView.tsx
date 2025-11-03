import { LayoutContainer } from '@pixi/layout/components'
import { extend, useApplication } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import type { FC } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { DEBUG_MODE } from '../../config/debug'
import { GAME_CONSTANTS } from '../../constants/game'
import { useMapLoader } from '../../hooks/useMapLoader'
import { usePlayerMovement } from '../../hooks/usePlayerMovement'
import { useSmoothCamera } from '../../hooks/useSmoothCamera'
import { setScreen } from '../../store/slices/screenSlice'
import { FPSCounter } from '../common/FPSCounter'
import { Text } from '../common/Text'
import { UIButton } from '../common/UIButton'
import { DebugOverlay } from '../debug/DebugOverlay'
import { MapRenderer } from './MapRenderer'

extend({ Container, Graphics, LayoutContainer })

type GameViewProps = {
	mapNumber: number
}

/**
 * Main game view component that orchestrates the game world rendering
 * Handles map loading, camera positioning, and player movement
 */
export const GameView: FC<GameViewProps> = ({ mapNumber }) => {
	const { map, loading, error } = useMapLoader(mapNumber)
	const { cameraX, cameraY } = useSmoothCamera()
	usePlayerMovement({ map: map || undefined })
	const dispatch = useDispatch()
	const { app } = useApplication()

	const maskRef = useRef<Graphics>(null)
	const gameContainerRef = useRef<Container>(null)

	const handleBackClick = useCallback(() => {
		dispatch(setScreen('login'))
	}, [dispatch])

	// Set up the mask when refs are available
	useEffect(() => {
		if (maskRef.current && gameContainerRef.current) {
			gameContainerRef.current.mask = maskRef.current
		}
	})

	// Don't render anything until map is fully loaded
	if (loading || error || !map) {
		return null
	}

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
					g.fill(0x000000)
				}}
			/>

			{/* Game content with camera transform and mask applied */}
			<pixiContainer ref={gameContainerRef} x={cameraX} y={cameraY}>
				<MapRenderer map={map} cameraX={cameraX} cameraY={cameraY} />
				{DEBUG_MODE && (
					<DebugOverlay map={map} cameraX={cameraX} cameraY={cameraY} />
				)}
			</pixiContainer>

			{/* UI Overlay - FPS Counter and Renderer Info */}
			<FPSCounter />
			<Text text={`Renderer: ${app.renderer.type}`} x={10} y={50} bold border />

			{/* Back button in upper right corner */}
			<layoutContainer
				layout={{
					position: 'absolute',
					top: 10,
					right: 10,
				}}
			>
				<UIButton
					text='Volver al Login'
					onClick={handleBackClick}
					width={140}
					height={32}
				/>
			</layoutContainer>
		</pixiContainer>
	)
}
