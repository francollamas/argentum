import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { Button, Colors, Label, Panel } from '../../ui'

export const PanelDemoScreen: FC = () => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='Panel Demo' font='title' color={Colors.gold} />
				<Label
					text='Panel as a real flex container with direct children'
					font='bodySm'
					color={Colors.silver}
				/>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row flex-wrap justify-center`,
					gap: 20,
				}}
			>
				<Panel layout={{ width: 320 }}>
					<Label
						text='Default Column Panel'
						font='titleSm'
						color={Colors.gold}
					/>
					<Label
						text='Uses the built-in defaults: padding 16, gap 8, column layout.'
						font='bodySm'
						color={Colors.silver}
					/>
					<Button text='Primary Action' onPress={() => {}} />
				</Panel>

				<Panel layout={{ width: 360, padding: 24, gap: 16 }}>
					<Label text='Padding + Gap' font='titleSm' color={Colors.gold} />
					<Label
						text='This panel uses larger spacing so the content breathes more.'
						font='bodySm'
						color={Colors.silver}
					/>
					<layoutContainer layout={tw`flex-row items-center gap-3`}>
						<Button text='Accept' variant='small' onPress={() => {}} />
						<Button text='Cancel' variant='small' onPress={() => {}} />
					</layoutContainer>
				</Panel>

				<Panel layout={{ ...tw`flex-row gap-4`, width: 520 }}>
					<layoutContainer layout={tw`flex-col gap-2`}>
						<Label text='Row Layout' font='titleSm' color={Colors.gold} />
						<Label
							text='Children sit next to each other without an extra inner wrapper.'
							font='bodySm'
							color={Colors.silver}
						/>
					</layoutContainer>
					<Button text='Equip' onPress={() => {}} />
					<Button text='Drop' variant='small' onPress={() => {}} />
				</Panel>

				<Panel
					layout={{
						...tw`flex-row items-center justify-center`,
						width: 520,
						height: 90,
						gap: 10,
					}}
				>
					<Button text='Left' variant='small' onPress={() => {}} />
					<Button text='Center' variant='small' onPress={() => {}} />
					<Button text='Right' variant='small' onPress={() => {}} />
				</Panel>

				<Panel layout={{ width: 320, height: 220, gap: 12 }}>
					<Label text='Fixed Height' font='titleSm' color={Colors.gold} />
					<Label
						text='A fixed-height panel keeps its background stretched while content stays layout-driven.'
						font='bodySm'
						color={Colors.silver}
					/>
					<layoutContainer layout={{ flex: 1 }} />
					<Button text='Bottom Action' onPress={() => {}} />
				</Panel>

				<Panel layout={{ width: 420, padding: 20, gap: 16 }}>
					<Label text='Nested Panels' font='titleSm' color={Colors.gold} />
					<Panel layout={{ padding: 12, gap: 6 }}>
						<Label
							text='Character Summary'
							font='label'
							color={Colors.metalHighlight}
						/>
						<Label text='Class: Warrior' font='bodySm' color={Colors.silver} />
						<Label text='Level: 12' font='bodySm' color={Colors.silver} />
					</Panel>
					<Panel layout={{ ...tw`flex-row items-center`, padding: 12, gap: 10 }}>
						<Button text='Stats' variant='small' onPress={() => {}} />
						<Button text='Inventory' variant='small' onPress={() => {}} />
						<Button text='Skills' variant='small' onPress={() => {}} />
					</Panel>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
