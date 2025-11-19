import { extend } from '@pixi/react'
import { FancyButton } from '@pixi/ui'
import { BitmapText, Container, Sprite } from 'pixi.js'
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

	const buttonWidth = width ?? defaultTexture.width
	const buttonHeight = height ?? defaultTexture.height

	useEffect(() => {
		if (!containerRef.current) return

		const defaultView = new Sprite(defaultTexture)
		defaultView.width = buttonWidth
		defaultView.height = buttonHeight

		const hoverView = new Sprite(hoverTexture)
		hoverView.width = buttonWidth
		hoverView.height = buttonHeight

		const pressedView = new Sprite(pressedTexture)
		pressedView.width = buttonWidth
		pressedView.height = buttonHeight

		const buttonText = new BitmapText({
			text,
			style: {
				fontFamily: 'tahoma13-bold',
				fontSize: 13,
				fill: textColor,
			},
		})

		buttonText.anchor.set(0.5)
		buttonText.x = buttonWidth / 2
		buttonText.y = buttonHeight / 2

		const fancyButton = new FancyButton({
			defaultView,
			hoverView,
			pressedView,
			text: buttonText,
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
	}, [defaultTexture, hoverTexture, pressedTexture, buttonWidth, buttonHeight, text, textColor, onPress])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
