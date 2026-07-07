import type { FC } from 'react'
import { DEBUG_CONFIG } from '../../config/debug'
import { useDebugVisibleTiles } from '../../hooks/useDebugVisibleTiles'
import { usePlayerPosition } from '../../hooks/usePlayer'
import type { GameMap } from '../../types/map'
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
			{visibleTiles.map((tile) => {
				const isPlayerTile =
					tile.worldTileX === playerTileX && tile.worldTileY === playerTileY
				const key = `${tile.arrayX}-${tile.arrayY}`

				return (
					<pixiContainer key={key}>
						{DEBUG_CONFIG.showPlayerPosition && isPlayerTile && (
							<PlayerPositionIndicator
								pixelX={tile.pixelX}
								pixelY={tile.pixelY}
							/>
						)}

						{DEBUG_CONFIG.showBlockedTiles && tile.isBlocked && (
							<BlockedTileIndicator pixelX={tile.pixelX} pixelY={tile.pixelY} />
						)}

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
		</pixiContainer>
	)
}
