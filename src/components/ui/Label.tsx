import { extend } from '@pixi/react'
import { BitmapText } from 'pixi.js'
import type { FC } from 'react'
import { FONTS, type FontType } from '../../config/typography'

extend({ BitmapText })

type LabelProps = {
	text: string
	x?: number
	y?: number
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

	const textElement = (
		<layoutContainer layout={{ width: 'intrinsic', height: 'intrinsic' }}>
			<pixiBitmapText
				text={text}
				x={x !== undefined ? x : undefined}
				y={y !== undefined ? y : undefined}
				anchor={anchor}
				style={{
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize,
					fill: color,
				}}
			/>
		</layoutContainer>
	)

	if (x === undefined && y === undefined) {
		return (
			<layoutContainer layout={{ width: 'intrinsic', height: 'intrinsic' }}>
				{textElement}
			</layoutContainer>
		)
	}

	// return textElement
}
