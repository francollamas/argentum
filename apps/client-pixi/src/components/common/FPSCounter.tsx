import type { FC } from 'react'
import { useFPS } from '../../hooks/useFPS'
import { Label } from '../ui'

export const FPSCounter: FC = () => {
	const fps = useFPS()

	return (
		<layoutContainer
			layout={{
				width: '100%',
				justifyContent: 'flex-start',
				alignItems: 'flex-end',
				paddingTop: 5,
				paddingRight: 8,
			}}
		>
			<Label text={`FPS: ${fps}`} font='labelSm' />
		</layoutContainer>
	)
}
