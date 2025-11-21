import type { FC } from 'react'
import { useState } from 'react'
import { Text } from '../common/Text'
import { Button, CheckBox, Label, Panel, RadioGroup, Switch } from '../ui'

export const MainScreen: FC = () => {
	const [normalChecked, setNormalChecked] = useState(false)
	const [radioChecked, setRadioChecked] = useState(true)
	const [selectedOption, setSelectedOption] = useState(0)
	const [soundEnabled, setSoundEnabled] = useState(true)
	const [musicEnabled, setMusicEnabled] = useState(false)

	const buttons: Array<{
		text: string
		x: number
		y: number
		width: number
		height: number
		variant?: 'normal' | 'small'
	}> = [
		{
			text: 'Small button',
			x: 40,
			y: 60,
			width: 120,
			height: 40,
			variant: 'small',
		},
		{
			text: 'Wide button',
			x: 220,
			y: 120,
			width: 800,
			height: 60,
			variant: 'normal',
		},
		{
			text: 'Tall button',
			x: 520,
			y: 80,
			width: 140,
			height: 100,
			variant: 'normal',
		},
		{
			text: 'Compact bottom-right',
			x: 640,
			y: 320,
			width: 150,
			height: 45,
			variant: 'normal',
		},
	]

	return (
		<>
			<Text text='Welcome to the Game' x={10} y={10} bold />
			<Label text='UI Components Demo' x={10} y={35} font='general' />
			{buttons.map((button) => (
				<Button
					key={button.text}
					text={button.text}
					x={button.x}
					y={button.y}
					width={button.width}
					height={button.height}
					variant={button.variant}
					onPress={() => console.log(`Button pressed: ${button.text}`)}
				/>
			))}

			<Panel x={100} y={300} width={300} height={200}>
				<Button
					text='Button in Panel'
					x={75}
					y={20}
					width={150}
					height={60}
					variant='normal'
					onPress={() => console.log('Panel button pressed')}
				/>

				<CheckBox
					x={30}
					y={100}
					checked={normalChecked}
					onChange={setNormalChecked}
					variant='normal'
					text='Enable feature'
				/>

				<CheckBox
					x={30}
					y={140}
					checked={radioChecked}
					onChange={setRadioChecked}
					variant='radio'
					text='Option A'
				/>
			</Panel>

			<Panel x={450} y={300} width={300} height={250}>
				<RadioGroup
					x={30}
					y={20}
					selectedIndex={selectedOption}
					onChange={setSelectedOption}
					type='vertical'
					items={[
						{ text: 'Warrior' },
						{ text: 'Mage' },
						{ text: 'Archer' },
						{ text: 'Rogue' },
					]}
				/>
			</Panel>

			<Panel x={800} y={300} width={300} height={200}>
				<Switch
					x={30}
					y={30}
					enabled={soundEnabled}
					onChange={setSoundEnabled}
					text='Sound Effects'
				/>

				<Switch
					x={30}
					y={80}
					enabled={musicEnabled}
					onChange={setMusicEnabled}
					text='Background Music'
				/>
			</Panel>
		</>
	)
}
