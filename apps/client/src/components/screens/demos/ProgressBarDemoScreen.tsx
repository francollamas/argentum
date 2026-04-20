import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { Colors, Label, Panel, ProgressBar } from '../../ui'

export const ProgressBarDemoScreen: FC = () => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='ProgressBar Demo' font='title' color={Colors.gold} />
				<Label
					text='Each bar renders a label row above a separate progress row'
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
				<Panel layout={{ width: 460, gap: 14 }}>
					<Label text='Amount Overlay' font='titleSm' color={Colors.gold} />
					<Label
						text='Concept and amount live on the top row, with the bar isolated below.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<ProgressBar
						width={400}
						height={24}
						label='HP'
						value={0}
						max={500}
						fillColor={Colors.barHp}
						textVariant='amount'
					/>
					<ProgressBar
						width={400}
						height={24}
						label='MP'
						value={210}
						max={500}
						fillColor={Colors.barMp}
						textVariant='amount'
					/>
					<ProgressBar
						width={400}
						height={24}
						label='STA'
						value={500}
						max={500}
						fillColor={Colors.barStamina}
						textVariant='amount'
					/>
				</Panel>

				<Panel layout={{ width: 460, gap: 14 }}>
					<Label text='Percentage Overlay' font='titleSm' color={Colors.gold} />
					<Label
						text='The fill now stays clipped to the bar width, including at 100%.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<ProgressBar
						width={400}
						height={24}
						label='XP'
						value={42}
						max={100}
						fillColor={Colors.barXp}
						textVariant='percentage'
					/>
					<ProgressBar
						width={400}
						height={24}
						label='CAST'
						value={18}
						max={100}
						fillColor={Colors.barCast}
						textVariant='percentage'
					/>
					<ProgressBar
						width={400}
						height={24}
						label='BUFF'
						value={100}
						max={100}
						fillColor={Colors.barBuff}
						textVariant='percentage'
					/>
				</Panel>

				<Panel layout={{ width: 520, gap: 14 }}>
					<Label text='Panel Composition' font='titleSm' color={Colors.gold} />
					<Label
						text='The widget now behaves predictably inside panels because labels and fill use separate rows.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<layoutContainer layout={{ ...tw`flex-col`, gap: 10 }}>
						<ProgressBar
							width={460}
							height={26}
							label='Vida'
							value={320}
							max={500}
							fillColor={Colors.barHp}
							textVariant='amount'
						/>
						<ProgressBar
							width={460}
							height={26}
							label='Energia'
							value={42}
							max={100}
							fillColor={Colors.barStamina}
							textVariant='percentage'
						/>
					</layoutContainer>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
