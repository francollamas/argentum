import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { ContentFrame, UIScreen } from '../layout'
import { Button, Colors, Label } from '../ui'
import { ArrowButtonDemoScreen } from './demos/ArrowButtonDemoScreen'
import { ArrowSelectorDemoScreen } from './demos/ArrowSelectorDemoScreen'
import { ButtonDemoScreen } from './demos/ButtonDemoScreen'
import { CheckBoxDemoScreen } from './demos/CheckBoxDemoScreen'
import { CloseButtonDemoScreen } from './demos/CloseButtonDemoScreen'
import { DividerDemoScreen } from './demos/DividerDemoScreen'
import { GameMapDemoScreen } from './demos/GameMapDemoScreen'
import { IconButtonDemoScreen } from './demos/IconButtonDemoScreen'
import { InputDemoScreen } from './demos/InputDemoScreen'
import { LabelDemoScreen } from './demos/LabelDemoScreen'
import { ListDemoScreen } from './demos/ListDemoScreen'
import { PanelDemoScreen } from './demos/PanelDemoScreen'
import { ProgressBarDemoScreen } from './demos/ProgressBarDemoScreen'
import { RadioGroupDemoScreen } from './demos/RadioGroupDemoScreen'
import { ScrollViewDemoScreen } from './demos/ScrollViewDemoScreen'
import { SliderDemoScreen } from './demos/SliderDemoScreen'
import { SwitchDemoScreen } from './demos/SwitchDemoScreen'
import { TabBarDemoScreen } from './demos/TabBarDemoScreen'
import { TextAreaDemoScreen } from './demos/TextAreaDemoScreen'
import { TooltipDemoScreen } from './demos/TooltipDemoScreen'

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
const ArrowButtonDemoRoute: FC<FramedDemoProps> = () => (
	<ArrowButtonDemoScreen />
)
const ArrowSelectorDemoRoute: FC<FramedDemoProps> = () => (
	<ArrowSelectorDemoScreen />
)
const ButtonDemoRoute: FC<FramedDemoProps> = () => <ButtonDemoScreen />
const CloseButtonDemoRoute: FC<FramedDemoProps> = () => (
	<CloseButtonDemoScreen />
)
const PanelDemoRoute: FC<FramedDemoProps> = () => <PanelDemoScreen />
const CheckBoxDemoRoute: FC<FramedDemoProps> = () => <CheckBoxDemoScreen />
const SwitchDemoRoute: FC<FramedDemoProps> = () => <SwitchDemoScreen />
const RadioGroupDemoRoute: FC<FramedDemoProps> = () => <RadioGroupDemoScreen />
const ProgressBarDemoRoute: FC<FramedDemoProps> = () => (
	<ProgressBarDemoScreen />
)
const InputDemoRoute: FC<FramedDemoProps> = () => <InputDemoScreen />
const ListDemoRoute: FC<FramedDemoProps> = () => <ListDemoScreen />
const IconButtonDemoRoute: FC<FramedDemoProps> = () => <IconButtonDemoScreen />
const ScrollViewDemoRoute: FC<FramedDemoProps> = () => <ScrollViewDemoScreen />
const TextAreaDemoRoute: FC<FramedDemoProps> = () => <TextAreaDemoScreen />
const DividerDemoRoute: FC<FramedDemoProps> = () => <DividerDemoScreen />
const SliderDemoRoute: FC<FramedDemoProps> = () => <SliderDemoScreen />
const TabBarDemoRoute: FC<FramedDemoProps> = () => <TabBarDemoScreen />
const TooltipDemoRoute: FC<FramedDemoProps> = () => <TooltipDemoScreen />

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
		id: 'arrowbutton',
		label: 'ArrowButton',
		presentation: 'framed',
		render: ArrowButtonDemoRoute,
	},
	{
		id: 'arrowselector',
		label: 'ArrowSelector',
		presentation: 'framed',
		render: ArrowSelectorDemoRoute,
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
		id: 'closebutton',
		label: 'CloseButton',
		presentation: 'framed',
		render: CloseButtonDemoRoute,
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
	{
		id: 'textarea',
		label: 'TextArea',
		presentation: 'framed',
		render: TextAreaDemoRoute,
	},
	{
		id: 'list',
		label: 'List',
		presentation: 'framed',
		render: ListDemoRoute,
	},
	{
		id: 'divider',
		label: 'Divider',
		presentation: 'framed',
		render: DividerDemoRoute,
	},
	{
		id: 'slider',
		label: 'Slider',
		presentation: 'framed',
		render: SliderDemoRoute,
	},
	{
		id: 'iconbutton',
		label: 'IconButton',
		presentation: 'framed',
		render: IconButtonDemoRoute,
	},
	{
		id: 'tabbar',
		label: 'TabBar',
		presentation: 'framed',
		render: TabBarDemoRoute,
	},
	{
		id: 'scrollview',
		label: 'ScrollView',
		presentation: 'framed',
		render: ScrollViewDemoRoute,
	},
	{
		id: 'tooltip',
		label: 'Tooltip',
		presentation: 'framed',
		render: TooltipDemoRoute,
	},
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
							...tw`w-full h-full flex-col items-center justify-center`,
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
