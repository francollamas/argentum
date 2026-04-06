import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors } from '../ui'
import { ButtonDemoScreen } from './demos/ButtonDemoScreen'
import { LabelDemoScreen } from './demos/LabelDemoScreen'

type DemoScreen = {
	label: string
	component: FC | null
}

const DEMOS: DemoScreen[] = [
	{ label: 'Label', component: LabelDemoScreen },
	{ label: 'Panel', component: null },
	{ label: 'Button', component: ButtonDemoScreen },
	{ label: 'CheckBox', component: null },
	{ label: 'Switch', component: null },
	{ label: 'RadioGroup', component: null },
	{ label: 'ProgressBar', component: null },
	{ label: 'Input', component: null },
	{ label: 'Divider', component: null },
	{ label: 'Slider', component: null },
	{ label: 'IconButton', component: null },
	{ label: 'TabBar', component: null },
	{ label: 'ScrollView', component: null },
	{ label: 'Dropdown', component: null },
	{ label: 'Tooltip', component: null },
	{ label: 'Dialog', component: null },
	{ label: 'Full Integration', component: null },
]

export const DemoHubScreen: FC = () => {
	const [activeDemo, setActiveDemo] = useState<string | null>(null)

	const activeEntry = DEMOS.find((d) => d.label === activeDemo)
	const ActiveComponent = activeEntry?.component

	if (ActiveComponent) {
		return <ActiveComponent />
	}

	return (
		<layoutContainer
			layout={{
				...tw`flex-col items-center gap-3`,
				width: '100%',
				height: '100%',
				backgroundColor: Colors.backgroundDark,
				paddingTop: 40,
			}}
		>
			<pixiBitmapText
				text='UI Component Demos'
				style={{
					fontFamily: 'opensans-regular',
					fontSize: 36,
					fill: Colors.gold,
				}}
				layout={{ width: 'intrinsic', height: 'intrinsic' }}
			/>
			<pixiBitmapText
				text='Select a component to test'
				style={{
					fontFamily: 'crimsomtext-regular',
					fontSize: 18,
					fill: Colors.silver,
				}}
				layout={{ width: 'intrinsic', height: 'intrinsic' }}
			/>
			<layoutContainer
				layout={{
					...tw`flex-row flex-wrap justify-center gap-2`,
					width: '80%',
					paddingTop: 20,
				}}
			>
				{DEMOS.map((demo) => (
					<layoutContainer
						key={demo.label}
						layout={{
							...tw`items-center justify-center`,
							width: 160,
							height: 36,
							backgroundColor: demo.component
								? Colors.woodMid
								: Colors.backgroundMid,
							borderRadius: 4,
						}}
						eventMode='static'
						cursor={demo.component ? 'pointer' : 'default'}
						onPointerDown={() => {
							if (demo.component) {
								setActiveDemo(demo.label)
							}
						}}
					>
						<pixiBitmapText
							text={demo.label}
							style={{
								fontFamily: 'crimsomtext-regular',
								fontSize: 16,
								fill: demo.component ? 0xffffff : 0x666666,
							}}
							layout={{ width: 'intrinsic', height: 'intrinsic' }}
						/>
					</layoutContainer>
				))}
			</layoutContainer>
			<pixiBitmapText
				text='Gray buttons = not yet implemented'
				style={{
					fontFamily: 'crimsomtext-regular',
					fontSize: 14,
					fill: 0x666666,
				}}
				layout={{ width: 'intrinsic', height: 'intrinsic' }}
			/>
		</layoutContainer>
	)
}
