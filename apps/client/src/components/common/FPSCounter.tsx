import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useFPS } from '../../hooks/useFPS'
import { Text } from '../common/Text'

export const FPSCounter: FC = () => {
	const fps = useFPS()

	return (
		<Text
			text={`FPS: ${fps}`}
			x={GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH - 70}
			y={5}
			bold
			border
		/>
	)
}
