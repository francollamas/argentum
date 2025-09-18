import { extend } from '@pixi/react'
import { Text } from 'pixi.js'
import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useFPS } from '../../hooks/useFPS'

extend({ Text })

export const FPSCounter: FC = () => {
	const fps = useFPS()

	return (
		<pixiText
			text={`FPS: ${fps}`}
			x={GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH - 70}
			y={5}
			style={{
				fontFamily: 'Arial',
				fontSize: 16,
				fill: 0xffffff,
				stroke: {
					color: 0x000000,
					width: 2,
				},
			}}
		/>
	)
}