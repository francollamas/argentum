import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { ContentFrame, UIScreen } from '../layout'
import { Colors } from '../ui'
import { ButtonDemoScreen } from './demos/ButtonDemoScreen'
import { GameMapDemoScreen } from './demos/GameMapDemoScreen'
import { LabelDemoScreen } from './demos/LabelDemoScreen'

type DemoScreen = {
	label: string
	component: FC | null
	enabled?: boolean
}

const DEMOS: DemoScreen[] = [
	{ label: 'Label', component: LabelDemoScreen },
	{ label: 'Map + HUD', component: null, enabled: true },
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

	if (activeDemo === 'Map + HUD') {
		return <GameMapDemoScreen onBack={() => setActiveDemo(null)} />
	}

	return (
		<UIScreen>
			<layoutContainer
				layout={{
					...tw`w-full h-full`,
					backgroundColor: Colors.backgroundDark,
				}}
			/>
			{ActiveComponent ? (
				<ContentFrame>
					<layoutContainer
						layout={{
							...tw`w-full h-full flex-col`,
							padding: 48,
						}}
					>
						<layoutContainer layout={tw`flex-row items-center justify-between`}>
							<pixiBitmapText
								text={activeEntry?.label ?? 'Demo'}
								style={{
									fontFamily: 'medievalsharp-regular',
									fontSize: 36,
									fill: Colors.gold,
								}}
								layout={{ width: 'intrinsic', height: 'intrinsic' }}
							/>
							<layoutContainer
								layout={{
									...tw`items-center justify-center`,
									width: 120,
									height: 36,
									backgroundColor: Colors.woodMid,
									borderRadius: 4,
								}}
								eventMode='static'
								cursor='pointer'
								onPointerDown={() => setActiveDemo(null)}
							>
								<pixiBitmapText
									text='Back'
									style={{
										fontFamily: 'crimsomtext-regular',
										fontSize: 16,
										fill: 0xffffff,
									}}
									layout={{ width: 'intrinsic', height: 'intrinsic' }}
								/>
							</layoutContainer>
						</layoutContainer>
						<layoutContainer layout={{ ...tw`w-full`, flex: 1 }}>
							<ActiveComponent />
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
						<pixiBitmapText
							text='UI Component Demos'
							style={{
								fontFamily: 'medievalsharp-regular',
								fontSize: 44,
								fill: Colors.gold,
							}}
							layout={{ width: 'intrinsic', height: 'intrinsic' }}
						/>
						<pixiBitmapText
							text='Select a component to test'
							style={{
								fontFamily: 'crimsomtext-regular',
								fontSize: 20,
								fill: Colors.silver,
							}}
							layout={{ width: 'intrinsic', height: 'intrinsic' }}
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
								<layoutContainer
									key={demo.label}
									layout={{
										...tw`items-center justify-center`,
										width: 180,
										height: 40,
										backgroundColor:
											demo.component || demo.enabled
												? Colors.woodMid
												: Colors.backgroundMid,
										borderRadius: 4,
									}}
									eventMode='static'
									cursor={
										demo.component || demo.enabled ? 'pointer' : 'default'
									}
									onPointerDown={() => {
										if (demo.component || demo.enabled) {
											setActiveDemo(demo.label)
										}
									}}
								>
									<pixiBitmapText
										text={demo.label}
										style={{
											fontFamily: 'crimsomtext-regular',
											fontSize: 16,
											fill:
												demo.component || demo.enabled ? 0xffffff : 0x666666,
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
				</ContentFrame>
			)}
		</UIScreen>
	)
}
