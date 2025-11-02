import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'

extend({ Graphics })

type BlockedTileIndicatorProps = {
	pixelX: number
	pixelY: number
}

/**
 * Renders a red overlay with X to indicate blocked tiles
 */
export const BlockedTileIndicator: FC<BlockedTileIndicatorProps> = ({
	pixelX,
	pixelY,
}) => {
	return (
		<pixiGraphics
			x={pixelX}
			y={pixelY}
			draw={(g) => {
				g.clear()
				// Fill with semi-transparent red
				g.fill({ color: 0xff0000, alpha: 0.3 })
				g.rect(0, 0, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE)
				// Draw thick red X on top
				g.stroke({ color: 0xff0000, width: 3 })
				g.moveTo(2, 2)
				g.lineTo(GAME_CONSTANTS.TILE_SIZE - 2, GAME_CONSTANTS.TILE_SIZE - 2)
				g.moveTo(GAME_CONSTANTS.TILE_SIZE - 2, 2)
				g.lineTo(2, GAME_CONSTANTS.TILE_SIZE - 2)
			}}
		/>
	)
}
