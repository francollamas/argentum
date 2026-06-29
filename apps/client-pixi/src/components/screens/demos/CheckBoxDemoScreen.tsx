import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Button, CheckBox, Colors, Label, Panel } from '../../ui'

export const CheckBoxDemoScreen: FC = () => {
	const [equippedSword, setEquippedSword] = useState(true)
	const [storedShield, setStoredShield] = useState(false)
	const [showNames, setShowNames] = useState(false)
	const [selectedClass, setSelectedClass] = useState(1)
	const [iconOnlyA, setIconOnlyA] = useState(true)
	const [iconOnlyB, setIconOnlyB] = useState(false)
	const [iconOnlyRadio, setIconOnlyRadio] = useState(true)
	const [showNamesCompact, setShowNamesCompact] = useState(true)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='CheckBox Demo' font='title' color={Colors.gold} />
				<Label
					text='Normalized 36px controls with layout-driven icon and label alignment'
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
					<Label text='Checkbox States' font='titleSm' color={Colors.gold} />
					<CheckBox
						checked={equippedSword}
						onChange={setEquippedSword}
						text='Espada de hierro equipada'
					/>
					<CheckBox
						checked={storedShield}
						onChange={setStoredShield}
						text='Escudo de madera guardado'
					/>
					<CheckBox
						checked={showNames}
						onChange={setShowNames}
						text='Mostrar nombres'
					/>
					<CheckBox checked text='Sincronizacion activa' />
				</Panel>

				<Panel layout={{ width: 320, gap: 12 }}>
					<Label text='Radio Variant' font='titleSm' color={Colors.gold} />
					<CheckBox
						variant='radio'
						checked={selectedClass === 0}
						onChange={() => setSelectedClass(0)}
						text='Guerrero'
					/>
					<CheckBox
						variant='radio'
						checked={selectedClass === 1}
						onChange={() => setSelectedClass(1)}
						text='Mago'
					/>
					<CheckBox
						variant='radio'
						checked={selectedClass === 2}
						onChange={() => setSelectedClass(2)}
						text='Arquero'
					/>
				</Panel>

				<Panel layout={{ width: 360, gap: 16 }}>
					<Label
						text='Without Label + Mixed Layout'
						font='titleSm'
						color={Colors.gold}
					/>
					<layoutContainer layout={tw`flex-row items-center gap-4`}>
						<CheckBox checked={iconOnlyA} onChange={setIconOnlyA} />
						<CheckBox checked={iconOnlyB} onChange={setIconOnlyB} />
						<CheckBox
							variant='radio'
							checked={iconOnlyRadio}
							onChange={setIconOnlyRadio}
						/>
					</layoutContainer>
					<layoutContainer layout={tw`flex-row items-center justify-between`}>
						<CheckBox
							checked={showNamesCompact}
							onChange={setShowNamesCompact}
							text='Mostrar nombres'
						/>
						<Button text='Aplicar' variant='small' onPress={() => {}} />
					</layoutContainer>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
