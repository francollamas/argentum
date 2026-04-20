import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors, Input, Label, Panel } from '../../ui'

export const InputDemoScreen: FC = () => {
	const [username, setUsername] = useState('Franco')
	const [password, setPassword] = useState('hunter2')
	const [centerValue, setCenterValue] = useState('Centered')
	const [rightValue, setRightValue] = useState('9999')
	const [lastSubmitted, setLastSubmitted] = useState('Nothing submitted yet')

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='Input Demo' font='title' color={Colors.gold} />
				<Label
					text='Layout-driven input with DOM keyboard capture and Pixi rendering'
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
				<Panel layout={{ width: 420, gap: 14 }}>
					<Label text='Basic States' font='titleSm' color={Colors.gold} />
					<Label
						text='Placeholder, controlled value, and Enter submission all use the hidden DOM input.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<layoutContainer layout={tw`w-full flex-col gap-3`}>
						<Input
							placeholder='Username'
							value={username}
							onChange={setUsername}
						/>
						<Input
							placeholder='Password'
							value={password}
							onChange={setPassword}
							secure
							onEnter={(nextValue) =>
								setLastSubmitted(`Submitted password: ${nextValue}`)
							}
						/>
					</layoutContainer>
					<Label
						text={`Username: ${username || '(empty)'}`}
						font='label'
						color={Colors.metalHighlight}
					/>
					<Label
						text={lastSubmitted}
						font='labelSm'
						color={Colors.silver}
						wrap
					/>
				</Panel>

				<Panel layout={{ width: 420, gap: 14 }}>
					<Label text='Alignment' font='titleSm' color={Colors.gold} />
					<Label
						text='Horizontal alignment is handled by an inner flex container, not by manual text coordinates.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<layoutContainer layout={tw`w-full flex-col gap-3`}>
						<Input
							placeholder='Left aligned'
							value={username}
							onChange={setUsername}
							align='left'
						/>
						<Input
							placeholder='Center aligned'
							value={centerValue}
							onChange={setCenterValue}
							align='center'
						/>
						<Input
							placeholder='Right aligned'
							value={rightValue}
							onChange={setRightValue}
							align='right'
						/>
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 520, gap: 14 }}>
					<Label text='Panel Composition' font='titleSm' color={Colors.gold} />
					<Label
						text='The component stretches cleanly inside columns and still allows explicit widths in rows.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
					<layoutContainer layout={tw`w-full flex-col gap-2`}>
						<Label text='Email' font='label' color={Colors.metalHighlight} />
						<Input placeholder='name@argentum.dev' />
					</layoutContainer>
					<layoutContainer layout={tw`w-full flex-col gap-2`}>
						<Label
							text='Character Name'
							font='label'
							color={Colors.metalHighlight}
						/>
						<Input placeholder='Enter a name' maxLength={24} />
					</layoutContainer>
					<layoutContainer layout={tw`flex-row gap-3`}>
						<Input width={220} placeholder='City' />
						<Input width={140} placeholder='Level' align='right' />
					</layoutContainer>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
