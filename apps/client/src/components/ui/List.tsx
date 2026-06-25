import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { usePressableState } from '../../hooks/usePressableState'
import { Colors } from './colors'
import { Label } from './Label'
import { useScrollGestureContext } from './ScrollGestureContext'

type ListItem = {
	text: string
}

type ListProps = {
	items: ListItem[]
	selectedIndex?: number | null
	onChange?: (selectedIndex: number) => void
	disabled?: boolean
	layout?: Record<string, unknown>
}

type SelectableListItemProps = {
	text: string
	selected: boolean
	disabled: boolean
	onPress?: () => void
}

const DEFAULT_ITEM_MIN_HEIGHT = 44
const ITEM_HORIZONTAL_PADDING = 14
const ITEM_VERTICAL_PADDING = 10
const ITEM_GAP = 0
const NORMAL_ROW_COLOR = 0x241713
const HOVER_ROW_COLOR = 0x31211b
const SELECTED_ROW_COLOR = 0x4d372c

const SelectableListItem: FC<SelectableListItemProps> = ({
	text,
	selected,
	disabled,
	onPress,
}) => {
	const { shouldCancelTap } = useScrollGestureContext()
	const { isHovered, ...pressableProps } = usePressableState({
		disabled,
		onPress:
			selected || !onPress
				? undefined
				: () => {
						if (!shouldCancelTap()) {
							onPress()
						}
					},
	})

	const backgroundColor = selected
		? SELECTED_ROW_COLOR
		: isHovered
			? HOVER_ROW_COLOR
			: NORMAL_ROW_COLOR
	const textColor = disabled
		? Colors.disabled
		: selected
			? Colors.metalHighlight
			: Colors.silver

	return (
		<layoutContainer
			layout={{
				...tw`w-full`,
				alignSelf: 'stretch',
				minWidth: 0,
				minHeight: DEFAULT_ITEM_MIN_HEIGHT,
				paddingLeft: ITEM_HORIZONTAL_PADDING,
				paddingRight: ITEM_HORIZONTAL_PADDING,
				paddingTop: ITEM_VERTICAL_PADDING,
				paddingBottom: ITEM_VERTICAL_PADDING,
				justifyContent: 'center',
				backgroundColor,
			}}
			alpha={disabled ? 0.45 : 1}
			{...pressableProps}
		>
			<layoutContainer
				layout={{
					...tw`w-full`,
					minWidth: 0,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				eventMode='none'
			>
				<Label text={text} font='bodySm' color={textColor} />
			</layoutContainer>
		</layoutContainer>
	)
}

export const List: FC<ListProps> = ({
	items,
	selectedIndex = null,
	onChange,
	disabled = false,
	layout,
}) => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full flex-col`,
				alignSelf: 'stretch',
				minWidth: 0,
				gap: ITEM_GAP,
				...layout,
			}}
		>
			{items.map((item, index) => (
				<SelectableListItem
					key={item.text}
					text={item.text}
					selected={selectedIndex === index}
					disabled={disabled}
					onPress={() => {
						if (selectedIndex === index) {
							return
						}
						onChange?.(index)
					}}
				/>
			))}
		</layoutContainer>
	)
}
