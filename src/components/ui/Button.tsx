import { extend } from '@pixi/react'
import { FancyButton } from '@pixi/ui'
import { BitmapText, Container, NineSliceSprite } from 'pixi.js'
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

		const buttonText = new BitmapText({
			text,
			style: {
				fontFamily: 'opensans',
				fontSize: 36,
				fill: textColor,
			},
		})

		const horizontalPadding = 40

		const buttonWidth = width ?? buttonText.width + horizontalPadding
		const buttonHeight = height ?? defaultTexture.height

		const sliceSize = 16

		const defaultView = new NineSliceSprite({
			texture: defaultTexture,
			leftWidth: sliceSize,
			topHeight: sliceSize,
			rightWidth: sliceSize,
			bottomHeight: sliceSize,
			width: buttonWidth,
			height: buttonHeight,
		})

		const hoverView = new NineSliceSprite({
			texture: hoverTexture,
			leftWidth: sliceSize,
			topHeight: sliceSize,
			rightWidth: sliceSize,
			bottomHeight: sliceSize,
			width: buttonWidth,
			height: buttonHeight,
		})

		const pressedView = new NineSliceSprite({
			texture: pressedTexture,
			leftWidth: sliceSize,
			topHeight: sliceSize,
			rightWidth: sliceSize,
			bottomHeight: sliceSize,
			width: buttonWidth,
			height: buttonHeight,
		})

		buttonText.anchor.set(0.5)
		buttonText.x = buttonWidth / 2
		buttonText.y = buttonHeight / 2

		const fancyButton = new FancyButton({
			defaultView,
			hoverView,
			pressedView,
			text: buttonText,
			scale: 0.5
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
	}, [defaultTexture, hoverTexture, pressedTexture, width, height, text, textColor, onPress])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
