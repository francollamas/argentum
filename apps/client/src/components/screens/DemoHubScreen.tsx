import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { ContentFrame, UIScreen } from '../layout'
import { Button, Colors, Label } from '../ui'
import { ButtonDemoScreen } from './demos/ButtonDemoScreen'
import { CheckBoxDemoScreen } from './demos/CheckBoxDemoScreen'
import { GameMapDemoScreen } from './demos/GameMapDemoScreen'
import { InputDemoScreen } from './demos/InputDemoScreen'
import { LabelDemoScreen } from './demos/LabelDemoScreen'
import { PanelDemoScreen } from './demos/PanelDemoScreen'
import { ProgressBarDemoScreen } from './demos/ProgressBarDemoScreen'
import { RadioGroupDemoScreen } from './demos/RadioGroupDemoScreen'
import { SwitchDemoScreen } from './demos/SwitchDemoScreen'

type FramedDemoProps = {
	onBack: () => void
}

type DemoDefinition = {
	id: string
	label: string
	presentation: 'framed' | 'fullscreen'
	render?: FC<FramedDemoProps>
}

const LabelDemoRoute: FC<FramedDemoProps> = () => <LabelDemoScreen />
const ButtonDemoRoute: FC<FramedDemoProps> = () => <ButtonDemoScreen />
const PanelDemoRoute: FC<FramedDemoProps> = () => <PanelDemoScreen />
const CheckBoxDemoRoute: FC<FramedDemoProps> = () => <CheckBoxDemoScreen />
const SwitchDemoRoute: FC<FramedDemoProps> = () => <SwitchDemoScreen />
const RadioGroupDemoRoute: FC<FramedDemoProps> = () => <RadioGroupDemoScreen />
const ProgressBarDemoRoute: FC<FramedDemoProps> = () => (
	<ProgressBarDemoScreen />
)
const InputDemoRoute: FC<FramedDemoProps> = () => <InputDemoScreen />

const DEMOS: DemoDefinition[] = [
	{
		id: 'label',
		label: 'Label',
		presentation: 'framed',
		render: LabelDemoRoute,
	},
	{
		id: 'map-hud',
		label: 'Map + HUD',
		presentation: 'fullscreen',
		render: GameMapDemoScreen,
	},
	{
		id: 'panel',
		label: 'Panel',
		presentation: 'framed',
		render: PanelDemoRoute,
	},
	{
		id: 'button',
		label: 'Button',
		presentation: 'framed',
		render: ButtonDemoRoute,
	},
	{
		id: 'checkbox',
		label: 'CheckBox',
		presentation: 'framed',
		render: CheckBoxDemoRoute,
	},
	{
		id: 'switch',
		label: 'Switch',
		presentation: 'framed',
		render: SwitchDemoRoute,
	},
	{
		id: 'radiogroup',
		label: 'RadioGroup',
		presentation: 'framed',
		render: RadioGroupDemoRoute,
	},
	{
		id: 'progressbar',
		label: 'ProgressBar',
		presentation: 'framed',
		render: ProgressBarDemoRoute,
	},
	{
		id: 'input',
		label: 'Input',
		presentation: 'framed',
		render: InputDemoRoute,
	},
	{ id: 'divider', label: 'Divider', presentation: 'framed' },
	{ id: 'slider', label: 'Slider', presentation: 'framed' },
	{ id: 'iconbutton', label: 'IconButton', presentation: 'framed' },
	{ id: 'tabbar', label: 'TabBar', presentation: 'framed' },
	{ id: 'scrollview', label: 'ScrollView', presentation: 'framed' },
	{ id: 'dropdown', label: 'Dropdown', presentation: 'framed' },
	{ id: 'tooltip', label: 'Tooltip', presentation: 'framed' },
	{ id: 'dialog', label: 'Dialog', presentation: 'framed' },
	{ id: 'full-integration', label: 'Full Integration', presentation: 'framed' },
]

export const DemoHubScreen: FC = () => {
	const [activeDemoId, setActiveDemoId] = useState<string | null>(null)

	const activeEntry = DEMOS.find((demo) => demo.id === activeDemoId)
	const ActiveDemoScreen = activeEntry?.render

	if (ActiveDemoScreen && activeEntry?.presentation === 'fullscreen') {
		return <ActiveDemoScreen onBack={() => setActiveDemoId(null)} />
	}

	return (
		<UIScreen>
			<layoutContainer
				layout={{
					...tw`w-full h-full`,
					backgroundColor: Colors.backgroundDark,
				}}
			/>
			{ActiveDemoScreen ? (
				<ContentFrame>
					<layoutContainer
						layout={{
							...tw`w-full h-full flex-col`,
							padding: 48,
						}}
					>
						<layoutContainer layout={tw`flex-row items-center justify-between`}>
							<Label
								text={activeEntry?.label ?? 'Demo'}
								font='title'
								color={Colors.gold}
							/>
							<Button
								text='Back'
								variant='small'
								onPress={() => setActiveDemoId(null)}
							/>
						</layoutContainer>
						<layoutContainer layout={tw`w-full flex-1`}>
							<ActiveDemoScreen onBack={() => setActiveDemoId(null)} />
						</layoutContainer>
					</layoutContainer>
				</ContentFrame>
			) : (
				<ContentFrame>
					<layoutContainer
						layout={{
							...tw`w-full h-full flex-col items-center`,
							paddingTop: 96,
							paddingLeft: 120,
							paddingRight: 120,
							gap: 20,
						}}
					>
						<Label
							text='UI Component Demos'
							font='titleLg'
							color={Colors.gold}
						/>
						<Label
							text='Select a component to test'
							font='bodySm'
							color={Colors.silver}
						/>
						<layoutContainer
							layout={{
								...tw`flex-row flex-wrap justify-center`,
								width: 1200,
								gap: 12,
								paddingTop: 24,
							}}
						>
							{DEMOS.map((demo) => (
								<Button
									key={demo.label}
									text={demo.label}
									width={180}
									variant='small'
									disabled={!demo.render}
									onPress={
										demo.render ? () => setActiveDemoId(demo.id) : undefined
									}
								/>
							))}
						</layoutContainer>
						<Label
							text='Disabled buttons mark demos that are not implemented yet'
							font='labelSm'
							color={Colors.silver}
						/>
					</layoutContainer>
				</ContentFrame>
			)}
		</UIScreen>
	)
}
