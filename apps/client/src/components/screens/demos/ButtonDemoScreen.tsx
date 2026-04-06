import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { Button, Colors, Label } from '../../ui'

export const ButtonDemoScreen: FC = () => {
	return (
		<layoutContainer
			layout={{
				...tw`flex-col items-center justify-center`,
				width: '100%',
				height: '100%',
				backgroundColor: Colors.backgroundDark,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-start gap-6`}>
				{/* Header */}
				<layoutContainer layout={tw`flex-col items-center self-stretch gap-1`}>
					<Label text='Button Demo' font='title' color={Colors.gold} />
					<Label
						text='All variants, sizes, and states'
						font='bodySm'
						color={Colors.silver}
					/>
				</layoutContainer>

				{/* Variants */}
				<layoutContainer layout={tw`flex-col gap-3`}>
					<Label text='Variants' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`flex-row items-center gap-4`}>
						<Button
							text='Normal'
							onPress={() => console.log('Normal pressed')}
						/>
						<Button
							text='Small'
							variant='small'
							onPress={() => console.log('Small pressed')}
						/>
					</layoutContainer>
				</layoutContainer>

				{/* Text lengths */}
				<layoutContainer layout={tw`flex-col gap-3`}>
					<Label text='Text Lengths' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`flex-row items-center gap-4`}>
						<Button text='OK' onPress={() => {}} />
						<Button text='Conectar' onPress={() => {}} />
						<Button text='Crear Personaje' onPress={() => {}} />
					</layoutContainer>
				</layoutContainer>

				{/* Explicit width */}
				<layoutContainer layout={tw`flex-col gap-3`}>
					<Label text='Explicit Width' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`flex-row items-center gap-4`}>
						<Button text='Wide' width={200} onPress={() => {}} />
						<Button
							text='Small Wide'
							variant='small'
							width={200}
							onPress={() => {}}
						/>
					</layoutContainer>
				</layoutContainer>

				{/* Disabled state */}
				<layoutContainer layout={tw`flex-col gap-3`}>
					<Label text='Disabled State' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`flex-row items-center gap-4`}>
						<Button text='Disabled' disabled />
						<Button text='Enabled' onPress={() => {}} />
					</layoutContainer>
				</layoutContainer>

				{/* Row of buttons */}
				<layoutContainer layout={tw`flex-col gap-3`}>
					<Label text='Row of Buttons' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`flex-row items-center gap-2`}>
						<Button text='Guerrero' variant='small' onPress={() => {}} />
						<Button text='Mago' variant='small' onPress={() => {}} />
						<Button text='Arquero' variant='small' onPress={() => {}} />
						<Button text='Paladin' variant='small' onPress={() => {}} />
					</layoutContainer>
				</layoutContainer>
			</layoutContainer>
		</layoutContainer>
	)
}
