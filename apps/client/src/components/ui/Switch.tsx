import { extend } from '@pixi/react'
import { CheckBox as PixiSwitch } from '@pixi/ui'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container })

type SwitchProps = {
	x: number
	y: number
	enabled?: boolean
	onChange?: (enabled: boolean) => void
	scale?: number
	text?: string
	textColor?: number
}

export const Switch: FC<SwitchProps> = ({
	x,
	y,
	enabled = false,
	onChange,
	scale = 0.4,
	text,
	textColor = 0xffffff,
}) => {
	const containerRef = useRef<Container | null>(null)

	const offTexture = useUITexture('switch-off')
	const onTexture = useUITexture('switch-on')

	useEffect(() => {
		if (!containerRef.current) return

		const fontConfig = FONTS.checkbox

		const switchControl = new PixiSwitch({
			checked: enabled,
			text,
			style: {
				unchecked: offTexture,
				checked: onTexture,
				text: {
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize,
					fill: textColor,
				},
			},
		})

		switchControl.scale.set(scale)

		if (onChange) {
			const handleChange = (state: number | boolean) => {
				onChange(Boolean(state))
			}
			switchControl.onChange.connect(handleChange)

			containerRef.current.addChild(switchControl)

			return () => {
				switchControl.onChange.disconnect(handleChange)
				switchControl.destroy()
			}
		}

		containerRef.current.addChild(switchControl)

		return () => {
			switchControl.destroy()
		}
	}, [enabled, onTexture, onChange, scale, text, textColor, offTexture])

	return <pixiContainer ref={containerRef} x={x} y={y} />
}
