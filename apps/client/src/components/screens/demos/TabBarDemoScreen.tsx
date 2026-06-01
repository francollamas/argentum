import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors, Divider, Label, Panel, TabBar } from '../../ui'

const CHARACTER_TABS = [
	{ label: 'Stats' },
	{ label: 'Skills' },
	{ label: 'Items' },
]

const SETTINGS_TABS = [
	{ label: 'Graphics' },
	{ label: 'Audio' },
	{ label: 'Gameplay' },
	{ label: 'Chat' },
]

const COMPACT_TABS = [{ label: 'PvP' }, { label: 'PvE' }, { label: 'Party' }]

const CHARACTER_CONTENT = [
	'Vida, mana, stamina y experiencia del personaje.',
	'Skills activas, progreso de entrenamiento y bonos temporales.',
	'Inventario equipado, peso actual y slots disponibles.',
]

const SETTINGS_CONTENT = [
	'Resolucion, sombras, animaciones y calidad de efectos.',
	'Volumen general, musica, efectos y sonidos de interfaz.',
	'Auto pickup, nombres flotantes y opciones de combate.',
	'Filtros de mensajes, timestamps y compactacion del chat.',
]

export const TabBarDemoScreen: FC = () => {
	const [activeCharacterTab, setActiveCharacterTab] = useState(0)
	const [activeSettingsTab, setActiveSettingsTab] = useState(1)
	const [activeCompactTab, setActiveCompactTab] = useState(2)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='TabBar Demo' font='title' color={Colors.gold} />
				<Label
					text='One active tab at a time with flexible widths and content switching'
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
				<Panel layout={{ width: 540, gap: 16 }}>
					<Label text='Character Panel' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{
							...tw`w-full flex-col`,
							gap: 8,
						}}
					>
						<TabBar
							tabs={CHARACTER_TABS}
							activeIndex={activeCharacterTab}
							onChange={setActiveCharacterTab}
						/>
						<Divider thickness={2} />
						<layoutContainer
							layout={{
								...tw`w-full flex-col`,
								gap: 8,
								paddingLeft: 6,
								paddingRight: 6,
								paddingTop: 8,
								paddingBottom: 4,
							}}
						>
							<Label
								text={CHARACTER_TABS[activeCharacterTab]?.label ?? ''}
								font='label'
								color={Colors.metalHighlight}
							/>
							<Label
								text={CHARACTER_CONTENT[activeCharacterTab] ?? ''}
								font='bodySm'
								color={Colors.silver}
								wrap
							/>
						</layoutContainer>
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 620, gap: 16 }}>
					<Label text='Settings Tabs' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={{ ...tw`w-full flex-col`, gap: 8 }}>
						<TabBar
							tabs={SETTINGS_TABS}
							activeIndex={activeSettingsTab}
							onChange={setActiveSettingsTab}
							gap={12}
						/>
						<Divider thickness={2} />
					</layoutContainer>
					<Label
						text={SETTINGS_CONTENT[activeSettingsTab] ?? ''}
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 16 }}>
					<Label text='Compact Tabs' font='titleSm' color={Colors.gold} />
					<TabBar
						tabs={COMPACT_TABS}
						activeIndex={activeCompactTab}
						onChange={setActiveCompactTab}
						gap={8}
					/>
					<Label
						text={`Active mode: ${COMPACT_TABS[activeCompactTab]?.label ?? ''}`}
						font='label'
						color={Colors.metalHighlight}
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 16 }}>
					<Label text='Disabled State' font='titleSm' color={Colors.gold} />
					<TabBar tabs={CHARACTER_TABS} activeIndex={1} disabled />
					<Label
						text='Disabled tab bars keep the selected tab visible and ignore clicks.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
