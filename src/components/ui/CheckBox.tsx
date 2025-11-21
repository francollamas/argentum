import { extend } from '@pixi/react'
import { CheckBox as PixiCheckBox } from '@pixi/ui'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container })

type CheckBoxVariant = 'normal' | 'radio'

type CheckBoxProps = {
	x: number
	y: number
	checked?: boolean
	onChange?: (checked: boolean) => void
	variant?: CheckBoxVariant
	scale?: number
	text?: string
	textColor?: number
}

export const CheckBox: FC<CheckBoxProps> = ({
	x,
	y,
	checked = false,
	onChange,
	variant = 'normal',
	scale = 0.4,
	text,
	textColor = 0xffffff,
}) => {
	const containerRef = useRef<Container | null>(null)

	const prefix = variant === 'radio' ? 'radio' : 'checkbox'
	const uncheckedTexture = useUITexture(`${prefix}-unchecked`)
	const checkedTexture = useUITexture(`${prefix}-checked`)

	useEffect(() => {
		if (!containerRef.current) return

		const fontConfig = FONTS.general

		const checkbox = new PixiCheckBox({
			checked,
			text,
			style: {
				unchecked: uncheckedTexture,
				checked: checkedTexture,
				text: {
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize,
					fill: textColor,
				},
			},
		})

		checkbox.scale.set(scale)

		if (onChange) {
			const handleChange = (state: number | boolean) => {
				onChange(Boolean(state))
			}
			checkbox.onChange.connect(handleChange)

			containerRef.current.addChild(checkbox)

			return () => {
				checkbox.onChange.disconnect(handleChange)
				checkbox.destroy()
			}
		}

		containerRef.current.addChild(checkbox)

		return () => {
			checkbox.destroy()
		}
	}, [
		checked,
		checkedTexture,
		onChange,
		scale,
		text,
		textColor,
		uncheckedTexture,
	])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
