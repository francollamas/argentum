import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { ArrowButton, Colors, Label, Panel } from '../../ui'

export const ArrowButtonDemoScreen: FC = () => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='ArrowButton Demo' font='title' color={Colors.gold} />
				<Label
					text='Directional sprite buttons with hover, pressed, and disabled states'
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
				<Panel layout={{ width: 320, gap: 16, alignItems: 'center' }}>
					<Label text='Directions' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={{ ...tw`flex-row items-center`, gap: 16 }}>
						<ArrowButton direction='up' />
						<ArrowButton direction='down' />
						<ArrowButton direction='left' />
						<ArrowButton direction='right' />
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 340, gap: 16, alignItems: 'center' }}>
					<Label text='Sizes' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={{ ...tw`flex-row items-end`, gap: 16 }}>
						<ArrowButton direction='left' size={28} />
						<ArrowButton direction='left' size={36} />
						<ArrowButton direction='left' size={48} />
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 360, gap: 16 }}>
					<Label text='Disabled State' font='titleSm' color={Colors.gold} />
					<layoutContainer layout={{ ...tw`flex-row items-center`, gap: 16 }}>
						<ArrowButton direction='left' disabled />
						<ArrowButton direction='right' />
					</layoutContainer>
					<Label
						text='Disabled arrows stay visible but ignore interaction.'
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
