import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors, Label, List, Panel } from '../../ui'

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

export const ListDemoScreen: FC = () => {
	const [selectedQuest, setSelectedQuest] = useState(1)
	const [selectedSpell, setSelectedSpell] = useState<number | null>(null)

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
					text='Selectable vertical rows with minimal states and disabled support'
					font='bodySm'
					color={Colors.silver}
				/>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row`,
					gap: 20,
				}}
			>
				<Panel layout={{ alignSelf: 'stretch', gap: 16 }}>
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
					<Label
						text={`Selected quest: ${selectedQuest >= 0 ? QUEST_ITEMS[selectedQuest]?.text : 'None'}`}
						font='labelSm'
						color={Colors.metalHighlight}
					/>
				</Panel>

				<Panel layout={{ alignSelf: 'stretch', gap: 16 }}>
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
					<Label
						text={
							selectedSpell == null
								? 'No spell selected yet.'
								: `Selected spell: ${SPELL_ITEMS[selectedSpell]?.text}`
						}
						font='labelSm'
						color={
							selectedSpell == null ? Colors.silver : Colors.metalHighlight
						}
					/>
				</Panel>

				<Panel layout={{ alignSelf: 'stretch', gap: 16 }}>
					<Label text='Disabled List' font='titleSm' color={Colors.gold} />
					<List items={QUEST_ITEMS.slice(0, 3)} selectedIndex={1} disabled />
					<Label
						text='Disabled lists keep their selected row visible and ignore hover/click interactions.'
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
