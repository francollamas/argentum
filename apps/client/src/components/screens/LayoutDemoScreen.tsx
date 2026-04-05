import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import {
	Button,
	CheckBox,
	Colors,
	Input,
	Label,
	Panel,
	ProgressBar,
	RadioGroup,
	Switch,
} from '../ui'

// ─── Grid constants ───────────────────────────────────────────────────────────
// 3×3 grid, 2 empty cells. All panels share the same width; heights are uniform.

const GAP = 14
const PADDING = 18
const CELL_W = 300
const CELL_H = 260

// ─── Login Panel ─────────────────────────────────────────────────────────────

const LoginPanel: FC = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const innerW = CELL_W - PADDING * 2

	return (
		<Panel width={CELL_W} height={CELL_H}>
			<layoutContainer
				layout={{
					...tw`flex-col items-center gap-3`,
					width: CELL_W,
					height: CELL_H,
					paddingTop: PADDING,
					paddingBottom: PADDING,
				}}
			>
				<Label text='Argentum Online' font='title' color={Colors.gold} />
				<Label text='Iniciar sesión' font='general' color={Colors.silver} />
				<Input
					width={innerW}
					height={34}
					placeholder='Usuario'
					value={username}
					onChange={setUsername}
					align='left'
				/>
				<Input
					width={innerW}
					height={34}
					placeholder='Contraseña'
					value={password}
					onChange={setPassword}
					secure
					align='left'
				/>
				<Button text='Conectar' variant='normal' onPress={() => {}} />
			</layoutContainer>
		</Panel>
	)
}

// ─── Stats Panel ──────────────────────────────────────────────────────────────

const StatsPanel: FC = () => {
	const barW = CELL_W - PADDING * 2

	return (
		<Panel width={CELL_W} height={CELL_H}>
			<layoutContainer
				layout={{
					...tw`flex-col gap-2`,
					width: CELL_W,
					height: CELL_H,
					paddingTop: PADDING,
					paddingLeft: PADDING,
					paddingRight: PADDING,
					paddingBottom: PADDING,
				}}
			>
				<Label text='Estadísticas' font='general' color={Colors.gold} />
				<ProgressBar
					width={barW}
					height={26}
					value={320}
					max={500}
					fillColor={Colors.barHp}
					label='HP'
					labelColor={Colors.barHp}
					textVariant='amount'
				/>
				<ProgressBar
					width={barW}
					height={26}
					value={85}
					max={200}
					fillColor={Colors.barMp}
					label='MP'
					labelColor={Colors.barMp}
					textVariant='amount'
				/>
				<ProgressBar
					width={barW}
					height={26}
					value={140}
					max={200}
					fillColor={Colors.barStamina}
					label='Stamina'
					labelColor={Colors.barStamina}
					textVariant='amount'
				/>
				<ProgressBar
					width={barW}
					height={26}
					value={4200}
					max={10000}
					fillColor={Colors.barXp}
					label='XP'
					labelColor={Colors.barXp}
					textVariant='percentage'
				/>
			</layoutContainer>
		</Panel>
	)
}

// ─── Class Panel ──────────────────────────────────────────────────────────────

const CLASS_OPTIONS = [
	{ text: 'Guerrero' },
	{ text: 'Mago' },
	{ text: 'Arquero' },
	{ text: 'Druida' },
]

const ClassPanel: FC = () => {
	const [selectedClass, setSelectedClass] = useState(0)

	return (
		<Panel width={CELL_W} height={CELL_H}>
			<layoutContainer
				layout={{
					...tw`flex-col items-center gap-4`,
					width: CELL_W,
					height: CELL_H,
					paddingTop: PADDING,
					paddingBottom: PADDING,
				}}
			>
				<Label text='Elegí tu clase' font='general' color={Colors.gold} />
				<RadioGroup
					items={CLASS_OPTIONS}
					selectedIndex={selectedClass}
					onChange={setSelectedClass}
					type='vertical'
					elementsMargin={10}
					scale={0.65}
				/>
				<Button text='Confirmar' variant='small' onPress={() => {}} />
			</layoutContainer>
		</Panel>
	)
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

const SettingsPanel: FC = () => {
	const [music, setMusic] = useState(false)
	const [sounds, setSounds] = useState(true)
	const [fps, setFps] = useState(false)
	const [debug, setDebug] = useState(false)

	return (
		<Panel width={CELL_W} height={CELL_H}>
			<layoutContainer
				layout={{
					...tw`flex-col gap-3`,
					alignItems: 'flex-start',
					width: CELL_W,
					height: CELL_H,
					paddingTop: PADDING,
					paddingLeft: PADDING,
					paddingRight: PADDING,
					paddingBottom: PADDING,
				}}
			>
				<Label text='Opciones' font='general' color={Colors.gold} />
				<Switch
					enabled={music}
					onChange={setMusic}
					text='Música'
					scale={0.65}
					textColor={Colors.backgroundParchment}
				/>
				<Switch
					enabled={sounds}
					onChange={setSounds}
					text='Sonidos'
					scale={0.65}
					textColor={Colors.backgroundParchment}
				/>
				<Switch
					enabled={fps}
					onChange={setFps}
					text='Mostrar FPS'
					scale={0.65}
					textColor={Colors.backgroundParchment}
				/>
				<Switch
					enabled={debug}
					onChange={setDebug}
					text='Modo debug'
					scale={0.65}
					textColor={Colors.backgroundParchment}
				/>
			</layoutContainer>
		</Panel>
	)
}

// ─── Gender Panel ─────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [{ text: 'Masculino' }, { text: 'Femenino' }]

const GenderPanel: FC = () => {
	const [selectedGender, setSelectedGender] = useState(0)

	return (
		<Panel width={CELL_W} height={CELL_H}>
			<layoutContainer
				layout={{
					...tw`flex-col items-center gap-5`,
					width: CELL_W,
					height: CELL_H,
					paddingTop: PADDING,
					paddingBottom: PADDING,
				}}
			>
				<Label text='Elegí tu género' font='general' color={Colors.gold} />
				<Label
					text={selectedGender === 0 ? 'Masculino' : 'Femenino'}
					font='general'
					color={Colors.backgroundParchment}
				/>
				<RadioGroup
					items={GENDER_OPTIONS}
					selectedIndex={selectedGender}
					onChange={setSelectedGender}
					type='horizontal'
					elementsMargin={24}
					scale={0.7}
				/>
				<Button text='Confirmar' variant='small' onPress={() => {}} />
			</layoutContainer>
		</Panel>
	)
}

// ─── Inventory Panel ──────────────────────────────────────────────────────────

const InventoryPanel: FC = () => {
	const [equipped, setEquipped] = useState([true, false, true, false])
	const toggle = (i: number) =>
		setEquipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
	const items = [
		'Espada de hierro',
		'Armadura élfica',
		'Casco dorado',
		'Escudo de roble',
	]

	return (
		<Panel width={CELL_W} height={CELL_H}>
			<layoutContainer
				layout={{
					...tw`flex-col gap-3`,
					width: CELL_W,
					height: CELL_H,
					paddingTop: PADDING,
					paddingLeft: PADDING,
					paddingRight: PADDING,
					paddingBottom: PADDING,
				}}
			>
				<Label text='Inventario' font='general' color={Colors.gold} />
				{items.map((item, i) => (
					<CheckBox
						key={item}
						checked={equipped[i]}
						onChange={() => toggle(i)}
						text={item}
						scale={0.65}
						textColor={Colors.backgroundParchment}
					/>
				))}
				<Button
					text='Desequipar todo'
					variant='small'
					onPress={() => setEquipped([false, false, false, false])}
				/>
			</layoutContainer>
		</Panel>
	)
}

// ─── Counter Panel ────────────────────────────────────────────────────────────

const CounterPanel: FC = () => {
	const [count, setCount] = useState(0)

	return (
		<Panel width={CELL_W} height={CELL_H}>
			<layoutContainer
				layout={{
					...tw`flex-col items-center gap-4`,
					width: CELL_W,
					height: CELL_H,
					paddingTop: PADDING,
					paddingBottom: PADDING,
				}}
			>
				<Label text='Demo contador' font='general' color={Colors.gold} />
				<Label
					text={`Clicks: ${count}`}
					font='general'
					color={Colors.backgroundParchment}
				/>
				<layoutContainer
					layout={{ ...tw`flex-row gap-3`, alignItems: 'center' }}
				>
					<Button
						text='+1'
						variant='small'
						onPress={() => setCount((n) => n + 1)}
					/>
					<Button text='Reset' variant='small' onPress={() => setCount(0)} />
				</layoutContainer>
				<layoutContainer
					layout={{ ...tw`flex-row gap-3`, alignItems: 'center' }}
				>
					<Button text='Atacar' variant='small' onPress={() => {}} />
					<Button text='Defender' variant='small' onPress={() => {}} />
					<Button text='Huir' variant='small' onPress={() => {}} />
				</layoutContainer>
			</layoutContainer>
		</Panel>
	)
}

// ─── Root Screen — 3×3 grid, landscape ───────────────────────────────────────
//
//  Col 0       Col 1       Col 2
//  Login       Stats       Class      ← row 0
//  Settings    Gender      Inventory  ← row 1
//  Counter     (empty)     (empty)    ← row 2
//

export const LayoutDemoScreen: FC = () => {
	const totalW = CELL_W * 3 + GAP * 2
	const totalH = CELL_H * 3 + GAP * 2

	return (
		<layoutContainer
			layout={{
				width: '100%',
				height: '100%',
				backgroundColor: Colors.backgroundDark,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<layoutContainer
				layout={{
					flexDirection: 'row',
					alignItems: 'flex-start',
					gap: GAP,
					width: totalW,
					height: totalH,
				}}
			>
				{/* Column 0 */}
				<layoutContainer
					layout={{ flexDirection: 'column', gap: GAP, width: CELL_W }}
				>
					<LoginPanel />
					<SettingsPanel />
					<CounterPanel />
				</layoutContainer>

				{/* Column 1 */}
				<layoutContainer
					layout={{ flexDirection: 'column', gap: GAP, width: CELL_W }}
				>
					<StatsPanel />
					<GenderPanel />
				</layoutContainer>

				{/* Column 2 */}
				<layoutContainer
					layout={{ flexDirection: 'column', gap: GAP, width: CELL_W }}
				>
					<ClassPanel />
					<InventoryPanel />
				</layoutContainer>
			</layoutContainer>
		</layoutContainer>
	)
}
