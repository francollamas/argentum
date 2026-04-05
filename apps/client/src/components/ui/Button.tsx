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
	scale: number
	sliceSize: number
	fontType: 'button' | 'buttonSmall'
	paddingH: number
	paddingV: number
}

const BUTTON_STYLES: Record<ButtonVariant, ButtonStyleConfig> = {
	normal: {
		scale: 0.45,
		sliceSize: 14,
		fontType: 'button',
		paddingH: 30,
		paddingV: 25,
	},
	small: {
		scale: 0.3,
		sliceSize: 14,
		fontType: 'buttonSmall',
		paddingH: 25,
		paddingV: 20,
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

	const { buttonWidth, buttonHeight, textX, textY } = useMemo(() => {
		const tempText = new BitmapText({
			text,
			style: {
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
			},
		})

		// width/height are in final (post-scale) pixels — convert to pre-scale space
		const minWidthPreScale = width != null ? Math.ceil(width / style.scale) : 0
		const minHeightPreScale =
			height != null ? Math.ceil(height / style.scale) : 0

		const buttonWidth = Math.max(
			Math.ceil(tempText.width + style.paddingH * 2),
			minWidthPreScale,
		)
		const buttonHeight = Math.max(
			defaultTexture.height,
			Math.ceil(tempText.height + style.paddingV * 2),
			minHeightPreScale,
		)

		// Center text manually — avoids depending on flexbox + scale interaction
		const textX = Math.round((buttonWidth - tempText.width) / 2)
		const textY = Math.round((buttonHeight - tempText.height) / 2)

		tempText.destroy()

		return { buttonWidth, buttonHeight, textX, textY }
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
			eventMode='static'
			cursor='pointer'
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
			}}
		>
			<pixiNineSliceSprite
				texture={currentTexture}
				leftWidth={style.sliceSize}
				topHeight={style.sliceSize}
				rightWidth={style.sliceSize}
				bottomHeight={style.sliceSize}
				width={buttonWidth}
				height={buttonHeight}
			/>
			<pixiBitmapText
				x={textX}
				y={textY}
				text={text}
				style={{
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize,
					fill: textColor,
				}}
				roundPixels
			/>
		</pixiContainer>
	)
}
