import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { Text } from '../common/Text'

type TriggerNumberDisplayProps = {
	trigger: number
	pixelX: number
	pixelY: number
}

/**
 * Renders the trigger number on a tile
 */
export const TriggerNumberDisplay: FC<TriggerNumberDisplayProps> = ({
	trigger,
	pixelX,
	pixelY,
}) => {
	return (
		<Text
			text={trigger.toString()}
			x={pixelX + GAME_CONSTANTS.TILE_SIZE / 2}
			y={pixelY + 4}
			bold
			border
		/>
	)
}
