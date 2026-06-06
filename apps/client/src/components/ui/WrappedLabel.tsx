import type { FC } from 'react'
import { FONTS, type FontType } from '../../config/typography'

type WrappedLabelProps = {
	text: string
	width: number
	font?: FontType
	color?: number
	layout?: Record<string, unknown>
}

export const WrappedLabel: FC<WrappedLabelProps> = ({
	text,
	width,
	font = 'body',
	color = 0xffffff,
	layout,
}) => {
	const fontConfig = FONTS[font]

	return (
		<pixiBitmapText
			text={text}
			layout={{
				width,
				height: 'intrinsic',
				flexShrink: 0,
				...layout,
			}}
			style={{
				fontFamily: fontConfig.fontFamily,
				fontSize: fontConfig.fontSize,
				fill: color,
				wordWrap: true,
				wordWrapWidth: width,
			}}
		/>
	)
}
