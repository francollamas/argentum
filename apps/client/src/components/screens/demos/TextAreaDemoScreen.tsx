import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors, Label, Panel, TextArea } from '../../ui'

const LONG_TEXT = `Born in Ullathorpe, this mage keeps notes about every hunt, every failed spell, and every rumor heard at the docks.

The field should support multiple paragraphs naturally, keep internal scrolling, and preserve the same DOM overlay strategy used by the input component.`

export const TextAreaDemoScreen: FC = () => {
	const [bio, setBio] = useState('Mage looking for a party in Nix.')
	const [notes, setNotes] = useState(LONG_TEXT)
	const [centered, setCentered] = useState(
		'Centered multiline text\nwith explicit line breaks.',
	)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='TextArea Demo' font='title' color={Colors.gold} />
				<Label
					text='Multiline editable text using the same DOM attachment strategy as Input'
					font='bodySm'
					color={Colors.silver}
					wrap
				/>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row flex-wrap justify-center`,
					gap: 20,
				}}
			>
				<Panel layout={{ width: 440, gap: 14 }}>
					<Label text='Basic States' font='titleSm' color={Colors.gold} />
					<Label
						text='Placeholder and controlled content behave like a regular textarea. Enter inserts a new line.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<layoutContainer layout={tw`w-full flex-col gap-3`}>
						<TextArea
							height={120}
							placeholder='Write your character background'
							value={bio}
							onChange={setBio}
						/>
						<TextArea height={140} placeholder='Empty placeholder state' />
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 440, gap: 14 }}>
					<Label text='Alignment + Height' font='titleSm' color={Colors.gold} />
					<Label
						text='The field keeps top padding for readability while letting horizontal alignment follow the chosen mode.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<layoutContainer layout={tw`w-full flex-col gap-3`}>
						<TextArea
							height={96}
							value={centered}
							onChange={setCentered}
							align='center'
						/>
						<TextArea
							height={160}
							value={'1234\n9999\n42000'}
							onChange={() => undefined}
							align='right'
						/>
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 520, gap: 14 }}>
					<Label text='Panel Composition' font='titleSm' color={Colors.gold} />
					<Label
						text='Longer notes stay inside the control and scroll internally without breaking panel layout.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<layoutContainer layout={tw`w-full flex-col gap-2`}>
						<Label
							text='Adventure Notes'
							font='label'
							color={Colors.metalHighlight}
						/>
						<TextArea height={220} value={notes} onChange={setNotes} />
					</layoutContainer>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
