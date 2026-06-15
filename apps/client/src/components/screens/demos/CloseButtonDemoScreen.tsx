import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { CloseButton, Colors, Label, Panel, WrappedLabel } from '../../ui'

export const CloseButtonDemoScreen: FC = () => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='CloseButton Demo' font='title' color={Colors.gold} />
				<Label
					text='Dedicated window close control with internal UI textures'
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
				<Panel layout={{ width: 420, gap: 16, alignItems: 'center' }}>
					<Label text='Default' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={tw`flex-row items-center justify-center`}>
						<CloseButton />
					</layoutContainer>
					<WrappedLabel
						text='Hover and press the button to validate the texture swap states.'
						width={340}
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>

				<Panel layout={{ width: 420, gap: 16, alignItems: 'center' }}>
					<Label text='Sizes' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row items-end justify-center`, gap: 16 }}
					>
						<CloseButton size={36} />
						<CloseButton size={48} />
						<CloseButton size={60} />
					</layoutContainer>
					<WrappedLabel
						text='The full button art scales with the requested size so the close glyph stays centered.'
						width={340}
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>

				<Panel layout={{ width: 420, gap: 16, alignItems: 'center' }}>
					<Label text='Disabled State' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row items-center justify-center`, gap: 16 }}
					>
						<CloseButton disabled />
						<CloseButton size={60} disabled />
					</layoutContainer>
					<Label
						text='Disabled buttons remain visible and ignore interaction.'
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
