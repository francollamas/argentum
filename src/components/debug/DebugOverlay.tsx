import { extend } from '@pixi/react'
import { Container, Graphics, Text } from 'pixi.js'
import type { FC, JSX } from 'react'
import { useMemo } from 'react'
import { DEBUG_CONFIG } from '../../config/debug'
import { GAME_CONSTANTS } from '../../constants/game'
import { useAppSelector } from '../../store/hooks'
import type { GameMap } from '../../types/map'

extend({ Container, Graphics, Text })

type DebugOverlayProps = {
	map: GameMap
	cameraX: number
	cameraY: number
}

export const DebugOverlay: FC<DebugOverlayProps> = ({
	map,
	cameraX,
	cameraY,
}) => {
	// Get player position from Redux store
	const playerPosition = useAppSelector((state) => state.player.position)
	const playerTileX = playerPosition.tileX
	const playerTileY = playerPosition.tileY

	// Calculate visible tile bounds
	const viewportLeft = -cameraX
	const viewportTop = -cameraY
	const viewportRight = viewportLeft + GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH
	const viewportBottom = viewportTop + GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT

	const startX = Math.max(
		0,
		Math.floor(viewportLeft / GAME_CONSTANTS.TILE_SIZE) - 2,
	)
	const endX = Math.min(
		map.width - 1,
		Math.floor(viewportRight / GAME_CONSTANTS.TILE_SIZE) + 2,
	)
	const startY = Math.max(
		0,
		Math.floor(viewportTop / GAME_CONSTANTS.TILE_SIZE) - 2,
	)
	const endY = Math.min(
		map.height - 1,
		Math.floor(viewportBottom / GAME_CONSTANTS.TILE_SIZE) + 2,
	)

	// Memoize debug elements for performance
	const debugElements = useMemo(() => {
		const elements: JSX.Element[] = []

		// Render debug info for each visible tile
		for (let y = startY; y <= endY; y++) {
			for (let x = startX; x <= endX; x++) {
				const tile = map.tiles[x][y]
				const tileX = x * GAME_CONSTANTS.TILE_SIZE
				const tileY = y * GAME_CONSTANTS.TILE_SIZE
				const worldTileX = x + map.bounds.minX
				const worldTileY = y + map.bounds.minY

				// 1. Player position indicator (red square outline, transparent inside)
				if (
					DEBUG_CONFIG.showPlayerPosition &&
					worldTileX === playerTileX &&
					worldTileY === playerTileY
				) {
					elements.push(
						<pixiGraphics
							key={`player-${x}-${y}`}
							x={tileX}
							y={tileY}
							draw={(g) => {
								g.clear()
								// Draw thick yellow border for player position (more visible)
								g.stroke({ color: 0xffff00, width: 4 })
								g.rect(0, 0, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE)
								// Add inner border for better visibility
								g.stroke({ color: 0xffff00, width: 2 })
								g.rect(2, 2, GAME_CONSTANTS.TILE_SIZE - 4, GAME_CONSTANTS.TILE_SIZE - 4)
							}}
						/>,
					)
				}

				// 2. Blocked tiles indicator (red semi-transparent overlay + X)
				if (DEBUG_CONFIG.showBlockedTiles && tile?.isBlocked) {
					elements.push(
						<pixiGraphics
							key={`blocked-${x}-${y}`}
							x={tileX}
							y={tileY}
							draw={(g) => {
								g.clear()
								// Fill with semi-transparent red
								g.fill({ color: 0xff0000, alpha: 0.3 })
								g.rect(0, 0, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE)
								// Draw thick red X on top
								g.stroke({ color: 0xff0000, width: 3 })
								g.moveTo(2, 2)
								g.lineTo(
									GAME_CONSTANTS.TILE_SIZE - 2,
									GAME_CONSTANTS.TILE_SIZE - 2,
								)
								g.moveTo(GAME_CONSTANTS.TILE_SIZE - 2, 2)
								g.lineTo(2, GAME_CONSTANTS.TILE_SIZE - 2)
							}}
						/>,
					)
				}

				// 3. Trigger number display (optimized with simpler style)
				if (
					DEBUG_CONFIG.showTriggerNumbers &&
					tile?.trigger !== null &&
					tile?.trigger !== undefined
				) {
					elements.push(
						<pixiText
							key={`trigger-${x}-${y}`}
							text={tile.trigger.toString()}
							x={tileX + GAME_CONSTANTS.TILE_SIZE / 2}
							y={tileY + 4}
							anchor={0.5}
							style={{
								fontFamily: 'Arial',
								fontSize: 9,
								fill: 0xffffff,
								stroke: { color: 0x000000, width: 1 },
							}}
						/>,
					)
				}
			}
		}

		return elements
	}, [startX, endX, startY, endY, playerTileX, playerTileY, map.tiles])

	return (
		<pixiContainer>
			{debugElements}
			{/* Player coordinates display (top-left corner, fixed position) */}
			{DEBUG_CONFIG.showPlayerPosition && (
				<pixiText
					key='player-coords'
					text={`[${playerTileX.toString().padStart(2, '0')} ; ${playerTileY
						.toString()
						.padStart(2, '0')}]`}
					x={10 - cameraX}
					y={10 - cameraY}
					style={{
						fontFamily: 'Arial',
						fontSize: 16,
						fill: 0xffffff,
						stroke: { color: 0x000000, width: 3 },
					}}
				/>
			)}
		</pixiContainer>
	)
}
