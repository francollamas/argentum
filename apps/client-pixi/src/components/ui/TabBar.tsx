import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useEffect } from 'react'
import { FONTS } from '../../config/typography'
import { useNineSliceBackground } from '../../hooks/useNineSliceBackground'
import { usePressableState } from '../../hooks/usePressableState'
import { useUITexture } from '../../hooks/useUITexture'
import { Colors } from './colors'

type TabBarItem = {
	label: string
}

type TabBarProps = {
	tabs: TabBarItem[]
	activeIndex: number
	onChange?: (index: number) => void
	gap?: number
	layout?: Record<string, unknown>
	disabled?: boolean
}

type TabButtonProps = {
	label: string
	isActive: boolean
	onPress?: () => void
	disabled?: boolean
}

const TAB_SLICE_SIZE = 14
const TAB_HEIGHT = 38
const TAB_PADDING_X = 16
const TAB_PADDING_Y = 6

const TabButton: FC<TabButtonProps> = ({
	label,
	isActive,
	onPress,
	disabled = false,
}) => {
	const { isHovered, isPressed, ...pressableProps } = usePressableState({
		disabled,
		onPress,
	})
	const defaultTexture = useUITexture('tab-normal')
	const hoverTexture = useUITexture('tab-hover')
	const activeTexture = useUITexture('tab-active')
	const { containerRefCallback, setTexture } = useNineSliceBackground({
		texture: defaultTexture,
		sliceSize: TAB_SLICE_SIZE,
	})
	const currentTexture = isActive
		? activeTexture
		: isPressed
			? activeTexture
			: isHovered
				? hoverTexture
				: defaultTexture
	const textColor = disabled
		? Colors.disabled
		: isActive
			? Colors.gold
			: isHovered
				? Colors.metalHighlight
				: Colors.silver

	useEffect(() => {
		setTexture(currentTexture)
	}, [currentTexture, setTexture])

	return (
		<layoutContainer
			ref={containerRefCallback}
			layout={{
				...tw`items-center justify-center`,
				height: TAB_HEIGHT,
				paddingLeft: TAB_PADDING_X,
				paddingRight: TAB_PADDING_X,
				paddingTop: TAB_PADDING_Y,
				paddingBottom: TAB_PADDING_Y,
				flexGrow: 1,
				flexShrink: 1,
				flexBasis: 0,
				minWidth: 0,
			}}
			alpha={disabled ? 0.5 : 1}
			{...pressableProps}
		>
			<pixiBitmapText
				text={label}
				style={{
					fontFamily: FONTS.buttonSm.fontFamily,
					fontSize: FONTS.buttonSm.fontSize,
					fill: textColor,
				}}
				layout={{
					width: 'intrinsic',
					height: 'intrinsic',
					flexShrink: 0,
				}}
				roundPixels
			/>
		</layoutContainer>
	)
}

export const TabBar: FC<TabBarProps> = ({
	tabs,
	activeIndex,
	onChange,
	gap = 10,
	layout,
	disabled = false,
}) => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full flex-row items-center`,
				alignSelf: 'stretch',
				gap,
				...layout,
			}}
		>
			{tabs.map((tab, index) => (
				<TabButton
					key={tab.label}
					label={tab.label}
					isActive={index === activeIndex}
					disabled={disabled}
					onPress={
						disabled || index === activeIndex
							? undefined
							: () => onChange?.(index)
					}
				/>
			))}
		</layoutContainer>
	)
}
