import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { Colors, IconButton, Label, Panel } from '../../ui'

const SQUARE_ICONS = [
	'checkbox-checked',
	'radio-checked',
	'arrow-up',
	'slider-thumb',
] as const

const CIRCLE_ICONS = [
	'checkbox-unchecked',
	'radio-unchecked',
	'arrow-right',
	'inventory-slot-normal',
] as const

export const IconButtonDemoScreen: FC = () => {
	const [selectedIcon, setSelectedIcon] = useState<string>('checkbox-checked')
	const [selectedGameIcon, setSelectedGameIcon] = useState<string>('6005')

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full flex-col items-center gap-6`,
				padding: 32,
			}}
		>
			<layoutContainer layout={tw`flex-col items-center gap-1`}>
				<Label text='IconButton Demo' font='title' color={Colors.gold} />
				<Label
					text='Sprite-based icon buttons with square and circular variants'
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
					<Label text='Square Buttons' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row flex-wrap justify-center`, gap: 16 }}
					>
						{SQUARE_ICONS.map((icon) => (
							<IconButton
								key={icon}
								icon={icon}
								size={64}
								onPress={() => setSelectedIcon(icon)}
							/>
						))}
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 420, gap: 16, alignItems: 'center' }}>
					<Label text='Circle Buttons' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row flex-wrap justify-center`, gap: 16 }}
					>
						{CIRCLE_ICONS.map((icon) => (
							<IconButton
								key={icon}
								icon={icon}
								shape='circle'
								size={64}
								onPress={() => setSelectedIcon(icon)}
							/>
						))}
					</layoutContainer>
				</Panel>

				<Panel layout={{ width: 420, gap: 16, alignItems: 'center' }}>
					<Label text='Sizes' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row items-end justify-center`, gap: 16 }}
					>
						<IconButton icon='arrow-up' size={56} />
						<IconButton icon='arrow-up' size={64} />
						<IconButton icon='arrow-up' size={72} shape='circle' />
					</layoutContainer>
					<Label
						text='The icon footprint is smaller now so the outer shape reads more clearly.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>

				<Panel layout={{ width: 420, gap: 16 }}>
					<Label text='Disabled State' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row items-center justify-center`, gap: 16 }}
					>
						<IconButton icon='radio-checked' disabled />
						<IconButton icon='radio-checked' shape='circle' disabled />
						<IconButton icon='radio-checked' shape='circle' />
					</layoutContainer>
					<Label
						text='Disabled buttons stay visible and ignore interaction.'
						font='bodySm'
						color={Colors.silver}
					/>
				</Panel>

				<Panel layout={{ width: 420, gap: 16 }}>
					<Label text='Game Sprites' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row items-center justify-center`, gap: 16 }}
					>
						<IconButton
							icon='6005'
							iconSource='game'
							size={72}
							onPress={() => setSelectedGameIcon('6005')}
						/>
						<IconButton
							icon='6005'
							iconSource='game'
							shape='circle'
							size={72}
							onPress={() => setSelectedGameIcon('6005')}
						/>
					</layoutContainer>
					<Label
						text={`Current game sprite id: ${selectedGameIcon}`}
						font='label'
						color={Colors.metalHighlight}
					/>
					<Label
						text='Game icons use the first texture frame returned by useSprite().'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>

				<Panel layout={{ width: 420, gap: 16 }}>
					<Label text='Last Selection' font='titleSm' color={Colors.gold} />
					<layoutContainer
						layout={{ ...tw`flex-row items-center justify-center`, gap: 16 }}
					>
						<IconButton icon={selectedIcon} shape='square' size={72} />
						<Label
							text={selectedIcon}
							font='label'
							color={Colors.metalHighlight}
						/>
					</layoutContainer>
					<Label
						text='The demo uses the current UI atlas textures as icon content to validate sizing and centering.'
						font='bodySm'
						color={Colors.silver}
						wrap
					/>
				</Panel>
			</layoutContainer>
		</layoutContainer>
	)
}
