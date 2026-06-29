import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors, Label, Panel, Slider, WrappedLabel } from '../../ui'

export const SliderDemoScreen: FC = () => {
	const [volume, setVolume] = useState(68)
	const [musicBalance, setMusicBalance] = useState(2.5)
	const [zoom, setZoom] = useState(1)
	const [brightness, setBrightness] = useState(100)

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='Slider Demo' font='title' color={Colors.gold} />
				<WrappedLabel
					text='Nine-slice rail and fill with a draggable thumb, built to stretch cleanly inside panels.'
					width={720}
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
				<Panel layout={{ width: 460, gap: 14 }}>
					<Label text='Basic Range' font='titleSm' color={Colors.gold} />
					<Label
						text={`Volume: ${Math.round(volume)}`}
						font='label'
						color={Colors.metalHighlight}
					/>
					<Slider
						value={volume}
						min={0}
						max={100}
						step={10}
						onChange={setVolume}
						width={400}
					/>
					<WrappedLabel
						text='This one snaps in 10-point steps, like a traditional stepped slider.'
						width={400}
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>

				<Panel layout={{ width: 460, gap: 14 }}>
					<Label text='Different Ranges' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={{ ...tw`flex-col`, gap: 12 }}>
						<layoutContainer layout={{ ...tw`flex-col`, gap: 6 }}>
							<Label
								text={`Music Balance: ${musicBalance.toFixed(1)}`}
								font='label'
								color={Colors.metalHighlight}
							/>
							<Slider
								value={musicBalance}
								min={-5}
								max={5}
								onChange={setMusicBalance}
								width={400}
							/>
						</layoutContainer>
						<layoutContainer layout={{ ...tw`flex-col`, gap: 6 }}>
							<Label
								text={`Zoom: ${zoom.toFixed(2)}x`}
								font='label'
								color={Colors.metalHighlight}
							/>
							<Slider
								value={zoom}
								min={0.5}
								max={2}
								onChange={setZoom}
								width={400}
							/>
						</layoutContainer>
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 520, gap: 14 }}>
					<Label text='Stretch In Layout' font='titleSm' color={Colors.gold} />
					<Label
						text={`Brightness: ${Math.round(brightness)}%`}
						font='label'
						color={Colors.metalHighlight}
					/>
					<Slider
						value={brightness}
						min={0}
						max={100}
						onChange={setBrightness}
						layout={{ width: '100%' }}
					/>
					<WrappedLabel
						text='The control stretches with the panel width and keeps the thumb centered on the active value.'
						width={460}
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
