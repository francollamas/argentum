import type { LayoutOptions } from '@pixi/layout'
import type { LayoutContainer as PixiLayoutContainer } from '@pixi/layout/components'
import { tw } from '@pixi/layout/tailwind'
import type { Container, FederatedPointerEvent } from 'pixi.js'
import type { FC, ReactNode } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import { ScrollGestureContext } from './ScrollGestureContext'

type ScrollViewProps = {
	width?: number
	height?: number
	children?: ReactNode
	layout?: Record<string, unknown>
	contentLayout?: Record<string, unknown>
	maxSpeed?: number
}

type ScrollTrackpadContainer = Container & {
	_trackpad?: {
		pointerUp: () => void
		x: number
		y: number
	}
}

const DEFAULT_MAX_SPEED = 400
const DRAG_THRESHOLD = 8

export const ScrollView: FC<ScrollViewProps> = ({
	width,
	height,
	children,
	layout,
	contentLayout,
	maxSpeed = DEFAULT_MAX_SPEED,
}) => {
	const activePointerIdRef = useRef<number | null>(null)
	const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
	const didDragRef = useRef(false)
	const claimedPointerIdRef = useRef<number | null>(null)
	const scrollContainerRef = useRef<PixiLayoutContainer | null>(null)

	const viewportLayout = {
		...(width != null ? { width } : { width: '100%' }),
		...(height != null ? { height, minHeight: height } : {}),
		...tw`flex-col`,
		alignSelf: 'stretch',
		minWidth: 0,
		minHeight: 0,
		overflow: 'scroll' as const,
		...layout,
	} as unknown as Omit<LayoutOptions, 'target'>

	const trackpadOptions = useMemo(
		() => ({
			maxSpeed,
			constrain: true,
			xConstrainPercent: -1,
			yConstrainPercent: 0,
		}),
		[maxSpeed],
	)

	const innerContentLayout = {
		...tw`w-full flex-col`,
		alignSelf: 'stretch',
		minWidth: 0,
		flexShrink: 0,
		...contentLayout,
	} as unknown as Omit<LayoutOptions, 'target'>

	const handlePointerDown = (event: FederatedPointerEvent) => {
		activePointerIdRef.current = event.pointerId
		pointerStartRef.current = {
			x: event.global.x,
			y: event.global.y,
		}
		didDragRef.current = false
		claimedPointerIdRef.current = null
	}

	const handlePointerMove = (event: FederatedPointerEvent) => {
		if (event.pointerId === claimedPointerIdRef.current) {
			return
		}

		if (event.pointerId !== activePointerIdRef.current || didDragRef.current) {
			return
		}

		const pointerStart = pointerStartRef.current
		if (!pointerStart) {
			return
		}

		const deltaX = event.global.x - pointerStart.x
		const deltaY = event.global.y - pointerStart.y
		if (deltaX * deltaX + deltaY * deltaY >= DRAG_THRESHOLD * DRAG_THRESHOLD) {
			didDragRef.current = true
		}
	}

	const handlePointerEnd = (event: FederatedPointerEvent) => {
		if (event.pointerId !== activePointerIdRef.current) {
			return
		}

		activePointerIdRef.current = null
		pointerStartRef.current = null
		claimedPointerIdRef.current = null
	}

	const claimGesture = useCallback((pointerId: number) => {
		if (pointerId !== activePointerIdRef.current) {
			return
		}

		const trackpad = (scrollContainerRef.current as ScrollTrackpadContainer | null)?._trackpad
		if (trackpad) {
			const currentX = trackpad.x
			const currentY = trackpad.y
			trackpad.pointerUp()
			trackpad.x = currentX
			trackpad.y = currentY
		}

		claimedPointerIdRef.current = pointerId
		didDragRef.current = true
	}, [])

	const releaseGesture = useCallback((pointerId: number) => {
		if (claimedPointerIdRef.current !== pointerId) {
			return
		}

		claimedPointerIdRef.current = null
	}, [])

	const isGestureClaimed = useCallback(
		(pointerId: number) => claimedPointerIdRef.current === pointerId,
		[],
	)

	const gestureContextValue = useMemo(
		() => ({
			shouldCancelTap: () =>
				didDragRef.current || claimedPointerIdRef.current != null,
			claimGesture,
			releaseGesture,
			isGestureClaimed,
		}),
		[claimGesture, isGestureClaimed, releaseGesture],
	)

	return (
		<ScrollGestureContext.Provider value={gestureContextValue}>
			<layoutContainer
				ref={scrollContainerRef}
				eventMode='static'
				onPointerDown={handlePointerDown}
				onGlobalPointerMove={handlePointerMove}
				onPointerUp={handlePointerEnd}
				onPointerUpOutside={handlePointerEnd}
				onPointerCancel={handlePointerEnd}
				layout={viewportLayout}
				trackpad={trackpadOptions}
			>
				<layoutContainer layout={innerContentLayout}>
					{children}
				</layoutContainer>
			</layoutContainer>
		</ScrollGestureContext.Provider>
	)
}
