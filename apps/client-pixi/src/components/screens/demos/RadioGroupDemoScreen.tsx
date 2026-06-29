import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Button, Colors, Label, Panel, RadioGroup } from '../../ui'

export const RadioGroupDemoScreen: FC = () => {
	const [selectedClass, setSelectedClass] = useState(1)
	const [selectedRace, setSelectedRace] = useState(0)
	const [selectedChannel, setSelectedChannel] = useState(2)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='RadioGroup Demo' font='title' color={Colors.gold} />
				<Label
					text='Radio options now flow entirely through flex layout and shared CheckBox primitives'
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
				<Panel layout={{ width: 320, gap: 12 }}>
					<Label text='Vertical Group' font='titleSm' color={Colors.gold} />
					<RadioGroup
						items={[
							{ text: 'Guerrero' },
							{ text: 'Mago' },
							{ text: 'Arquero' },
							{ text: 'Clerigo' },
						]}
						selectedIndex={selectedClass}
						onChange={setSelectedClass}
					/>
					<Label
						text={`Seleccion actual: ${['Guerrero', 'Mago', 'Arquero', 'Clerigo'][selectedClass]}`}
						font='label'
						color={Colors.silver}
					/>
				</Panel>

				<Panel layout={{ width: 420, gap: 16 }}>
					<Label text='Horizontal Group' font='titleSm' color={Colors.gold} />
					<RadioGroup
						items={[{ text: 'Humano' }, { text: 'Elfo' }, { text: 'Drow' }]}
						selectedIndex={selectedRace}
						onChange={setSelectedRace}
						direction='horizontal'
						gap={20}
						layout={{ flexWrap: 'wrap' }}
					/>
					<Button
						text='Continuar'
						variant='small'
						layout={{ alignSelf: 'flex-start' }}
						onPress={() => {}}
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 12 }}>
					<Label text='More Items' font='titleSm' color={Colors.gold} />
					<RadioGroup
						items={[
							{ text: 'General' },
							{ text: 'Party' },
							{ text: 'Clan' },
							{ text: 'Comercio' },
						]}
						selectedIndex={selectedChannel}
						onChange={setSelectedChannel}
						gap={10}
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
