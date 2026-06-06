import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors, Label, List, Panel, WrappedLabel } from '../../ui'

const QUEST_ITEMS = [
	{ text: 'Mision del herrero' },
	{ text: 'Encargo del mago' },
	{ text: 'Patrulla en la muralla norte' },
	{ text: 'Recolectar hierbas del bosque' },
]

const SPELL_ITEMS = [
	{ text: 'Curar heridas leves' },
	{ text: 'Misil magico' },
	{ text: 'Inmovilizar' },
	{ text: 'Invisibilidad grupal' },
]

const LONG_TEXT_ITEMS = [
	{
		text: 'Solicitud urgente del consejo arcano para escoltar un cargamento con insumos rituales hasta la torre oeste antes del amanecer.',
	},
	{
		text: 'Rumor de actividad hostil en las minas profundas: investigar la presencia de criaturas y reportar cualquier hallazgo relevante.',
	},
	{
		text: 'Dialogo opcional con varias lineas descriptivas para validar que el texto largo siga siendo legible dentro de paneles angostos.',
	},
]

export const ListDemoScreen: FC = () => {
	const [selectedQuest, setSelectedQuest] = useState(1)
	const [selectedSpell, setSelectedSpell] = useState<number | null>(null)
	const [selectedCompact, setSelectedCompact] = useState(0)
	const [selectedTall, setSelectedTall] = useState(2)
	const [selectedLongLabel, setSelectedLongLabel] = useState(1)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='List Demo' font='title' color={Colors.gold} />
				<Label
					text='Selectable vertical rows with minimal states, wrapping labels and disabled support'
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
				<Panel layout={{ width: 420, gap: 16 }}>
					<Label
						text='Basic Selectable List'
						font='titleSm'
						color={Colors.gold}
					/>
					<List
						items={QUEST_ITEMS}
						selectedIndex={selectedQuest}
						onChange={setSelectedQuest}
					/>
					<WrappedLabel
						text={`Selected quest: ${selectedQuest >= 0 ? QUEST_ITEMS[selectedQuest]?.text : 'None'}`}
						width={360}
						font='labelSm'
						color={Colors.metalHighlight}
					/>
				</Panel>

				<Panel layout={{ width: 380, gap: 16 }}>
					<Label
						text='Empty Initial Selection'
						font='titleSm'
						color={Colors.gold}
					/>
					<List
						items={SPELL_ITEMS}
						selectedIndex={selectedSpell}
						onChange={setSelectedSpell}
					/>
					<WrappedLabel
						text={
							selectedSpell == null
								? 'No spell selected yet.'
								: `Selected spell: ${SPELL_ITEMS[selectedSpell]?.text}`
						}
						width={320}
						font='labelSm'
						color={
							selectedSpell == null ? Colors.silver : Colors.metalHighlight
						}
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 16 }}>
					<Label text='Disabled List' font='titleSm' color={Colors.gold} />
					<List items={QUEST_ITEMS.slice(0, 3)} selectedIndex={1} disabled />
					<WrappedLabel
						text='Disabled lists keep their selected row visible and ignore hover/click interactions.'
						width={320}
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>

				<Panel layout={{ width: 320, gap: 16 }}>
					<WrappedLabel
						text='Long Labels In Narrow Panel'
						width={280}
						font='titleSm'
						color={Colors.gold}
					/>
					<List
						items={LONG_TEXT_ITEMS}
						selectedIndex={selectedLongLabel}
						onChange={setSelectedLongLabel}
						itemTextWidth={240}
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 16 }}>
					<Label text='Compact Rows' font='titleSm' color={Colors.gold} />
					<List
						items={SPELL_ITEMS}
						selectedIndex={selectedCompact}
						onChange={setSelectedCompact}
						itemHeight={38}
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 16 }}>
					<Label text='Taller Rows' font='titleSm' color={Colors.gold} />
					<List
						items={QUEST_ITEMS}
						selectedIndex={selectedTall}
						onChange={setSelectedTall}
						itemHeight={56}
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
