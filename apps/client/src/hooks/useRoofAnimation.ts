import { useTick } from '@pixi/react'
import * as TWEEN from '@tweenjs/tween.js'
import type { Container } from 'pixi.js'
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

/**
 * Custom hook to handle roof fade animation based on trigger state
 * @param isInRoofTrigger - Whether the player is currently in a roof trigger area
 * @param containerRef - Reference to the Container that holds the roof layer
 */
export const useRoofAnimation = (
	isInRoofTrigger: boolean,
	containerRef: RefObject<Container | null>,
) => {
	const activeTweenRef = useRef<TWEEN.Tween<{ alpha: number }> | null>(null)
	const previousTriggerState = useRef<boolean | null>(null)

	// Update Tween.js animations on each frame
	useTick((ticker) => {
		if (activeTweenRef.current) {
			activeTweenRef.current.update(ticker.lastTime)
		}
	})

	// Set initial alpha and animate when trigger state changes
	useEffect(() => {
		if (!containerRef.current) return

		const container = containerRef.current
		const targetAlpha = isInRoofTrigger ? 0 : 1

		// First time: set alpha immediately without animation
		if (previousTriggerState.current === null) {
			container.alpha = targetAlpha
			previousTriggerState.current = isInRoofTrigger
			return
		}

		// Skip if already at target
		if (Math.abs(container.alpha - targetAlpha) < 0.01) {
			previousTriggerState.current = isInRoofTrigger
			return
		}

		// Stop any existing tween
		if (activeTweenRef.current) {
			activeTweenRef.current.stop()
		}

		// Animate to target alpha
		activeTweenRef.current = new TWEEN.Tween({ alpha: container.alpha })
			.to({ alpha: targetAlpha }, 500)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate((obj) => {
				container.alpha = obj.alpha
			})
			.onComplete(() => {
				activeTweenRef.current = null
			})
			.start()

		previousTriggerState.current = isInRoofTrigger
	}, [isInRoofTrigger, containerRef])
}
