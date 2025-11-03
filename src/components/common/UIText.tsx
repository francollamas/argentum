import { extend } from '@pixi/react'
import { Text, TextStyle } from 'pixi.js'
import type { FC } from 'react'
import { useMemo } from 'react'

extend({ Text })

type UITextProps = {
	text: string
	size?: 'small' | 'medium' | 'large' | 'title'
	color?: number
	anchor?: number
	x?: number
	y?: number
}

export const UIText: FC<UITextProps> = ({
	text,
	size = 'medium',
	color = 0xe8e4d9,
	anchor = 0,
	x = 0,
	y = 0,
}) => {
	const style = useMemo(() => {
		const fontSizes = {
			small: 12,
			medium: 14,
			large: 18,
			title: 24,
		}

		return new TextStyle({
			fontFamily:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
			fontSize: fontSizes[size],
			fill: color,
			fontWeight: size === 'title' || size === 'large' ? '600' : 'normal',
		})
	}, [size, color])

	return (
		<pixiText
			text={text}
			style={style}
			anchor={anchor}
			x={x}
			y={y}
			layout={{
				width: 'intrinsic',
				height: 'intrinsic',
			}}
		/>
	)
}
