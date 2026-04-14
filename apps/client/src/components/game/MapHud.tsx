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
						maxWidth: '60%',
						minWidth: 260,
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
						...tw`flex-col items-end gap-2`,
						alignSelf: 'flex-start',
						maxWidth: '100%',
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
						<Label text='Zoom controls' font='labelSm' color={Colors.silver} />
					</layoutContainer>
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
					<Button text='Inventory' variant='small' onPress={() => {}} />
					<Button text='Spells' variant='small' onPress={() => {}} />
				</layoutContainer>
				<layoutContainer
					layout={{
						...tw`flex-col gap-1`,
						padding: 12,
						backgroundColor: Colors.backgroundDark,
						borderRadius: 8,
						alignItems: 'flex-end',
					}}
				>
					<Label
						text='HUD overlays the world'
						font='labelSm'
						color={Colors.silver}
					/>
					<Label text='Resize-safe layout' font='label' color={Colors.gold} />
				</layoutContainer>
			</layoutContainer>
		</layoutContainer>
	)
}
