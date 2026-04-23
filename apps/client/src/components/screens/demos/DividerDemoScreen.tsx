import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { Button, Colors, Divider, Label, Panel } from '../../ui'

export const DividerDemoScreen: FC = () => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='Divider Demo' font='title' color={Colors.gold} />
				<Label
					text='Simple separators that work cleanly in both column and row layouts'
					font='bodySm'
					color={Colors.silver}
					wrap
				/>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row flex-wrap justify-center`,
					gap: 20,
				}}
			>
				<Panel layout={{ width: 420, gap: 14 }}>
					<Label
						text='Horizontal Dividers'
						font='titleSm'
						color={Colors.gold}
					/>
					<Label
						text='Stacked sections stay readable without adding manual margins between each block.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<Label
						text='Character Overview'
						font='label'
						color={Colors.metalHighlight}
					/>
					<Divider />
					<Label text='Class: Warrior' font='bodySm' color={Colors.silver} />
					<Divider thickness={3} />
					<Label text='Level: 27' font='bodySm' color={Colors.silver} />
					<Divider />
					<Label
						text='Guild: Guardians of Nix'
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>

				<Panel
					layout={{
						...tw`flex-row items-stretch`,
						width: 520,
						gap: 12,
						height: 110,
					}}
				>
					<layoutContainer
						layout={{
							...tw`flex-col justify-center`,
							flex: 1,
							minWidth: 0,
							gap: 6,
						}}
					>
						<Label
							text='Vertical Dividers'
							font='titleSm'
							color={Colors.gold}
						/>
						<Label
							text='Useful for inline stats, toolbars, and compact HUD rows.'
							font='bodySm'
							color={Colors.silver}
							wrap
						/>
					</layoutContainer>
					<Divider direction='vertical' />
					<layoutContainer
						layout={tw`flex-col justify-center items-center gap-1`}
					>
						<Label text='STR' font='label' color={Colors.metalHighlight} />
						<Label text='18' font='body' color={Colors.silver} />
					</layoutContainer>
					<Divider direction='vertical' thickness={3} />
					<layoutContainer
						layout={tw`flex-col justify-center items-center gap-1`}
					>
						<Label text='AGI' font='label' color={Colors.metalHighlight} />
						<Label text='14' font='body' color={Colors.silver} />
					</layoutContainer>
					<Divider direction='vertical' />
					<Button text='Equip' variant='small' onPress={() => {}} />
				</Panel>

				<Panel layout={{ width: 420, gap: 14 }}>
					<Label text='Variants' font='titleSm' color={Colors.gold} />
					<Label
						text='Thickness and color stay controlled by props while the parent layout defines spacing.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<Label
						text='Default horizontal'
						font='labelSm'
						color={Colors.silver}
					/>
					<Divider />
					<Label text='Heavy horizontal' font='labelSm' color={Colors.silver} />
					<Divider thickness={3} />
					<layoutContainer
						layout={{
							...tw`flex-row items-stretch justify-center`,
							gap: 10,
							height: 54,
						}}
					>
						<Label text='HP' font='label' color={Colors.silver} />
						<Divider direction='vertical' thickness={2} />
						<Label text='MP' font='label' color={Colors.silver} />
						<Divider direction='vertical' thickness={3} />
						<Label text='STA' font='label' color={Colors.silver} />
					</layoutContainer>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
