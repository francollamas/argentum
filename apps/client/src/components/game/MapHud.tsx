import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useFPS } from '../../hooks/useFPS'
import { usePlayerPosition } from '../../hooks/usePlayer'
import { useViewportStore } from '../../store/viewportStore'
import { Button, Colors, Label, Panel } from '../ui'

type MapHudProps = {
	onBack: () => void
}

export const MapHud: FC<MapHudProps> = ({ onBack }) => {
	const { resetWorldZoom, worldZoom, zoomIn, zoomOut } = useViewportStore(
		useShallow((state) => ({
			resetWorldZoom: state.resetWorldZoom,
			worldZoom: state.worldZoom,
			zoomIn: state.zoomIn,
			zoomOut: state.zoomOut,
		})),
	)
	const fps = useFPS()
	const { tileX, tileY } = usePlayerPosition()
	const positionText = `[${tileX.toString().padStart(2, '0')} ; ${tileY
		.toString()
		.padStart(2, '0')}]`

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col justify-between`,
				padding: 24,
				gap: 16,
			}}
		>
			<layoutContainer
				layout={{
					...tw`w-full flex-row justify-between items-start flex-wrap`,
					columnGap: 16,
					rowGap: 12,
				}}
			>
				<layoutContainer
					layout={{
						...tw`flex-row items-start gap-3`,
						flexWrap: 'wrap',
						maxWidth: '58%',
						minWidth: 260,
					}}
				>
					<Button text='Back' variant='small' onPress={onBack} />
					<Panel layout={{ ...tw`flex-col gap-1`, padding: 12 }}>
						<Label text='Map Demo' font='titleSm' color={Colors.gold} />
						<Label
							text='Arrow keys move the player state'
							font='label'
							color={Colors.silver}
						/>
						<Label
							text='Center stays clear so the map remains visible'
							font='labelSm'
							color={Colors.bronze}
						/>
					</Panel>
					<Panel layout={{ ...tw`flex-col gap-1`, padding: 12 }}>
						<Label
							text='Region: Town Center'
							font='label'
							color={Colors.gold}
						/>
						<Label
							text='Weather: Clear skies'
							font='labelSm'
							color={Colors.silver}
						/>
						<Label
							text='Mode: Exploration'
							font='labelSm'
							color={Colors.silver}
						/>
					</Panel>
				</layoutContainer>
				<layoutContainer
					layout={{
						...tw`flex-col items-end gap-2`,
						alignSelf: 'flex-start',
						minWidth: 220,
						maxWidth: '100%',
					}}
				>
					<Panel layout={{ ...tw`flex-col gap-1`, padding: 12 }}>
						<Label
							text={`Zoom: ${worldZoom.toFixed(2)}x`}
							font='label'
							color={Colors.metalHighlight}
						/>
						<Label text={`FPS: ${fps}`} font='labelSm' color={Colors.silver} />
						<Label
							text={`Pos: ${positionText}`}
							font='labelSm'
							color={Colors.bronze}
						/>
					</Panel>
					<layoutContainer
						layout={{
							...tw`flex-row gap-2`,
							flexWrap: 'wrap',
							justifyContent: 'flex-end',
						}}
					>
						<Button text='Zoom -' variant='small' onPress={zoomOut} />
						<Button text='Reset' variant='small' onPress={resetWorldZoom} />
						<Button text='Zoom +' variant='small' onPress={zoomIn} />
					</layoutContainer>
				</layoutContainer>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row justify-between items-stretch`,
					flex: 1,
					columnGap: 16,
				}}
			>
				<layoutContainer
					layout={{
						...tw`flex-col gap-2`,
						justifyContent: 'center',
						minWidth: 120,
						maxWidth: 160,
					}}
				>
					<Button text='Inventory' variant='small' onPress={() => {}} />
					<Button text='Spells' variant='small' onPress={() => {}} />
					<Button text='Party' variant='small' onPress={() => {}} />
					<Button text='Map' variant='small' onPress={() => {}} />
					<Button text='Craft' variant='small' onPress={() => {}} />
				</layoutContainer>

				<layoutContainer layout={{ flex: 1 }} />

				<layoutContainer
					layout={{
						...tw`flex-col gap-3`,
						justifyContent: 'center',
						alignItems: 'flex-end',
						minWidth: 220,
						maxWidth: 280,
					}}
				>
					<Panel layout={{ ...tw`flex-col items-end gap-1`, padding: 12 }}>
						<Label text='Session' font='label' color={Colors.gold} />
						<Label
							text='Players nearby: 3'
							font='labelSm'
							color={Colors.silver}
						/>
						<Label text='Music: On' font='labelSm' color={Colors.silver} />
						<Label
							text='Latency: Stable'
							font='labelSm'
							color={Colors.bronze}
						/>
					</Panel>
					<Panel layout={{ ...tw`flex-col items-end gap-1`, padding: 12 }}>
						<Label text='Tips' font='label' color={Colors.gold} />
						<Label text='Arrows move' font='labelSm' color={Colors.silver} />
						<Label
							text='Zoom buttons adjust camera'
							font='labelSm'
							color={Colors.silver}
						/>
						<Label
							text='Map stays clear in the center'
							font='labelSm'
							color={Colors.bronze}
						/>
					</Panel>
				</layoutContainer>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`w-full flex-row justify-between items-end flex-wrap`,
					columnGap: 16,
					rowGap: 12,
				}}
			>
				<layoutContainer
					layout={{
						...tw`flex-row gap-2`,
						flexWrap: 'wrap',
					}}
				>
					<Button text='Quests' variant='small' onPress={() => {}} />
					<Button text='Skills' variant='small' onPress={() => {}} />
					<Button text='Config' variant='small' onPress={() => {}} />
				</layoutContainer>
				<Panel layout={{ ...tw`flex-col items-end gap-1`, padding: 12 }}>
					<Label
						text='HUD wraps on resize'
						font='labelSm'
						color={Colors.silver}
					/>
					<Label
						text='Edges stay informative'
						font='labelSm'
						color={Colors.silver}
					/>
					<Label
						text='Center remains map-first'
						font='label'
						color={Colors.gold}
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
