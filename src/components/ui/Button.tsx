import { extend } from '@pixi/react'
import { FancyButton } from '@pixi/ui'
import { Assets, BitmapText, Container, NineSliceSprite, type Texture } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import buttonDefault from '../../assets/ui/svg/button-main-normal.svg'
import buttonHover from '../../assets/ui/svg/button-main-hover.svg'
import buttonPressed from '../../assets/ui/svg/button-main-pressed.svg'

extend({ Container })

type ButtonProps = {
	text: string
	x: number
	y: number
	width?: number
	height?: number
	nineSliceBorders?: [number, number, number, number]
	onPress?: () => void
	textColor?: number
}

export const Button: FC<ButtonProps> = ({
	text,
	x,
	y,
	width = 400,
	height = 120,
	nineSliceBorders = [255, 330, 255, 330],
	onPress,
	textColor = 0xffffff,
}) => {
	const containerRef = useRef<Container | null>(null)
	const [textures, setTextures] = useState<Texture[] | null>(null)

	useEffect(() => {
		const loadTextures = async () => {
			const loadedTextures = await Assets.load([
				buttonDefault,
				buttonHover,
				buttonPressed,
			])
			setTextures([
				loadedTextures[buttonDefault],
				loadedTextures[buttonHover],
				loadedTextures[buttonPressed],
			])
		}

		loadTextures()
	}, [])

	useEffect(() => {
		if (!containerRef.current || !textures) return

		const [defaultTexture, hoverTexture, pressedTexture] = textures

		const defaultView = new NineSliceSprite({
			texture: defaultTexture,
			leftWidth: nineSliceBorders[0],
			topHeight: nineSliceBorders[1],
			rightWidth: nineSliceBorders[2],
			bottomHeight: nineSliceBorders[3],
			width,
			height,
		})

		const hoverView = new NineSliceSprite({
			texture: hoverTexture,
			leftWidth: nineSliceBorders[0],
			topHeight: nineSliceBorders[1],
			rightWidth: nineSliceBorders[2],
			bottomHeight: nineSliceBorders[3],
			width,
			height,
		})

		const pressedView = new NineSliceSprite({
			texture: pressedTexture,
			leftWidth: nineSliceBorders[0],
			topHeight: nineSliceBorders[1],
			rightWidth: nineSliceBorders[2],
			bottomHeight: nineSliceBorders[3],
			width,
			height,
		})

		const buttonText = new BitmapText({
			text,
			style: {
				fontFamily: 'tahoma13-bold',
				fontSize: 13,
				fill: textColor,
			},
		})

		buttonText.anchor.set(0.5)
		buttonText.x = width / 2
		buttonText.y = height / 2

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
	}, [textures, nineSliceBorders, width, height, text, textColor, onPress])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
