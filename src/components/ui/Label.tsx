import { extend } from '@pixi/react'
import { BitmapText } from 'pixi.js'
import type { FC } from 'react'
import { FONTS, type FontType } from '../../config/typography'

extend({ BitmapText })

type LabelProps = {
	text: string
	x: number
	y: number
	font?: FontType
	color?: number
	anchor?: { x: number; y: number }
}

export const Label: FC<LabelProps> = ({
	text,
	x,
	y,
	font = 'general',
	color = 0xffffff,
	anchor = { x: 0, y: 0 },
}) => {

	const fontConfig = FONTS[font]

	return (
		<pixiBitmapText
			text={text}
			x={x}
			y={y}
			anchor={anchor}
			style={{
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
				fill: color,
			}}
		/>
	)
}
