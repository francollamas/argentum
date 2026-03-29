import { extend } from '@pixi/react'
import {
	CheckBox as PixiCheckBox,
	RadioGroup as PixiRadioGroup,
} from '@pixi/ui'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container })

type RadioGroupItem = {
	text: string
}

type RadioGroupProps = {
	x: number
	y: number
	items: RadioGroupItem[]
	selectedIndex?: number
	onChange?: (selectedIndex: number) => void
	scale?: number
	type?: 'vertical' | 'horizontal'
}

export const RadioGroup: FC<RadioGroupProps> = ({
	x,
	y,
	items,
	selectedIndex = 0,
	onChange,
	scale = 0.4,
	type = 'vertical',
}) => {
	const containerRef = useRef<Container | null>(null)
	const radioUncheckedTexture = useUITexture('radio-unchecked')
	const radioCheckedTexture = useUITexture('radio-checked')

	useEffect(() => {
		if (!containerRef.current) return

		const fontConfig = FONTS.checkbox

		const checkboxes = items.map((item) => {
			return new PixiCheckBox({
				text: item.text,
				style: {
					unchecked: radioUncheckedTexture,
					checked: radioCheckedTexture,
					text: {
						fontFamily: fontConfig.fontFamily,
						fontSize: fontConfig.fontSize,
						fill: 0xffffff,
					},
				},
			})
		})

		const radioGroup = new PixiRadioGroup({
			items: checkboxes,
			type,
			selectedItem: selectedIndex,
			elementsMargin: 15,
		})

		radioGroup.scale.set(scale)

		if (onChange) {
			const handleChange = (selectedId: number) => {
				onChange(selectedId)
			}
			radioGroup.onChange.connect(handleChange)

			containerRef.current.addChild(radioGroup)

			return () => {
				radioGroup.onChange.disconnect(handleChange)
				radioGroup.destroy()
			}
		}

		containerRef.current.addChild(radioGroup)

		return () => {
			radioGroup.destroy()
		}
	}, [
		items,
		onChange,
		radioCheckedTexture,
		radioUncheckedTexture,
		scale,
		selectedIndex,
		type,
	])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
