import { tw } from '@pixi/layout/tailwind'
import type { Container } from 'pixi.js'
import type { FC } from 'react'
import { useCallback, useRef, useState } from 'react'
import { usePressableState } from '../../hooks/usePressableState'
import { Colors } from './colors'
import { WrappedLabel } from './WrappedLabel'

type ListItem = {
	text: string
}

type ListProps = {
	items: ListItem[]
	selectedIndex?: number | null
	onChange?: (selectedIndex: number) => void
	itemHeight?: number
	itemTextWidth?: number
	disabled?: boolean
	layout?: Record<string, unknown>
}

type SelectableListItemProps = {
	text: string
	selected: boolean
	disabled: boolean
	itemHeight?: number
	itemTextWidth: number
	onPress?: () => void
}

const DEFAULT_ITEM_MIN_HEIGHT = 44
const ITEM_HORIZONTAL_PADDING = 14
const ITEM_VERTICAL_PADDING = 10
const ITEM_GAP = 0
const NORMAL_ROW_COLOR = 0x241713
const HOVER_ROW_COLOR = 0x31211b
const SELECTED_ROW_COLOR = 0x4d372c
const DEFAULT_ITEM_TEXT_WIDTH = 300

type LayoutNode = Container & {
	layout?: {
		computedLayout?: {
			width: number
		}
	}
}

const SelectableListItem: FC<SelectableListItemProps> = ({
	text,
	selected,
	disabled,
	itemHeight,
	itemTextWidth,
	onPress,
}) => {
	const [measuredTextWidth, setMeasuredTextWidth] = useState(itemTextWidth)
	const contentNodeRef = useRef<LayoutNode | null>(null)
	const contentRef = useCallback(
		(node: LayoutNode | null) => {
			const previousNode = contentNodeRef.current

			if (previousNode) {
				previousNode.off('layout', handleLayout)
			}

			contentNodeRef.current = node

			if (node) {
				node.on('layout', handleLayout)
				handleLayout()
			}

			function handleLayout() {
				if (itemTextWidth != null) {
					return
				}

				const width = node?.layout?.computedLayout?.width
				if (width == null || width <= 0) {
					return
				}

				setMeasuredTextWidth((currentWidth) =>
					currentWidth === width ? currentWidth : width,
				)
			}
		},
		[itemTextWidth],
	)
	const { isHovered, ...pressableProps } = usePressableState({
		disabled,
		onPress: selected ? undefined : onPress,
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
	const resolvedTextWidth =
		itemTextWidth ?? measuredTextWidth ?? DEFAULT_ITEM_TEXT_WIDTH

	return (
		<layoutContainer
			layout={{
				...tw`w-full`,
				alignSelf: 'stretch',
				minWidth: 0,
				minHeight: itemHeight ?? DEFAULT_ITEM_MIN_HEIGHT,
				...(itemHeight != null ? { height: itemHeight } : {}),
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
				ref={contentRef}
				layout={{
					...tw`w-full`,
					minWidth: 0,
				}}
			>
				<WrappedLabel
					text={text}
					width={resolvedTextWidth}
					font='bodySm'
					color={textColor}
					align='center'
				/>
			</layoutContainer>
		</layoutContainer>
	)
}

export const List: FC<ListProps> = ({
	items,
	selectedIndex = null,
	onChange,
	itemHeight,
	itemTextWidth,
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
					itemHeight={itemHeight}
					itemTextWidth={itemTextWidth}
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
