import { extend } from '@pixi/react'
import { FancyButton } from '@pixi/ui'
import { BitmapText, Container, NineSliceSprite, type Texture } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container })

type ButtonVariant = 'normal' | 'small'

type ButtonProps = {
	text: string
	x: number
	y: number
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
	const containerRef = useRef<Container | null>(null)

	const defaultTexture = useUITexture('button-main-normal')
	const hoverTexture = useUITexture('button-main-hover')
	const pressedTexture = useUITexture('button-main-pressed')

	useEffect(() => {
		if (!containerRef.current) return

		const style = BUTTON_STYLES[variant]

		const horizontalPadding = Math.max(
			defaultTexture.height * style.horizontalPaddingRatio,
			style.minHorizontalPadding,
		)
		const verticalPaddingValue = Math.max(
			defaultTexture.height * style.verticalPaddingRatio,
			style.minVerticalPadding,
		)

		const fontConfig = FONTS[style.fontType]

		const buttonText = new BitmapText({
			text,
			style: {
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
				fill: textColor,
			},
		})
		buttonText.anchor.set(0.5)
		buttonText.roundPixels = true

		const buttonWidth = Math.max(
			Math.ceil(buttonText.width + horizontalPadding * 2),
			width ?? 0,
		)
		const buttonHeight = Math.max(
			defaultTexture.height,
			Math.ceil(buttonText.height + verticalPaddingValue * 2),
			height ?? 0,
		)

		const createView = (texture: Texture) =>
			new NineSliceSprite({
				texture,
				leftWidth: style.sliceSize,
				topHeight: style.sliceSize,
				rightWidth: style.sliceSize,
				bottomHeight: style.sliceSize,
				width: buttonWidth,
				height: buttonHeight,
			})

		const defaultView = createView(defaultTexture)
		const hoverView = createView(hoverTexture)
		const pressedView = createView(pressedTexture)

		buttonText.x = buttonWidth / 2
		buttonText.y = buttonHeight / 2

		const fancyButton = new FancyButton({
			defaultView,
			hoverView,
			pressedView,
			text: buttonText,
			scale: style.scale,
		})

		if (onPress) {
			fancyButton.onPress.connect(onPress)
		}

		containerRef.current.addChild(fancyButton)

		return () => {
			if (onPress) {
				fancyButton.onPress.disconnect(onPress)
			}
			fancyButton.destroy()
		}
	}, [
		defaultTexture,
		height,
		hoverTexture,
		onPress,
		pressedTexture,
		text,
		textColor,
		width,
		variant,
	])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
