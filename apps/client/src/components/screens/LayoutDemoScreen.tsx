import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Button, Label } from '../ui'

export const LayoutDemoScreen: FC = () => {
	const [clickCount, setClickCount] = useState(0)

	return (
		<layoutContainer
			layout={{
				width: '100%',
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 0x1a1a2e,
			}}
		>
			<layoutContainer
				layout={{
					width: '80%',
					height: '85%',
					maxWidth: 600,
					maxHeight: 500,
					backgroundColor: 0x16213e,
					borderRadius: 16,
					padding: 30,
					flexDirection: 'column',
					gap: 20,
					alignItems: 'center',
					overflow: 'hidden',
				}}
			>
				<Label text='PixiJS Layout Demo' font='general' color={0xf0f0f0} />

				<Label
					text='Flexbox Container Example'
					font='general'
					color={0xa0a0a0}
				/>

				<layoutContainer
					layout={tw`flex flex-col gap-15 items-center`}
					/* layout={{
					flexDirection: 'column',
					gap: 15,
					alignItems: 'center',
					marginTop: 20,
				}} */
				>
					<Label
						text={`Button Clicks: ${clickCount}`}
						font='general'
						color={0xffd700}
					/>

					<layoutContainer
						layout={{
							flexDirection: 'row',
							gap: 15,
							marginTop: 10,
						}}
					>
						<Button
							text='Click Me!'
							width={120}
							height={40}
							variant='normal'
							onPress={() => setClickCount(clickCount + 1)}
						/>

						<Button
							text='Reset'
							width={120}
							height={40}
							variant='normal'
							onPress={() => setClickCount(0)}
						/>
					</layoutContainer>

					<layoutContainer
						layout={{
							flexDirection: 'column',
							gap: 10,
							marginTop: 20,
							alignItems: 'center',
						}}
					>
						<Label
							text='Vertical Layout Example'
							font='general'
							color={0xe94560}
						/>

						<Button
							text='Button 1'
							width={200}
							height={35}
							variant='small'
							onPress={() => console.log('Button 1 pressed')}
						/>

						<Button
							text='Button 2'
							width={200}
							height={35}
							variant='small'
							onPress={() => console.log('Button 2 pressed')}
						/>

						<Button
							text='Button 3'
							width={200}
							height={35}
							variant='small'
							onPress={() => console.log('Button 3 pressed')}
						/>
					</layoutContainer>
				</layoutContainer>
			</layoutContainer>
		</layoutContainer>
	)
}
