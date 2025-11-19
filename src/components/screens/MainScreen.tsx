import type { FC } from 'react'
import { Text } from '../common/Text'
import { Button } from '../ui'

export const MainScreen: FC = () => {
	return (
		<>
			<Text text="Welcome to the Game" x={10} y={10} bold />
			<Button
				text="Click me!"
				x={100}
				y={100}
				/* width={200}
				height={60} */
				/* nineSliceBorders={[10, 10, 10, 10]} */
				onPress={() => console.log('Button pressed!')}
			/>
		</>
	)
}
