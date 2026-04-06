import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'

type PlayerPositionIndicatorProps = {
	pixelX: number
	pixelY: number
}

/**
 * Renders a yellow border to indicate the player's current position
 */
export const PlayerPositionIndicator: FC<PlayerPositionIndicatorProps> = ({
	pixelX,
	pixelY,
}) => {
	return (
		<pixiGraphics
			x={pixelX}
			y={pixelY}
			draw={(g) => {
				g.clear()
				// Draw thick yellow border for player position (more visible)
				g.stroke({ color: 0xffff00, width: 4 })
				g.rect(0, 0, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE)
				// Add inner border for better visibility
				g.stroke({ color: 0xffff00, width: 2 })
				g.rect(2, 2, GAME_CONSTANTS.TILE_SIZE - 4, GAME_CONSTANTS.TILE_SIZE - 4)
			}}
		/>
	)
}
