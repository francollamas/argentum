import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import type { FontType } from '../../../config/typography'
import { Colors, Label } from '../../ui'

const FONT_VARIANTS: FontType[] = [
	'titleLg',
	'title',
	'titleSm',
	'body',
	'bodySm',
	'label',
	'labelSm',
	'button',
	'buttonSm',
]

const COLOR_SAMPLES: { name: string; value: number }[] = [
	{ name: 'White', value: 0xffffff },
	{ name: 'Gold', value: Colors.gold },
	{ name: 'Silver', value: Colors.silver },
	{ name: 'Bronze', value: Colors.bronze },
	{ name: 'HP Red', value: Colors.barHp },
	{ name: 'MP Blue', value: Colors.barMp },
	{ name: 'Status OK', value: Colors.statusOk },
	{ name: 'Status Error', value: Colors.statusError },
]

export const LabelDemoScreen: FC = () => {
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
			{/* Centered container with left-aligned content inside */}
			<layoutContainer layout={tw`flex-col items-start gap-6`}>
				{/* Header */}
				<layoutContainer layout={tw`flex-col items-center self-stretch gap-1`}>
					<Label text='Label Demo' font='title' color={Colors.gold} />
					<Label
						text='All font variants and color samples'
						font='bodySm'
						color={Colors.silver}
					/>
				</layoutContainer>

				{/* Font variants section */}
				<layoutContainer layout={tw`flex-col gap-4`}>
					<Label text='Font Variants' font='titleSm' color={Colors.gold} />
					{FONT_VARIANTS.map((variant) => (
						<layoutContainer
							key={variant}
							layout={tw`flex-row items-center gap-3`}
						>
							<Label
								text={variant}
								font='labelSm'
								color={Colors.metalLight}
								layoutStyle={{ width: 80 }}
							/>
							<Label
								text={`The quick brown fox — ${variant}`}
								font={variant}
								color={0xffffff}
							/>
						</layoutContainer>
					))}
				</layoutContainer>

				{/* Color samples section */}
				<layoutContainer layout={tw`flex-col gap-4`}>
					<Label text='Color Samples' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`flex-row flex-wrap items-center gap-4`}>
						{COLOR_SAMPLES.map((sample) => (
							<layoutContainer
								key={sample.name}
								layout={{
									...tw`flex-row gap-2`,
									alignItems: 'baseline',
								}}
							>
								<layoutContainer
									layout={{
										width: 16,
										height: 16,
										minWidth: 16,
										minHeight: 16,
										backgroundColor: sample.value,
										borderRadius: 2,
										flexShrink: 0,
									}}
								/>
								<Label text={sample.name} font='body' color={sample.value} />
							</layoutContainer>
						))}
					</layoutContainer>
				</layoutContainer>

				{/* layoutStyle demo */}
				<Label
					text='layoutStyle demo: alignSelf center'
					font='label'
					color={Colors.metalHighlight}
					layoutStyle={{ alignSelf: 'center' }}
				/>
			</layoutContainer>
		</layoutContainer>
	)
}
