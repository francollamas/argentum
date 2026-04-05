import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Button, Colors, Label } from '../ui'

const BUTTON_SIZES = {
	normal: { width: 120, height: 40 },
	small: { width: 200, height: 35 },
}

export const LayoutDemoScreen: FC = () => {
	const [clickCount, setClickCount] = useState(0)

	const handleIncrement = () => setClickCount((prev) => prev + 1)
	const handleReset = () => setClickCount(0)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full justify-center items-center`,
				backgroundColor: Colors.backgroundDark,
			}}
		>
			<layoutContainer
				layout={{
					...tw`w-4/5 max-w-150 p-7 flex-col gap-5 items-center`,
					height: '85%',
					maxHeight: 500,
					backgroundColor: Colors.backgroundPanel,
					borderRadius: 16,
					overflow: 'hidden',
				}}
			>
				<Label
					text='PixiJS Layout Demo'
					font='general'
					color={Colors.backgroundParchment}
				/>

				<Label
					text='Flexbox Container Example'
					font='general'
					color={Colors.silver}
				/>

				<layoutContainer layout={tw`flex-col gap-15 items-center`}>
					<Label
						text={`Button Clicks: ${clickCount}`}
						font='general'
						color={Colors.gold}
					/>

					<layoutContainer layout={tw`flex-row gap-4 mt-3`}>
						<Button
							text='Click Me!'
							{...BUTTON_SIZES.normal}
							variant='normal'
							onPress={handleIncrement}
						/>

						<Button
							text='Reset'
							{...BUTTON_SIZES.normal}
							variant='normal'
							onPress={handleReset}
						/>
					</layoutContainer>

					<layoutContainer layout={tw`flex-col gap-3 mt-5 items-center`}>
						<Label
							text='Vertical Layout Example'
							font='general'
							color={Colors.buttonAlert}
						/>

						<Button
							text='Button 1'
							{...BUTTON_SIZES.small}
							variant='small'
							onPress={() => {}}
						/>

						<Button
							text='Button 2'
							{...BUTTON_SIZES.small}
							variant='small'
							onPress={() => {}}
						/>

						<Button
							text='Button 3'
							{...BUTTON_SIZES.small}
							variant='small'
							onPress={() => {}}
						/>
					</layoutContainer>
				</layoutContainer>
			</layoutContainer>
		</layoutContainer>
	)
}
