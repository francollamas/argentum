import { extend } from '@pixi/react'
import { BitmapText } from 'pixi.js'
import type { FC, JSX } from 'react'

extend({ BitmapText })

type TextProps = {
	text: string
	x: number
	y: number
	bold?: boolean
	border?: boolean
	color?: number
} & JSX.IntrinsicElements['pixiBitmapText']

export const Text: FC<TextProps> = ({
	text,
	x,
	y,
	bold = false,
	border = false,
	color = 0xffffff,
	...props
}) => {
	let fontFamily = 'tahoma13'
	if (bold) fontFamily += '-bold'
	if (border) fontFamily += '-border'

	return (
		<pixiBitmapText
			text={text}
			x={x}
			y={y}
			style={{
				fontFamily,
				fontSize: 13,
				fill: color,
			}}
			{...props}
		/>
	)
}
