import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import {
	MAX_WORLD_ZOOM,
	MIN_WORLD_ZOOM,
	WORLD_ZOOM_STEP,
} from '../../constants/viewport'
import { useFPS } from '../../hooks/useFPS'
import { usePlayerPosition } from '../../hooks/usePlayer'
import {
	type MovementDirection,
	useDirectionalPlayerMovement,
} from '../../hooks/usePlayerMovement'
import { useViewportStore } from '../../store/viewportStore'
import {
	ArrowButton,
	ArrowSelector,
	Button,
	Colors,
	Label,
	Panel,
	Slider,
} from '../ui'

const HOLD_POLLING_INTERVAL = 16
const MOVEMENT_BUTTON_SIZE = 68
const MOVEMENT_BUTTON_GAP = 4
const MAP_COUNT = 290

const MAP_SELECTOR_ITEMS = Array.from({ length: MAP_COUNT }, (_, index) => ({
	text: `Map ${(index + 1).toString().padStart(3, '0')}`,
}))

type MapHudProps = {
	onBack: () => void
	mapNumber: number
	onMapNumberChange: (mapNumber: number) => void
}

export const MapHud: FC<MapHudProps> = ({
	onBack,
	mapNumber,
	onMapNumberChange,
}) => {
	const { setWorldZoom, worldZoom } = useViewportStore(
		useShallow((state) => ({
			setWorldZoom: state.setWorldZoom,
			worldZoom: state.worldZoom,
		})),
	)
	const fps = useFPS()
	const { tileX, tileY } = usePlayerPosition()
	const { moveInDirection } = useDirectionalPlayerMovement()
	const movementIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
		null,
	)
	const positionText = `[${tileX.toString().padStart(2, '0')} ; ${tileY
		.toString()
		.padStart(2, '0')}]`
	const selectedMapIndex = mapNumber - 1

	const stopHeldMovement = useCallback(() => {
		if (movementIntervalRef.current) {
			clearInterval(movementIntervalRef.current)
			movementIntervalRef.current = null
		}
	}, [])

	const startHeldMovement = useCallback(
		(direction: MovementDirection) => {
			stopHeldMovement()
			moveInDirection(direction)
			movementIntervalRef.current = setInterval(() => {
				moveInDirection(direction)
			}, HOLD_POLLING_INTERVAL)
		},
		[moveInDirection, stopHeldMovement],
	)

	useEffect(() => stopHeldMovement, [stopHeldMovement])

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
						maxWidth: '42%',
						minWidth: 180,
					}}
				>
					<Button text='Back' variant='small' onPress={onBack} />
					<layoutContainer
						layout={{
							...tw`items-center`,
							width: 260,
							maxWidth: '100%',
						}}
					>
						<ArrowSelector
							items={MAP_SELECTOR_ITEMS}
							selectedIndex={selectedMapIndex}
							onChange={(selectedIndex) => onMapNumberChange(selectedIndex + 1)}
							size={54}
							gap={2}
							layout={{
								width: 260,
								maxWidth: '100%',
								minWidth: 180,
							}}
						/>
					</layoutContainer>
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
							...tw`w-full flex-col gap-1`,
							maxWidth: 260,
						}}
					>
						<Slider
							value={worldZoom}
							min={MIN_WORLD_ZOOM}
							max={MAX_WORLD_ZOOM}
							step={WORLD_ZOOM_STEP}
							onChange={setWorldZoom}
							layout={{ width: '100%' }}
						/>
						<Label
							text={`${MIN_WORLD_ZOOM.toFixed(2)}x - ${MAX_WORLD_ZOOM.toFixed(2)}x`}
							font='labelSm'
							color={Colors.bronze}
						/>
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
						...tw`flex-col items-start gap-3`,
					}}
				>
					<layoutContainer
						layout={{
							...tw`flex-col`,
							gap: MOVEMENT_BUTTON_GAP,
						}}
					>
						<layoutContainer
							layout={{
								...tw`items-center`,
								alignSelf: 'center',
							}}
						>
							<ArrowButton
								direction='up'
								size={MOVEMENT_BUTTON_SIZE}
								onPressStart={() => startHeldMovement('up')}
								onPressEnd={stopHeldMovement}
							/>
						</layoutContainer>
						<layoutContainer
							layout={{
								...tw`flex-row items-center`,
								gap: MOVEMENT_BUTTON_GAP,
							}}
						>
							<ArrowButton
								direction='left'
								size={MOVEMENT_BUTTON_SIZE}
								onPressStart={() => startHeldMovement('left')}
								onPressEnd={stopHeldMovement}
							/>
							<layoutContainer
								layout={{
									width: MOVEMENT_BUTTON_SIZE,
									height: MOVEMENT_BUTTON_SIZE,
								}}
							/>
							<ArrowButton
								direction='right'
								size={MOVEMENT_BUTTON_SIZE}
								onPressStart={() => startHeldMovement('right')}
								onPressEnd={stopHeldMovement}
							/>
						</layoutContainer>
						<layoutContainer
							layout={{
								...tw`items-center`,
								alignSelf: 'center',
							}}
						>
							<ArrowButton
								direction='down'
								size={MOVEMENT_BUTTON_SIZE}
								onPressStart={() => startHeldMovement('down')}
								onPressEnd={stopHeldMovement}
							/>
						</layoutContainer>
					</layoutContainer>
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
