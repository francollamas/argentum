import type { FC } from 'react'
import { FONTS, type FontType } from '../../config/typography'

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
	font = 'body',
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
			layout={{ width: 'intrinsic', height: 'intrinsic' }}
			style={{
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
				fill: color,
			}}
		/>
	)
}
