import type { FC } from 'react'
import { FONTS, type FontType } from '../../config/typography'

type WrappedLabelAlign = 'left' | 'center' | 'right'

type WrappedLabelProps = {
	text: string
	width: number
	font?: FontType
	color?: number
	align?: WrappedLabelAlign
	layout?: Record<string, unknown>
}

export const WrappedLabel: FC<WrappedLabelProps> = ({
	text,
	width,
	font = 'body',
	color = 0xffffff,
	align = 'left',
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
				align,
				wordWrap: true,
				wordWrapWidth: width,
			}}
		/>
	)
}
