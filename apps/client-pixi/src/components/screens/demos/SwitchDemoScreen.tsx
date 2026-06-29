import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { CheckBox, Colors, Label, Panel, Switch } from '../../ui'

export const SwitchDemoScreen: FC = () => {
	const [musicEnabled, setMusicEnabled] = useState(true)
	const [ambienceEnabled, setAmbienceEnabled] = useState(false)
	const [compactEnabled, setCompactEnabled] = useState(true)
	const [silentEnabled, setSilentEnabled] = useState(false)
	const [soundFxEnabled, setSoundFxEnabled] = useState(true)
	const [shadowsEnabled, setShadowsEnabled] = useState(false)
	const [showNames, setShowNames] = useState(true)
	const [autoLoot, setAutoLoot] = useState(false)
	const [partyInvites, setPartyInvites] = useState(true)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='Switch Demo' font='title' color={Colors.gold} />
				<Label
					text='Layout-driven switches with consistent alignment inside shared panels'
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
					<Label text='Switch States' font='titleSm' color={Colors.gold} />
					<Switch
						enabled={musicEnabled}
						onChange={setMusicEnabled}
						text='Musica habilitada'
					/>
					<Switch
						enabled={ambienceEnabled}
						onChange={setAmbienceEnabled}
						text='Ambiente de ciudad'
					/>
					<layoutContainer layout={tw`flex-row items-center gap-4`}>
						<Switch enabled={compactEnabled} onChange={setCompactEnabled} />
						<Switch enabled={silentEnabled} onChange={setSilentEnabled} />
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 340, gap: 12 }}>
					<Label text='Settings' font='titleSm' color={Colors.gold} />
					<Switch
						enabled={musicEnabled}
						onChange={setMusicEnabled}
						text='Musica'
					/>
					<Switch
						enabled={soundFxEnabled}
						onChange={setSoundFxEnabled}
						text='Efectos de sonido'
					/>
					<Switch
						enabled={ambienceEnabled}
						onChange={setAmbienceEnabled}
						text='Sonido ambiental'
					/>
					<Switch
						enabled={shadowsEnabled}
						onChange={setShadowsEnabled}
						text='Sombras dinamicas'
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 12 }}>
					<Label text='Mixed Controls' font='titleSm' color={Colors.gold} />
					<Switch
						enabled={musicEnabled}
						onChange={setMusicEnabled}
						text='Musica'
					/>
					<Switch
						enabled={partyInvites}
						onChange={setPartyInvites}
						text='Invitaciones de party'
					/>
					<CheckBox
						checked={showNames}
						onChange={setShowNames}
						text='Mostrar nombres'
					/>
					<CheckBox
						checked={autoLoot}
						onChange={setAutoLoot}
						text='Auto loot'
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
