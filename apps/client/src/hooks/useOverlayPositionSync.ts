import { useTick } from '@pixi/react'
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
	const lastSyncedRef = useRef({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		canvasX: 0,
		canvasY: 0,
		containerX: 0,
		containerY: 0,
	})

	useTick(() => {
		if (!app?.canvas || !hostElement) return
		const target = targetRef.current
		const container = hostElement.parentElement
		if (!target || !container) return

		const canvasRect = app.canvas.getBoundingClientRect()
		const containerRect = container.getBoundingClientRect()
		const bounds = target.getBounds()

		const last = lastSyncedRef.current
		if (
			bounds.x === last.x &&
			bounds.y === last.y &&
			bounds.width === last.width &&
			bounds.height === last.height &&
			canvasRect.x === last.canvasX &&
			canvasRect.y === last.canvasY &&
			containerRect.x === last.containerX &&
			containerRect.y === last.containerY
		) {
			return
		}

		lastSyncedRef.current = {
			x: bounds.x,
			y: bounds.y,
			width: bounds.width,
			height: bounds.height,
			canvasX: canvasRect.x,
			canvasY: canvasRect.y,
			containerX: containerRect.x,
			containerY: containerRect.y,
		}

		setStyle(computeStyle({ bounds, canvasRect, containerRect }))
	})

	const syncPosition = useCallback(() => {
		if (!app?.canvas || !hostElement) return

		const target = targetRef.current
		const container = hostElement.parentElement
		if (!target || !container) return

		const canvasRect = app.canvas.getBoundingClientRect()
		const containerRect = container.getBoundingClientRect()
		const bounds = target.getBounds()

		lastSyncedRef.current = {
			x: bounds.x,
			y: bounds.y,
			width: bounds.width,
			height: bounds.height,
			canvasX: canvasRect.x,
			canvasY: canvasRect.y,
			containerX: containerRect.x,
			containerY: containerRect.y,
		}

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
