import type { FC } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

type ProgressBarTextVariant = 'amount' | 'percentage'

type ProgressBarProps = {
	x?: number
	y?: number
	width: number
	height: number
	value?: number
	max?: number
	fillColor?: number
	fillPaddings?: {
		top?: number
		right?: number
		bottom?: number
		left?: number
	}
	/** Stat name rendered inside the bar, left-aligned */
	label?: string
	labelColor?: number
	/** Optional value text rendered centered inside the bar */
	textVariant?: ProgressBarTextVariant
	textColor?: number
}

export const ProgressBar: FC<ProgressBarProps> = ({
	x,
	y,
	width,
	height,
	value = 0,
	max = 100,
	fillColor = 0xf2d059,
	fillPaddings = { top: 2, right: 2, bottom: 2, left: 2 },
	label,
	labelColor = 0xffffff,
	textVariant,
	textColor = 0xffffff,
}) => {
	const bgTexture = useUITexture('bar-container')
	const fillTexture = useUITexture('bar-fill')

	const progress =
		max === 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100))

	const padTop = fillPaddings.top ?? 2
	const padRight = fillPaddings.right ?? 2
	const padBottom = fillPaddings.bottom ?? 2
	const padLeft = fillPaddings.left ?? 2

	const bgSliceSize = Math.min(bgTexture.width, bgTexture.height) * 0.25
	const fillSliceSize = Math.min(fillTexture.width, fillTexture.height) * 0.25

	const fillInnerWidth = width - padLeft - padRight
	const fillInnerHeight = height - padTop - padBottom
	const fillWidth = Math.max(0, (progress / 100) * fillInnerWidth)

	const valueText =
		textVariant === 'amount'
			? `${Math.round(value)} / ${Math.round(max)}`
			: textVariant === 'percentage'
				? `${Math.round(progress)}%`
				: null

	return (
		<pixiContainer x={x} y={y} layout={{ width, height }}>
			<pixiNineSliceSprite
				texture={bgTexture}
				leftWidth={bgSliceSize}
				topHeight={bgSliceSize}
				rightWidth={bgSliceSize}
				bottomHeight={bgSliceSize}
				width={width}
				height={height}
			/>
			{fillWidth > 0 && (
				<pixiNineSliceSprite
					texture={fillTexture}
					leftWidth={fillSliceSize}
					topHeight={fillSliceSize}
					rightWidth={fillSliceSize}
					bottomHeight={fillSliceSize}
					x={padLeft}
					y={padTop}
					width={fillWidth}
					height={fillInnerHeight}
					tint={fillColor}
				/>
			)}
			{label && (
				<pixiBitmapText
					text={label}
					x={8}
					y={height / 2}
					anchor={{ x: 0, y: 0.5 }}
					style={{
						fontFamily: FONTS.label.fontFamily,
						fontSize: FONTS.label.fontSize,
						fill: labelColor,
					}}
				/>
			)}
			{valueText && (
				<pixiBitmapText
					text={valueText}
					x={width / 2}
					y={height / 2}
					anchor={{ x: 0.5, y: 0.5 }}
					style={{
						fontFamily: FONTS.body.fontFamily,
						fontSize: FONTS.body.fontSize,
						fill: textColor,
					}}
				/>
			)}
		</pixiContainer>
	)
}
