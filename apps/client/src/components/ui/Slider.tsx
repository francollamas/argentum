import { useApplication } from '@pixi/react'
import type { Container, FederatedPointerEvent, PointData } from 'pixi.js'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

type LayoutMeasuredContainer = Container & {
	layout?: {
		computedLayout?: {
			width?: number
		}
	}
}

type SliderProps = {
	value: number
	min?: number
	max?: number
	width?: number
	height?: number
	onChange?: (value: number) => void
	layout?: Record<string, unknown>
}

const DEFAULT_WIDTH = 280
const DEFAULT_HEIGHT = 40
const DEFAULT_TRACK_HEIGHT = 18
const DEFAULT_THUMB_WIDTH = 24
const DEFAULT_THUMB_HEIGHT = 34
const TRACK_SLICE_SIZE = 12
const FILL_SLICE_SIZE = 10

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value))

export const Slider: FC<SliderProps> = ({
	value,
	min = 0,
	max = 100,
	width,
	height = DEFAULT_HEIGHT,
	onChange,
	layout,
}) => {
	const { app } = useApplication()
	const trackRef = useRef<Container | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [trackWidth, setTrackWidth] = useState(width ?? DEFAULT_WIDTH)

	const trackTexture = useUITexture('slider-track')
	const fillTexture = useUITexture('slider-fill')
	const thumbTexture = useUITexture('slider-thumb')

	const safeMin = Math.min(min, max)
	const safeMax = Math.max(min, max)
	const range = safeMax - safeMin
	const clampedValue = clamp(value, safeMin, safeMax)
	const progress = range === 0 ? 0 : (clampedValue - safeMin) / range

	const thumbWidth = Math.round(
		(thumbTexture.width / thumbTexture.height) * DEFAULT_THUMB_HEIGHT,
	)
	const thumbHeight = DEFAULT_THUMB_HEIGHT
	const trackHeight = Math.min(DEFAULT_TRACK_HEIGHT, height)
	const trackTop = Math.max(0, Math.round((height - trackHeight) / 2))
	const thumbTop = Math.max(0, Math.round((height - thumbHeight) / 2))
	const thumbTravelWidth = Math.max(0, trackWidth - thumbWidth)
	const thumbLeft = Math.round(progress * thumbTravelWidth)
	const fillWidth = Math.max(
		0,
		Math.min(trackWidth, Math.round(thumbLeft + thumbWidth / 2)),
	)

	const rootLayout = useMemo(
		() => ({
			...(width != null ? { width } : { width: '100%' }),
			height,
			minHeight: height,
			minWidth: width ?? DEFAULT_WIDTH,
			position: 'relative' as const,
			...layout,
		}),
		[height, layout, width],
	)

	const syncTrackWidth = useCallback(() => {
		const node = trackRef.current
		if (!node) {
			return
		}

		const nextWidth =
			(node as LayoutMeasuredContainer).layout?.computedLayout?.width ||
			width ||
			DEFAULT_WIDTH
		setTrackWidth(nextWidth)
	}, [width])

	const handleTrackRef = useCallback(
		(node: Container | null) => {
			if (trackRef.current) {
				trackRef.current.off('layout', syncTrackWidth)
			}

			trackRef.current = node

			if (node) {
				node.on('layout', syncTrackWidth)
				syncTrackWidth()
			}
		},
		[syncTrackWidth],
	)

	const setValueFromGlobal = useCallback(
		(global: PointData) => {
			const node = trackRef.current
			if (!node) {
				return
			}

			const local = node.toLocal(global)
			const usableWidth =
				(node as LayoutMeasuredContainer).layout?.computedLayout?.width ||
				trackWidth
			if (usableWidth <= 0) {
				return
			}

			const nextRatio = clamp(local.x / usableWidth, 0, 1)
			const nextValue = safeMin + nextRatio * range
			onChange?.(range === 0 ? safeMin : nextValue)
		},
		[onChange, range, safeMin, trackWidth],
	)

	const handlePointerDown = useCallback(
		(event: FederatedPointerEvent) => {
			setIsDragging(true)
			setValueFromGlobal(event.global)
		},
		[setValueFromGlobal],
	)

	useEffect(() => {
		if (!isDragging) {
			return
		}

		const handleWindowPointerMove = (event: PointerEvent) => {
			if (!app.canvas) {
				return
			}

			const rect = app.canvas.getBoundingClientRect()
			const global = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			}

			setValueFromGlobal(global)
		}

		const stopDragging = () => {
			setIsDragging(false)
		}

		window.addEventListener('pointermove', handleWindowPointerMove)
		window.addEventListener('pointerup', stopDragging)
		window.addEventListener('pointercancel', stopDragging)

		return () => {
			window.removeEventListener('pointermove', handleWindowPointerMove)
			window.removeEventListener('pointerup', stopDragging)
			window.removeEventListener('pointercancel', stopDragging)
		}
	}, [app.canvas, isDragging, setValueFromGlobal])

	useEffect(() => {
		return () => {
			if (trackRef.current) {
				trackRef.current.off('layout', syncTrackWidth)
			}
		}
	}, [syncTrackWidth])

	return (
		<layoutContainer layout={rootLayout} eventMode='static' cursor='pointer'>
			<layoutContainer
				ref={handleTrackRef}
				layout={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: trackTop,
					height: trackHeight,
				}}
				eventMode='static'
				onPointerDown={handlePointerDown}
			>
				<pixiNineSliceSprite
					texture={trackTexture}
					leftWidth={TRACK_SLICE_SIZE}
					topHeight={TRACK_SLICE_SIZE}
					rightWidth={TRACK_SLICE_SIZE}
					bottomHeight={TRACK_SLICE_SIZE}
					layout={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						applySizeDirectly: true,
					}}
				/>
				{fillWidth > 0 ? (
					<pixiNineSliceSprite
						texture={fillTexture}
						leftWidth={FILL_SLICE_SIZE}
						topHeight={FILL_SLICE_SIZE}
						rightWidth={FILL_SLICE_SIZE}
						bottomHeight={FILL_SLICE_SIZE}
						layout={{
							position: 'absolute',
							left: 0,
							top: Math.max(0, Math.round((trackHeight - 12) / 2)),
							width: fillWidth,
							height: Math.min(12, trackHeight),
							applySizeDirectly: true,
						}}
					/>
				) : null}
			</layoutContainer>
			<pixiSprite
				texture={thumbTexture}
				layout={{
					position: 'absolute',
					left: thumbLeft,
					top: thumbTop,
					width: thumbWidth || DEFAULT_THUMB_WIDTH,
					height: thumbHeight,
				}}
				roundPixels
				eventMode='static'
				cursor='pointer'
				onPointerDown={handlePointerDown}
			/>
		</layoutContainer>
	)
}
