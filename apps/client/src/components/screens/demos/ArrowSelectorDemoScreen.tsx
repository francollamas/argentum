import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { ArrowSelector, Colors, Label, Panel } from '../../ui'

const CLASS_ITEMS = [
	{ text: 'Guerrero' },
	{ text: 'Mago' },
	{ text: 'Arquero' },
	{ text: 'Clerigo' },
]

const SERVER_ITEMS = [
	{ text: 'Servidor Alpha' },
	{ text: 'Servidor PvP Extremo' },
	{ text: 'Servidor Rol' },
]

const ARROW_SELECTOR_SIZE = 46

export const ArrowSelectorDemoScreen: FC = () => {
	const [selectedClass, setSelectedClass] = useState(1)
	const [selectedServer, setSelectedServer] = useState(0)
	const [selectedAlignment, setSelectedAlignment] = useState(2)
	const [selectedCompactClass, setSelectedCompactClass] = useState(0)
	const [selectedCompactServer, setSelectedCompactServer] = useState(1)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='ArrowSelector Demo' font='title' color={Colors.gold} />
				<Label
					text='Sequential selection with circular navigation and shared arrow buttons'
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
				<Panel layout={{ width: 520, gap: 14 }}>
					<Label text='Class Selector' font='titleSm' color={Colors.gold} />
					<ArrowSelector
						items={CLASS_ITEMS}
						selectedIndex={selectedClass}
						onChange={setSelectedClass}
						size={ARROW_SELECTOR_SIZE}
						layout={{ width: '100%' }}
					/>
					<Label
						text={`Clase actual: ${CLASS_ITEMS[selectedClass]?.text}`}
						font='label'
						color={Colors.metalHighlight}
					/>
				</Panel>

				<Panel layout={{ width: 620, gap: 14 }}>
					<Label text='Longer Labels' font='titleSm' color={Colors.gold} />
					<ArrowSelector
						items={SERVER_ITEMS}
						selectedIndex={selectedServer}
						onChange={setSelectedServer}
						size={ARROW_SELECTOR_SIZE}
						layout={{ width: '100%' }}
					/>
					<Label
						text='The selector stretches with the panel width while keeping fixed-size arrows.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>

				<Panel layout={{ width: 520, gap: 14 }}>
					<Label text='Disabled State' font='titleSm' color={Colors.gold} />
					<ArrowSelector
						items={[{ text: 'Orden' }, { text: 'Neutral' }, { text: 'Caos' }]}
						selectedIndex={selectedAlignment}
						onChange={setSelectedAlignment}
						size={ARROW_SELECTOR_SIZE}
						layout={{ width: '100%' }}
						disabled
					/>
					<Label
						text='Disabled selectors keep the current item visible and block navigation.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>

				<Panel layout={{ width: 340, gap: 14 }}>
					<Label text='Compact Class' font='titleSm' color={Colors.gold} />
					<ArrowSelector
						items={CLASS_ITEMS}
						selectedIndex={selectedCompactClass}
						onChange={setSelectedCompactClass}
						size={ARROW_SELECTOR_SIZE}
						layout={{ width: '100%' }}
					/>
					<Label
						text='Narrow panel with shorter labels.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 14 }}>
					<Label text='Compact Long Label' font='titleSm' color={Colors.gold} />
					<ArrowSelector
						items={SERVER_ITEMS}
						selectedIndex={selectedCompactServer}
						onChange={setSelectedCompactServer}
						size={ARROW_SELECTOR_SIZE}
						layout={{ width: '100%' }}
					/>
					<Label
						text='Shows how the center label behaves when the parent width gets tighter.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
