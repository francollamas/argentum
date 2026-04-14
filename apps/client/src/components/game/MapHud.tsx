import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useViewportStore } from '../../store/viewportStore'
import { Button, Colors, Label } from '../ui'

type MapHudProps = {
	onBack: () => void
}

export const MapHud: FC<MapHudProps> = ({ onBack }) => {
	const resetWorldZoom = useViewportStore((state) => state.resetWorldZoom)
	const worldZoom = useViewportStore((state) => state.worldZoom)
	const zoomIn = useViewportStore((state) => state.zoomIn)
	const zoomOut = useViewportStore((state) => state.zoomOut)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full`,
				padding: 24,
			}}
		>
			<layoutContainer
				layout={{
					...tw`absolute top-0 left-0 flex-row items-start gap-3`,
				}}
			>
				<Button text='Back' variant='small' onPress={onBack} />
				<layoutContainer
					layout={{
						...tw`flex-col gap-1`,
						padding: 12,
						backgroundColor: Colors.backgroundDark,
						borderRadius: 8,
					}}
				>
					<Label text='Map Demo' font='titleSm' color={Colors.gold} />
					<Label
						text='Arrow keys move the player state'
						font='label'
						color={Colors.silver}
					/>
				</layoutContainer>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`absolute top-0 right-0 flex-col items-end gap-2`,
				}}
			>
				<layoutContainer
					layout={{
						...tw`flex-col gap-1`,
						padding: 12,
						backgroundColor: Colors.backgroundDark,
						borderRadius: 8,
					}}
				>
					<Label
						text={`Zoom: ${worldZoom.toFixed(2)}x`}
						font='label'
						color={Colors.metalHighlight}
					/>
					<Label
						text='Programmatic controls land next'
						font='labelSm'
						color={Colors.silver}
					/>
				</layoutContainer>
				<layoutContainer layout={tw`flex-row gap-2`}>
					<Button text='Zoom -' variant='small' onPress={zoomOut} />
					<Button text='Reset' variant='small' onPress={resetWorldZoom} />
					<Button text='Zoom +' variant='small' onPress={zoomIn} />
				</layoutContainer>
			</layoutContainer>

			<layoutContainer
				layout={{
					...tw`absolute bottom-0 left-0 flex-row items-end gap-2`,
				}}
			>
				<Button text='Inventory' variant='small' onPress={() => {}} />
				<Button text='Spells' variant='small' onPress={() => {}} />
			</layoutContainer>
		</layoutContainer>
	)
}
