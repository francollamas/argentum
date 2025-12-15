import { extend } from '@pixi/react'
import { Input as PixiInput } from '@pixi/ui'
import { Container, NineSliceSprite } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container })

type InputProps = {
	x: number
	y: number
	width?: number
	height?: number
	placeholder?: string
	value?: string
	maxLength?: number
	secure?: boolean
	align?: 'left' | 'center' | 'right'
	textColor?: number
	onChange?: (value: string) => void
	onEnter?: (value: string) => void
}

export const Input: FC<InputProps> = ({
	x,
	y,
	width = 200,
	height = 40,
	placeholder = '',
	value = '',
	maxLength,
	secure = false,
	align = 'left',
	textColor = 0xffffff,
	onChange,
	onEnter,
}) => {
	const containerRef = useRef<Container | null>(null)
	const inputRef = useRef<PixiInput | null>(null)
	const inputTexture = useUITexture('input-field')

	useEffect(() => {
		if (!containerRef.current) return

		const fontConfig = FONTS.general

		const bg = new NineSliceSprite({
			texture: inputTexture,
			leftWidth: 10,
			topHeight: 10,
			rightWidth: 10,
			bottomHeight: 10,
			width,
			height,
		})

		const input = new PixiInput({
			bg: bg as any,
			textStyle: {
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
				fill: textColor,
			},
			placeholder,
			value,
			maxLength,
			secure,
			align,
			padding: {
				top: 8,
				right: 12,
				bottom: 8,
				left: 12,
			},
		})

		if (onChange) {
			input.onChange.connect(onChange)
		}

		if (onEnter) {
			input.onEnter.connect(onEnter)
		}

		containerRef.current.addChild(input)
		inputRef.current = input

		return () => {
			if (onChange) {
				input.onChange.disconnect(onChange)
			}
			if (onEnter) {
				input.onEnter.disconnect(onEnter)
			}
			input.destroy()
			inputRef.current = null
		}
	}, [
		inputTexture,
		width,
		height,
		placeholder,
		maxLength,
		secure,
		align,
		textColor,
		onChange,
		onEnter,
		value,
	])

	useEffect(() => {
		if (inputRef.current && inputRef.current.value !== value) {
			inputRef.current.value = value
		}
	}, [value])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
