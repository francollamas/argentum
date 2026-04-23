import type { FC } from 'react'
import { useUITexture } from '../../hooks/useUITexture'
import { Colors } from './colors'
import { Label } from './Label'

type ProgressBarTextVariant = 'amount' | 'percentage'

type ProgressBarProps = {
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
	/** Stat name rendered above the bar, left-aligned */
	label?: string
	labelColor?: number
	/** Optional value text rendered above the bar, right-aligned */
	textVariant?: ProgressBarTextVariant
	textColor?: number
	layout?: Record<string, unknown>
}

export const ProgressBar: FC<ProgressBarProps> = ({
	width,
	height,
	value = 0,
	max = 100,
	fillColor = 0xf2d059,
	fillPaddings = { top: 2, right: 2, bottom: 2, left: 2 },
	label,
	labelColor = Colors.metalHighlight,
	textVariant,
	textColor = Colors.silver,
	layout,
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

	const fillInnerHeight = height - padTop - padBottom
	const fillPercent = `${progress}%`

	const valueText =
		textVariant === 'amount'
			? `${Math.round(value)} / ${Math.round(max)}`
			: textVariant === 'percentage'
				? `${Math.round(progress)}%`
				: null

	return (
		<layoutContainer
			layout={{
				width,
				minWidth: width,
				flexDirection: 'column',
				gap: 4,
				...layout,
			}}
		>
			<layoutContainer
				layout={{
					width: '100%',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					minWidth: 0,
				}}
			>
				{label ? (
					<Label
						text={label}
						font='labelSm'
						color={labelColor}
						layout={{ flexShrink: 0 }}
					/>
				) : null}
				{valueText ? (
					<Label
						text={valueText}
						font='bodySm'
						color={textColor}
						layout={{ flexShrink: 0 }}
					/>
				) : null}
			</layoutContainer>
			<layoutContainer
				layout={{
					width: '100%',
					height,
					minHeight: height,
				}}
			>
				<pixiNineSliceSprite
					texture={bgTexture}
					leftWidth={bgSliceSize}
					topHeight={bgSliceSize}
					rightWidth={bgSliceSize}
					bottomHeight={bgSliceSize}
					layout={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						applySizeDirectly: true,
					}}
				/>
				{progress > 0 && (
					<layoutContainer
						layout={{
							position: 'absolute',
							left: padLeft,
							right: padRight,
							top: padTop,
							bottom: padBottom,
						}}
					>
						<pixiNineSliceSprite
							texture={fillTexture}
							leftWidth={fillSliceSize}
							topHeight={fillSliceSize}
							rightWidth={fillSliceSize}
							bottomHeight={fillSliceSize}
							tint={fillColor}
							layout={{
								width: fillPercent,
								height: fillInnerHeight,
								applySizeDirectly: true,
							}}
						/>
					</layoutContainer>
				)}
			</layoutContainer>
		</layoutContainer>
	)
}
