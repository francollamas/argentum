import type { Application, Bounds } from 'pixi.js'
import type { RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

type BoundsProvider = {
	getBounds: () => Bounds
}

type OverlayPositionContext = {
	bounds: Bounds
	canvasRect: DOMRect
	containerRect: DOMRect
}

type OverlayPositionSyncOptions<TStyle> = {
	app: Application | null | undefined
	hostElement: HTMLDivElement | null
	targetRef: RefObject<BoundsProvider | null>
	computeStyle: (context: OverlayPositionContext) => TStyle
}

export function useOverlayPositionSync<TStyle>({
	app,
	hostElement,
	targetRef,
	computeStyle,
}: OverlayPositionSyncOptions<TStyle>) {
	const syncFrameRef = useRef<number | null>(null)
	const [style, setStyle] = useState<TStyle | null>(null)

	const syncPosition = useCallback(() => {
		if (!app?.canvas || !hostElement) return

		const target = targetRef.current
		const container = hostElement.parentElement
		if (!target || !container) return

		const canvasRect = app.canvas.getBoundingClientRect()
		const containerRect = container.getBoundingClientRect()
		const bounds = target.getBounds()

		setStyle(
			computeStyle({
				bounds,
				canvasRect,
				containerRect,
			}),
		)
	}, [app, computeStyle, hostElement, targetRef])

	const scheduleSync = useCallback(() => {
		if (syncFrameRef.current != null) {
			cancelAnimationFrame(syncFrameRef.current)
		}

		syncFrameRef.current = requestAnimationFrame(() => {
			syncFrameRef.current = null
			syncPosition()
		})
	}, [syncPosition])

	useEffect(() => {
		return () => {
			if (syncFrameRef.current != null) {
				cancelAnimationFrame(syncFrameRef.current)
				syncFrameRef.current = null
			}
		}
	}, [])

	useEffect(() => {
		if (!app) return

		app.renderer.on('resize', scheduleSync)

		return () => {
			app.renderer.off('resize', scheduleSync)
		}
	}, [app, scheduleSync])

	useEffect(() => {
		if (!hostElement) return
		scheduleSync()
	}, [hostElement, scheduleSync])

	useEffect(() => {
		if (!hostElement) {
			setStyle(null)
		}
	}, [hostElement])

	return {
		style,
		scheduleSync,
	}
}
