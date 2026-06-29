import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Colors, Label, List, Panel, ScrollView, WrappedLabel } from '../../ui'

const BASIC_ROWS = Array.from({ length: 24 }, (_, index) => ({
	id: `basic-${index + 1}`,
	text: `Quest entry ${index + 1}`,
}))

const LONG_ROWS = Array.from({ length: 12 }, (_, index) => ({
	id: `long-${index + 1}`,
	text: `Long row ${index + 1}: rumors from the harbor mention contraband moving through the eastern gate during foggy nights.`,
}))

const LIST_STYLE_ROWS = [
	{ text: 'Mision del herrero' },
	{ text: 'Encargo del mago' },
	{ text: 'Patrulla en la muralla norte' },
	{ text: 'Recolectar hierbas del bosque' },
	{ text: 'Informe del puerto' },
	{ text: 'Escolta a Banderbill' },
	{ text: 'Materiales para la torre norte' },
	{ text: 'Runas para la camara arcana' },
	{ text: 'Pieles de lobo para el sastre' },
	{ text: 'Aviso de bandidos en el camino sur' },
	{ text: 'Pedido de suministros desde Nix' },
	{ text: 'Reliquia recuperada de la cripta' },
]

const LOG_ROWS = Array.from({ length: 18 }, (_, index) => ({
	id: `log-${index + 1}`,
	title: `Field report ${index + 1}`,
	text: `Harbor patrol observed unusual cargo movement near pier ${((index % 4) + 1).toString()} during the late watch.`,
}))

type ScrollRowProps = {
	text: string
	selected?: boolean
	onPress?: () => void
}

const ScrollRow: FC<ScrollRowProps> = ({ text, selected = false, onPress }) => (
	<layoutContainer
		eventMode={onPress ? 'static' : 'passive'}
		cursor={onPress ? 'pointer' : undefined}
		onPointerTap={onPress}
		layout={{
			...tw`w-full`,
			alignSelf: 'stretch',
			minWidth: 0,
			minHeight: 44,
			paddingLeft: 14,
			paddingRight: 14,
			paddingTop: 10,
			paddingBottom: 10,
			justifyContent: 'center',
			backgroundColor: selected ? 0x4d372c : 0x241713,
		}}
	>
		<WrappedLabel
			text={text}
			width={220}
			font='bodySm'
			color={selected ? Colors.metalHighlight : Colors.silver}
			layout={{ width: '100%', minWidth: 0 }}
		/>
	</layoutContainer>
)

const LogRow: FC<{ title: string; text: string }> = ({ title, text }) => (
	<layoutContainer
		layout={{
			...tw`w-full flex-col`,
			alignSelf: 'stretch',
			minWidth: 0,
			padding: 12,
			gap: 6,
			backgroundColor: 0x241713,
		}}
	>
		<Label text={title} font='label' color={Colors.metalHighlight} />
		<WrappedLabel text={text} width={250} font='bodySm' color={Colors.silver} />
	</layoutContainer>
)

export const ScrollViewDemoScreen: FC = () => {
	const [selectedIndex, setSelectedIndex] = useState(2)
	const selectedText = useMemo(
		() => LIST_STYLE_ROWS[selectedIndex]?.text ?? 'None',
		[selectedIndex],
	)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='ScrollView Demo' font='title' color={Colors.gold} />
				<WrappedLabel
					text='Vertical-only scroll area with clipping, wheel support, and stacked content that composes cleanly inside panels'
					width={680}
					font='bodySm'
					color={Colors.silver}
					align='center'
				/>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row flex-wrap justify-center`,
					alignItems: 'flex-start',
					gap: 20,
				}}
			>
				<Panel layout={{ width: 320, gap: 14 }}>
					<Label
						text='Basic Vertical Scroll'
						font='titleSm'
						color={Colors.gold}
					/>
					<WrappedLabel
						text='Twenty-four rows inside a bounded viewport. This one should move immediately with mouse wheel or trackpad.'
						width={260}
						font='bodySm'
						color={Colors.silver}
					/>
					<ScrollView
						height={260}
						layout={{ backgroundColor: 0x1b120f }}
						contentLayout={{ gap: 6, padding: 6 }}
					>
						{BASIC_ROWS.map((row) => (
							<ScrollRow key={row.id} text={row.text} />
						))}
					</ScrollView>
				</Panel>

				<Panel layout={{ width: 330, gap: 14 }}>
					<Label text='Panel Composition' font='titleSm' color={Colors.gold} />
					<WrappedLabel
						text='A denser stacked layout inside a panel, still clipped correctly and readable without weird scaling.'
						width={270}
						font='bodySm'
						color={Colors.silver}
					/>
					<ScrollView
						height={300}
						layout={{ backgroundColor: 0x1b120f }}
						contentLayout={{ gap: 8, padding: 6 }}
					>
						{LOG_ROWS.map((row) => (
							<LogRow key={row.id} title={row.title} text={row.text} />
						))}
					</ScrollView>
				</Panel>

				<Panel layout={{ width: 320, gap: 14 }}>
					<Label
						text='List Inside ScrollView'
						font='titleSm'
						color={Colors.gold}
					/>
					<ScrollView
						height={260}
						layout={{ backgroundColor: 0x1b120f, borderRadius: 8 }}
						contentLayout={{ width: '100%' }}
					>
						<List
							items={LIST_STYLE_ROWS}
							selectedIndex={selectedIndex}
							onChange={setSelectedIndex}
							layout={{ width: '100%' }}
						/>
					</ScrollView>
					<Label
						text={`Selected quest: ${selectedText}`}
						font='labelSm'
						color={Colors.metalHighlight}
					/>
				</Panel>

				<Panel layout={{ width: 240, gap: 14 }}>
					<Label text='Narrow / Tall Case' font='titleSm' color={Colors.gold} />
					<WrappedLabel
						text='Narrow and tall on purpose to validate clipping. If this case breaks, the component is not ready.'
						width={180}
						font='bodySm'
						color={Colors.silver}
					/>
					<ScrollView
						height={340}
						layout={{ backgroundColor: 0x1b120f }}
						contentLayout={{ gap: 8, padding: 6 }}
					>
						{LONG_ROWS.map((row) => (
							<ScrollRow key={`narrow-${row.id}`} text={row.text} />
						))}
					</ScrollView>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
