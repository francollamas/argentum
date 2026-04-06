import type { FC } from 'react'
import { DEBUG_CONFIG } from '../../config/debug'
import { useDebugVisibleTiles } from '../../hooks/useDebugVisibleTiles'
import { usePlayerPosition } from '../../hooks/usePlayer'
import type { GameMap } from '../../types/map'
import { Text } from '../common/Text'
import { BlockedTileIndicator } from './BlockedTileIndicator'
import { PlayerPositionIndicator } from './PlayerPositionIndicator'
import { TriggerNumberDisplay } from './TriggerNumberDisplay'

type DebugOverlayProps = {
	map: GameMap
	cameraX: number
	cameraY: number
}

/**
 * Main debug overlay component that renders debug information
 * for the visible tiles and player position
 */
export const DebugOverlay: FC<DebugOverlayProps> = ({
	map,
	cameraX,
	cameraY,
}) => {
	const { tileX: playerTileX, tileY: playerTileY } = usePlayerPosition()
	const visibleTiles = useDebugVisibleTiles(cameraX, cameraY, map)

	return (
		<pixiContainer>
			{/* Render debug visualizations for each visible tile */}
			{visibleTiles.map((tile) => {
				const isPlayerTile =
					tile.worldTileX === playerTileX && tile.worldTileY === playerTileY
				const key = `${tile.arrayX}-${tile.arrayY}`

				return (
					<pixiContainer key={key}>
						{/* Player position indicator */}
						{DEBUG_CONFIG.showPlayerPosition && isPlayerTile && (
							<PlayerPositionIndicator
								pixelX={tile.pixelX}
								pixelY={tile.pixelY}
							/>
						)}

						{/* Blocked tiles indicator */}
						{DEBUG_CONFIG.showBlockedTiles && tile.isBlocked && (
							<BlockedTileIndicator pixelX={tile.pixelX} pixelY={tile.pixelY} />
						)}

						{/* Trigger number display */}
						{DEBUG_CONFIG.showTriggerNumbers &&
							tile.trigger !== null &&
							tile.trigger !== undefined && (
								<TriggerNumberDisplay
									trigger={tile.trigger}
									pixelX={tile.pixelX}
									pixelY={tile.pixelY}
								/>
							)}
					</pixiContainer>
				)
			})}

			{/* Player coordinates display (top-left corner, fixed position) */}
			{DEBUG_CONFIG.showPlayerPosition && (
				<Text
					text={`[${playerTileX.toString().padStart(2, '0')} ; ${playerTileY
						.toString()
						.padStart(2, '0')}]`}
					x={10 - cameraX}
					y={10 - cameraY}
					bold
					border
				/>
			)}
		</pixiContainer>
	)
}
