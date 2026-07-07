import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { UIScreen } from '../../layout'
import { Button, Colors, Label, Panel, Window, WrappedLabel } from '../../ui'

type WindowDemoScreenProps = {
	onBack: () => void
}

export const WindowDemoScreen: FC<WindowDemoScreenProps> = ({ onBack }) => {
	const [showWindow, setShowWindow] = useState(false)

	return (
		<Window
			visible={showWindow}
			title='Inventory Preview'
			onClose={() => setShowWindow(false)}
			width={620}
			height={420}
			backgroundContent={
				<UIScreen>
					<layoutContainer
						layout={{
							...tw`w-full h-full flex-col`,
							backgroundColor: Colors.backgroundDark,
							padding: 32,
							gap: 24,
						}}
					>
						<layoutContainer
							layout={tw`w-full flex-row items-center justify-between`}
						>
							<layoutContainer layout={tw`flex-col gap-1`}>
								<Label text='Window Demo' font='title' color={Colors.gold} />
								<WrappedLabel
									text='Preview the screen first, then open the modal to validate backdrop emphasis, blur, and centered window composition.'
									width={680}
									font='bodySm'
									color={Colors.silver}
								/>
							</layoutContainer>
							<Button text='Back' variant='small' onPress={onBack} />
						</layoutContainer>

						<layoutContainer
							layout={{
								...tw`w-full flex-row`,
								flex: 1,
								gap: 24,
							}}
						>
							<Panel layout={{ width: 340, height: '100%', gap: 16 }}>
								<Label text='Inventory' font='titleSm' color={Colors.gold} />
								<WrappedLabel
									text='This side panel represents persistent UI that should stay visible but lose emphasis while the modal is active.'
									width={276}
									font='bodySm'
									color={Colors.silver}
								/>
								<Button
									text='Open Window'
									onPress={() => setShowWindow(true)}
								/>
								<layoutContainer layout={{ ...tw`w-full flex-col`, gap: 10 }}>
									<Button
										text='Use Item'
										variant='small'
										disabled={showWindow}
									/>
									<Button
										text='Drop Item'
										variant='small'
										disabled={showWindow}
									/>
									<Button
										text='Inspect'
										variant='small'
										disabled={showWindow}
									/>
								</layoutContainer>
							</Panel>

							<Panel layout={{ flex: 1, height: '100%', gap: 18 }}>
								<Label
									text='Character Overview'
									font='titleSm'
									color={Colors.gold}
								/>
								<WrappedLabel
									text='The center area gives the modal a real screen to sit on top of instead of isolated test cards. This makes layering issues obvious immediately.'
									width={560}
									font='bodySm'
									color={Colors.silver}
								/>
								<layoutContainer
									layout={{
										...tw`w-full flex-row flex-wrap`,
										gap: 14,
									}}
								>
									<Panel layout={{ width: 180, gap: 8 }}>
										<Label
											text='Strength'
											font='label'
											color={Colors.metalHighlight}
										/>
										<Label text='18' font='body' color={Colors.silver} />
									</Panel>
									<Panel layout={{ width: 180, gap: 8 }}>
										<Label
											text='Dexterity'
											font='label'
											color={Colors.metalHighlight}
										/>
										<Label text='14' font='body' color={Colors.silver} />
									</Panel>
									<Panel layout={{ width: 180, gap: 8 }}>
										<Label
											text='Intelligence'
											font='label'
											color={Colors.metalHighlight}
										/>
										<Label text='22' font='body' color={Colors.silver} />
									</Panel>
								</layoutContainer>
								<Panel layout={{ width: '100%', flex: 1, gap: 12 }}>
									<Label
										text='Layering Check'
										font='titleSm'
										color={Colors.gold}
									/>
									<WrappedLabel
										text='When the modal opens, this whole subtree should dim and blur while the overlay remains sharp and blocks interaction behind it.'
										width={560}
										font='bodySm'
										color={Colors.silver}
									/>
									<Button
										text='Secondary Action'
										variant='small'
										disabled={showWindow}
									/>
								</Panel>
							</Panel>
						</layoutContainer>
					</layoutContainer>
				</UIScreen>
			}
		>
			<layoutContainer layout={tw`w-full flex-col gap-4`}>
				<WrappedLabel
					text='This first-pass window primitive reuses Panel for the body, exposes a semantic close button in the header, and keeps the overlay concerns inside one reusable component.'
					width={540}
					font='body'
					color={Colors.silver}
				/>
				<Panel layout={{ width: '100%', gap: 10 }}>
					<Label
						text='Placeholder Content'
						font='titleSm'
						color={Colors.gold}
					/>
					<WrappedLabel
						text='Use this area for inventory previews, settings panes, or any temporary fullscreen overlay content that needs focus over the current screen.'
						width={476}
						font='bodySm'
						color={Colors.silver}
					/>
					<layoutContainer layout={{ ...tw`flex-row justify-end`, gap: 12 }}>
						<Button
							text='Close'
							variant='small'
							onPress={() => setShowWindow(false)}
						/>
					</layoutContainer>
				</Panel>
			</layoutContainer>
		</Window>
	)
}
