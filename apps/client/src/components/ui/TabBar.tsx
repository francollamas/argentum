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
const TAB_MIN_HEIGHT = 38
const TAB_PADDING_X = 14
const TAB_PADDING_Y = 8

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
	const defaultTexture = useUITexture('button-main-normal')
	const hoverTexture = useUITexture('button-main-hover')
	const pressedTexture = useUITexture('button-main-pressed')
	const { containerRefCallback, setTexture } = useNineSliceBackground({
		texture: defaultTexture,
		sliceSize: TAB_SLICE_SIZE,
	})

	const currentTexture = isActive
		? pressedTexture
		: isPressed
			? pressedTexture
			: isHovered
				? hoverTexture
				: defaultTexture

	useEffect(() => {
		setTexture(currentTexture)
	}, [currentTexture, setTexture])

	return (
		<layoutContainer
			ref={containerRefCallback}
			layout={{
				...tw`items-center justify-center`,
				minHeight: TAB_MIN_HEIGHT,
				paddingLeft: TAB_PADDING_X,
				paddingRight: TAB_PADDING_X,
				paddingTop: TAB_PADDING_Y,
				paddingBottom: TAB_PADDING_Y,
				flexGrow: 1,
				flexShrink: 1,
				flexBasis: 0,
				minWidth: 0,
			}}
			alpha={disabled ? 0.5 : isActive ? 1 : 0.92}
			{...pressableProps}
		>
			<pixiBitmapText
				text={label}
				style={{
					fontFamily: FONTS.buttonSm.fontFamily,
					fontSize: FONTS.buttonSm.fontSize,
					fill: isActive ? Colors.gold : 0xffffff,
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
				...tw`w-full flex-row items-stretch`,
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
