import { extend } from '@pixi/react'
import { FancyButton } from '@pixi/ui'
import { BitmapText, Container, NineSliceSprite, Texture } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container })

type ButtonProps = {
	text: string
	x: number
	y: number
	width?: number
	height?: number
	onPress?: () => void
	textColor?: number
}

const BUTTON_STYLE = {
	fontFamily: 'opensans',
	fontSize: 32,
	sliceSize: 14,
	scale: 0.45,
	horizontalPaddingRatio: 0.5,
	verticalPaddingRatio: 0.4,
	minHorizontalPadding: 14,
	minVerticalPadding: 10,
}

export const Button: FC<ButtonProps> = ({
	text,
	x,
	y,
	width,
	height,
	onPress,
	textColor = 0xffffff,
}) => {
	const containerRef = useRef<Container | null>(null)

	const defaultTexture = useUITexture('button-main-normal')
	const hoverTexture = useUITexture('button-main-hover')
	const pressedTexture = useUITexture('button-main-pressed')

	useEffect(() => {
		if (!containerRef.current) return

		const horizontalPadding = Math.max(
			defaultTexture.height * BUTTON_STYLE.horizontalPaddingRatio,
			BUTTON_STYLE.minHorizontalPadding,
		)
		const verticalPaddingValue = Math.max(
			defaultTexture.height * BUTTON_STYLE.verticalPaddingRatio,
			BUTTON_STYLE.minVerticalPadding,
		)

		const buttonText = new BitmapText({
			text,
			style: {
				fontFamily: BUTTON_STYLE.fontFamily,
				fontSize: BUTTON_STYLE.fontSize,
				fill: textColor,
			},
		})
		buttonText.anchor.set(0.5)
		buttonText.roundPixels = true

		const buttonWidth =
			Math.max(
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
				leftWidth: BUTTON_STYLE.sliceSize,
				topHeight: BUTTON_STYLE.sliceSize,
				rightWidth: BUTTON_STYLE.sliceSize,
				bottomHeight: BUTTON_STYLE.sliceSize,
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
			scale: BUTTON_STYLE.scale,
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
	])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
