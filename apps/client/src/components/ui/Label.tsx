import type { FC } from 'react'
import { FONTS, type FontType } from '../../config/typography'

type LabelProps = {
	text: string
	font?: FontType
	color?: number
	layout?: Record<string, unknown>
}

export const Label: FC<LabelProps> = ({
	text,
	font = 'body',
	color = 0xffffff,
	layout,
}) => {
	const fontConfig = FONTS[font]

	return (
		<pixiBitmapText
			text={text}
			layout={{
				width: 'intrinsic',
				height: 'intrinsic',
				flexShrink: 0,
				...layout,
			}}
			style={{
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
				fill: color,
			}}
		/>
	)
}
