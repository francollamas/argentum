import type { FC } from 'react'
import { FONTS, type FontType } from '../../config/typography'

type LabelProps = {
	text: string
	font?: FontType
	color?: number
	layout?: Record<string, unknown>
	wrap?: boolean
}

export const Label: FC<LabelProps> = ({
	text,
	font = 'body',
	color = 0xffffff,
	layout,
	wrap = false,
}) => {
	const fontConfig = FONTS[font]
	const textStyle = {
		fontFamily: fontConfig.fontFamily,
		fontSize: fontConfig.fontSize,
		fill: color,
		...(wrap ? { wordWrap: true } : {}),
	}
	if (wrap) {
		return (
			<layoutBitmapText
				text={text}
				layout={{
					width: '100%',
					height: 'intrinsic',
					...layout,
				}}
				style={textStyle}
			/>
		)
	}

	return (
		<pixiBitmapText
			text={text}
			layout={{
				width: 'intrinsic',
				height: 'intrinsic',
				flexShrink: 0,
				...layout,
			}}
			style={textStyle}
		/>
	)
}
