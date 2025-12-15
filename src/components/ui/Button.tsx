import { extend } from '@pixi/react'
import { BitmapText, Container, NineSliceSprite } from 'pixi.js'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container, NineSliceSprite, BitmapText })

type ButtonVariant = 'normal' | 'small'

type ButtonProps = {
	text: string
	x?: number
	y?: number
	width?: number
	height?: number
	onPress?: () => void
	textColor?: number
	variant?: ButtonVariant
}

type ButtonStyleConfig = {
	sliceSize: number
	scale: number
	horizontalPaddingRatio: number
	verticalPaddingRatio: number
	minHorizontalPadding: number
	minVerticalPadding: number
	fontType: 'button' | 'buttonSmall'
}

const BUTTON_STYLES: Record<ButtonVariant, ButtonStyleConfig> = {
	normal: {
		sliceSize: 14,
		scale: 0.45,
		horizontalPaddingRatio: 0.3,
		verticalPaddingRatio: 0.25,
		minHorizontalPadding: 10,
		minVerticalPadding: 6,
		fontType: 'button',
	},
	small: {
		sliceSize: 14,
		scale: 0.3,
		horizontalPaddingRatio: 0.25,
		verticalPaddingRatio: 0.2,
		minHorizontalPadding: 8,
		minVerticalPadding: 5,
		fontType: 'buttonSmall',
	},
}

export const Button: FC<ButtonProps> = ({
	text,
	x,
	y,
	width,
	height,
	onPress,
	textColor = 0xffffff,
	variant = 'normal',
}) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isPressed, setIsPressed] = useState(false)

	const defaultTexture = useUITexture('button-main-normal')
	const hoverTexture = useUITexture('button-main-hover')
	const pressedTexture = useUITexture('button-main-pressed')

	const style = BUTTON_STYLES[variant]
	const fontConfig = FONTS[style.fontType]

	const { buttonWidth, buttonHeight } = useMemo(() => {
		const tempText = new BitmapText({
			text,
			style: {
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
			},
		})

		const horizontalPadding = Math.max(
			defaultTexture.height * style.horizontalPaddingRatio,
			style.minHorizontalPadding,
		)
		const verticalPadding = Math.max(
			defaultTexture.height * style.verticalPaddingRatio,
			style.minVerticalPadding,
		)

		const buttonWidth = Math.max(
			Math.ceil(tempText.width + horizontalPadding * 2),
			width ?? 0,
		)
		const buttonHeight = Math.max(
			defaultTexture.height,
			Math.ceil(tempText.height + verticalPadding * 2),
			height ?? 0,
		)

		tempText.destroy()

		return { buttonWidth, buttonHeight }
	}, [text, fontConfig, defaultTexture, style, width, height])

	const currentTexture = isPressed
		? pressedTexture
		: isHovered
			? hoverTexture
			: defaultTexture

	return (
		<pixiContainer
			x={x}
			y={y}
			scale={style.scale}
			eventMode="static"
			cursor="pointer"
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
			layout={{
				width: buttonWidth,
				height: buttonHeight,
				justifyContent: 'center',
				alignItems: 'center',
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
					top: 0,
					left: 0,
					width: buttonWidth,
					height: buttonHeight,
				}}
			/>
			<pixiBitmapText
				text={text}
				style={{
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize,
					fill: textColor,
				}}
				anchor={0.5}
				roundPixels
				layout={{
					width: 'intrinsic',
					height: 'intrinsic',
				}}
			/>
		</pixiContainer>
	)
}
