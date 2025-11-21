import type { FC } from 'react'
import { Text } from '../common/Text'
import { Button } from '../ui'

export const MainScreen: FC = () => {
	const buttons = [
		{
			text: 'Small button',
			x: 40,
			y: 60,
			width: 120,
			height: 40,
		},
		{
			text: 'Wide button',
			x: 220,
			y: 120,
			width: 800,
			height: 60,
		},
		{
			text: 'Tall button',
			x: 520,
			y: 80,
			width: 140,
			height: 100,
		},
		{
			text: 'Compact bottom-right',
			x: 640,
			y: 320,
			width: 150,
			height: 45,
		},
	]

	return (
		<>
			<Text text="Welcome to the Game" x={10} y={10} bold />
			{buttons.map((button) => (
				<Button
					key={button.text}
					text={button.text}
					x={button.x}
					y={button.y}
					width={button.width}
					height={button.height}
					onPress={() => console.log(`Button pressed: ${button.text}`)}
				/>
			))}
		</>
	)
}
