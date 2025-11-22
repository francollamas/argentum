import { extend } from '@pixi/react'
import { ProgressBar as PixiProgressBar } from '@pixi/ui'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { useUITexture } from '../../hooks/useUITexture'
import { Label } from './Label'

extend({ Container })

type ProgressBarTextVariant = 'amount' | 'percentage'

type ProgressBarProps = {
	x: number
	y: number
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
	fillColor = 0xF2D059,
	fillPaddings = { top: 2, right: 2, bottom: 2, left: 2 },
	textVariant,
	textColor = 0xFFFFFF,
}) => {
	const containerRef = useRef<Container | null>(null)
	const progressBarRef = useRef<PixiProgressBar | null>(null)

	const bgTexture = useUITexture('bar-container')
	const fillTexture = useUITexture('bar-fill')

	const progress = max === 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100))

	useEffect(() => {
		if (!containerRef.current) return

		const bgSliceSize = Math.min(bgTexture.width, bgTexture.height) * 0.25
		const fillSliceSize = Math.min(fillTexture.width, fillTexture.height) * 0.25

		const progressBar = new PixiProgressBar({
			bg: bgTexture,
			fill: fillTexture,
			fillPaddings,
			nineSliceSprite: {
				bg: [bgSliceSize, bgSliceSize, bgSliceSize, bgSliceSize],
				fill: [fillSliceSize, fillSliceSize, fillSliceSize, fillSliceSize],
			},
			progress,
		})

		progressBar.width = width
		progressBar.height = height

		const fillSprite = progressBar.innerView.children.find(
			(child) => child !== progressBar.innerView.children[0],
		)
		if (fillSprite) {
			fillSprite.tint = fillColor
		}

		containerRef.current.addChild(progressBar)
		progressBarRef.current = progressBar

		return () => {
			progressBarRef.current = null
			progressBar.destroy()
		}
	}, [bgTexture, fillTexture, width, height, fillColor, fillPaddings])

	useEffect(() => {
		if (progressBarRef.current) {
			progressBarRef.current.progress = progress
		}
	}, [progress])

	if (!textVariant) {
		return <pixiContainer ref={containerRef} x={x} y={y} />
	}

	const displayText =
		textVariant === 'amount'
			? `${Math.round(value)} / ${Math.round(max)}`
			: `${Math.round(progress)}%`

	return (
		<>
			<pixiContainer ref={containerRef} x={x} y={y} />
			<Label
				text={displayText}
				x={x + width / 2}
				y={y + height / 2}
				anchor={{ x: 0.5, y: 0.5 }}
				color={textColor}
			/>
		</>
	)
}
