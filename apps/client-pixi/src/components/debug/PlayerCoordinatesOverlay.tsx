import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { usePlayerPosition } from '../../hooks/usePlayer'
import { Label } from '../ui'

export const PlayerCoordinatesOverlay: FC = () => {
	const { tileX, tileY } = usePlayerPosition()

	return (
		<layoutContainer
			layout={{
				...tw`w-full`,
				paddingLeft: 10,
				paddingTop: 10,
			}}
		>
			<Label
				text={`[${tileX.toString().padStart(2, '0')} ; ${tileY
					.toString()
					.padStart(2, '0')}]`}
				font='labelSm'
			/>
		</layoutContainer>
	)
}
