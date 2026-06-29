import { tw } from '@pixi/layout/tailwind'
import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { UIScreen } from '../../layout'
import { Button, Colors, Dialog, Label, Panel, WrappedLabel } from '../../ui'

type DialogDemoScreenProps = {
	onBack: () => void
}

type DemoDialogId = 'yes-no' | 'yes-no-close' | 'alignment-grid' | null

type DemoCard = {
	id: Exclude<DemoDialogId, null>
	title: string
	description: string
	buttonText: string
}

type DemoDialogConfig = {
	title: string
	width: number
	actions: Array<{
		text: string
		onPress: () => void
	}>
	children: ReactNode
}

const DIALOG_CARDS: DemoCard[] = [
	{
		id: 'yes-no',
		title: 'Yes / No',
		description:
			'Classic binary confirmation with two footer actions of equal width.',
		buttonText: 'Open Yes / No',
	},
	{
		id: 'yes-no-close',
		title: 'Yes / No / Close',
		description:
			'Three footer actions to validate spacing and balance in the reusable dialog footer.',
		buttonText: 'Open 3 actions',
	},
	{
		id: 'alignment-grid',
		title: 'Grid Content',
		description:
			'Demonstrates composed content with four structured options instead of plain text only.',
		buttonText: 'Open alignment grid',
	},
]

export const DialogDemoScreen: FC<DialogDemoScreenProps> = ({ onBack }) => {
	const [activeDialog, setActiveDialog] = useState<DemoDialogId>(null)
	const [lastAction, setLastAction] = useState('No action yet')

	const closeDialog = () => setActiveDialog(null)

	const dialogConfig: DemoDialogConfig = (() => {
		switch (activeDialog) {
			case 'yes-no':
				return {
					title: 'Confirmar accion',
					width: 520,
					actions: [
						{
							text: 'No',
							onPress: () => {
								setLastAction('Selected No in the Yes / No dialog')
								closeDialog()
							},
						},
						{
							text: 'Si',
							onPress: () => {
								setLastAction('Selected Yes in the Yes / No dialog')
								closeDialog()
							},
						},
					],
					children: (
						<WrappedLabel
							text='Esta accion reemplazaria el equipo actual. Confirm the choice to continue or reject it to keep the current loadout.'
							width={440}
							font='body'
							color={Colors.silver}
						/>
					),
				}

			case 'yes-no-close':
				return {
					title: 'Salir de la mazmorra',
					width: 620,
					actions: [
						{
							text: 'No',
							onPress: () => {
								setLastAction('Selected No in the 3-action dialog')
								closeDialog()
							},
						},
						{
							text: 'Si',
							onPress: () => {
								setLastAction('Selected Yes in the 3-action dialog')
								closeDialog()
							},
						},
						{
							text: 'Cerrar',
							onPress: () => {
								setLastAction('Selected Close in the 3-action dialog')
								closeDialog()
							},
						},
					],
					children: (
						<layoutContainer layout={{ ...tw`w-full flex-col`, gap: 12 }}>
							<WrappedLabel
								text='The party leader wants to leave the dungeon now. This example validates equal-width footer actions with three choices.'
								width={540}
								font='body'
								color={Colors.silver}
							/>
							<Panel layout={{ width: '100%', gap: 8 }}>
								<Label
									text='Party status'
									font='label'
									color={Colors.metalHighlight}
								/>
								<Label
									text='3 players are ready. 1 player is still fighting.'
									font='bodySm'
									color={Colors.silver}
								/>
							</Panel>
						</layoutContainer>
					),
				}

			case 'alignment-grid':
				return {
					title: 'Elegir alineacion',
					width: 860,
					actions: [],
					children: (
						<layoutContainer layout={{ ...tw`w-full flex-col`, gap: 16 }}>
							<WrappedLabel
								text='This dialog uses structured content instead of a plain message. Each option combines a title, a short description, and its own action.'
								width={780}
								font='body'
								color={Colors.silver}
							/>
							<layoutContainer
								layout={{
									...tw`w-full flex-row flex-wrap justify-between`,
									rowGap: 16,
								}}
							>
								{[
									{
										name: 'Ciudadano',
										description:
											'Balanced path focused on lawful play, trade, and cooperation.',
									},
									{
										name: 'Criminal',
										description:
											'High-risk alignment with hostile interactions and outlaw consequences.',
									},
									{
										name: 'Neutral',
										description:
											'Flexible role that avoids strong allegiance and keeps your options open.',
									},
									{
										name: 'Opcion4',
										description:
											'Placeholder branch to validate four-option grid layouts inside dialogs.',
									},
								].map((option) => (
									<Panel key={option.name} layout={{ width: 376, gap: 12 }}>
										<Label
											text={option.name}
											font='titleSm'
											color={Colors.gold}
										/>
										<WrappedLabel
											text={option.description}
											width={312}
											font='bodySm'
											color={Colors.silver}
										/>
										<Button
											text={option.name}
											onPress={() => {
												setLastAction(
													`Selected ${option.name} in the grid dialog`,
												)
												closeDialog()
											}}
										/>
									</Panel>
								))}
							</layoutContainer>
						</layoutContainer>
					),
				}

			default:
				return {
					title: '',
					width: 520,
					actions: [],
					children: null,
				}
		}
	})()

	return (
		<Dialog
			visible={activeDialog != null}
			title={dialogConfig.title}
			onClose={closeDialog}
			width={dialogConfig.width}
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
								<Label text='Dialog Demo' font='title' color={Colors.gold} />
								<WrappedLabel
									text='Open different dialog variants to validate footer action combinations and richer structured content inside the same centered modal primitive.'
									width={720}
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
							<Panel layout={{ width: 460, height: '100%', gap: 16 }}>
								<Label
									text='Dialog Variants'
									font='titleSm'
									color={Colors.gold}
								/>
								<WrappedLabel
									text='These examples cover binary confirmation, three footer actions, and composed grid content inside the dialog body.'
									width={396}
									font='bodySm'
									color={Colors.silver}
								/>
								<layoutContainer layout={{ ...tw`w-full flex-col`, gap: 12 }}>
									{DIALOG_CARDS.map((card) => (
										<Panel key={card.id} layout={{ width: '100%', gap: 10 }}>
											<Label
												text={card.title}
												font='label'
												color={Colors.metalHighlight}
											/>
											<WrappedLabel
												text={card.description}
												width={360}
												font='bodySm'
												color={Colors.silver}
											/>
											<Button
												text={card.buttonText}
												onPress={() => setActiveDialog(card.id)}
											/>
										</Panel>
									))}
								</layoutContainer>
							</Panel>

							<Panel layout={{ flex: 1, height: '100%', gap: 16 }}>
								<Label text='Result' font='titleSm' color={Colors.gold} />
								<WrappedLabel
									text='Every example closes either through footer actions, the header close button, or a composed action inside the dialog body.'
									width={480}
									font='bodySm'
									color={Colors.silver}
								/>
								<Panel layout={{ width: '100%', gap: 8 }}>
									<Label
										text='Last action'
										font='label'
										color={Colors.metalHighlight}
									/>
									<Label
										text={lastAction}
										font='bodySm'
										color={Colors.silver}
									/>
								</Panel>
							</Panel>
						</layoutContainer>
					</layoutContainer>
				</UIScreen>
			}
			actions={dialogConfig.actions}
		>
			{dialogConfig.children}
		</Dialog>
	)
}
