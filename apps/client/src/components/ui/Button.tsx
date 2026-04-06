import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

type ButtonVariant = 'normal' | 'small'

type ButtonProps = {
	text: string
	width?: number
	height?: number
	onPress?: () => void
	textColor?: number
	variant?: ButtonVariant
	disabled?: boolean
	layoutStyle?: Record<string, unknown>
}

type ButtonStyleConfig = {
	sliceSize: number
	fontType: 'button' | 'buttonSm'
	paddingH: number
	paddingV: number
}

const BUTTON_STYLES: Record<ButtonVariant, ButtonStyleConfig> = {
	normal: {
		sliceSize: 14,
		fontType: 'button',
		paddingH: 16,
		paddingV: 8,
	},
	small: {
		sliceSize: 14,
		fontType: 'buttonSm',
		paddingH: 12,
		paddingV: 6,
	},
}

export const Button: FC<ButtonProps> = ({
	text,
	width,
	height,
	onPress,
	textColor = 0xffffff,
	variant = 'normal',
	disabled = false,
	layoutStyle,
}) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isPressed, setIsPressed] = useState(false)

	const defaultTexture = useUITexture('button-main-normal')
	const hoverTexture = useUITexture('button-main-hover')
	const pressedTexture = useUITexture('button-main-pressed')

	const style = BUTTON_STYLES[variant]
	const fontConfig = FONTS[style.fontType]

	const currentTexture =
		disabled || isPressed
			? pressedTexture
			: isHovered
				? hoverTexture
				: defaultTexture

	return (
		<layoutContainer
			layout={{
				...tw`items-center justify-center`,
				...(width != null ? { width } : {}),
				...(height != null ? { height } : {}),
				paddingLeft: style.paddingH,
				paddingRight: style.paddingH,
				paddingTop: style.paddingV,
				paddingBottom: style.paddingV,
				...layoutStyle,
			}}
			eventMode={disabled ? 'none' : 'static'}
			cursor={disabled ? 'default' : 'pointer'}
			alpha={disabled ? 0.5 : 1}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => {
				setIsHovered(false)
				setIsPressed(false)
			}}
			onPointerDown={() => setIsPressed(true)}
			onPointerUp={() => {
				setIsPressed(false)
				if (isHovered && onPress) {
					onPress()
				}
			}}
		>
			<pixiNineSliceSprite
				texture={currentTexture}
				leftWidth={style.sliceSize}
				topHeight={style.sliceSize}
				rightWidth={style.sliceSize}
				bottomHeight={style.sliceSize}
				layout={{
					position: 'absolute',
					width: '100%',
					height: '100%',
				}}
			/>
			<pixiBitmapText
				text={text}
				style={{
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize,
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
