import { useEffect } from 'react'

const EDITABLE_SELECTOR =
	'input, textarea, [contenteditable="true"], [contenteditable="plaintext-only"], .input-overlay, .textarea-overlay'

const BLOCKED_SURFACE_SELECTOR = '#root canvas, .game-surface-overlay-host'

const getTargetElement = (target: EventTarget | null) => {
	if (target instanceof HTMLElement) return target
	if (target instanceof Node) return target.parentElement

	return null
}

const isEditableTarget = (target: EventTarget | null) => {
	const targetElement = getTargetElement(target)
	if (!targetElement) return false

	return (
		targetElement.closest(EDITABLE_SELECTOR) !== null ||
		document.activeElement?.closest(EDITABLE_SELECTOR) !== null
	)
}

const isBlockedSurfaceTarget = (target: EventTarget | null) => {
	const targetElement = getTargetElement(target)
	if (!targetElement) return false

	return targetElement.closest(BLOCKED_SURFACE_SELECTOR) !== null
}

const shouldAllowNativeInteraction = (target: EventTarget | null) => {
	const activeElement = document.activeElement

	return (
		isEditableTarget(target) ||
		(activeElement instanceof HTMLElement &&
			activeElement.closest(EDITABLE_SELECTOR) !== null)
	)
}

export function useGameSurfaceSelectionGuard() {
	useEffect(() => {
		const root = document.getElementById('root')
		if (!root) return

		const preventBrowserInteraction = (event: Event) => {
			if (
				!isBlockedSurfaceTarget(event.target) ||
				shouldAllowNativeInteraction(event.target)
			) {
				return
			}

			event.preventDefault()
		}

		const clearSelection = () => {
			const selection = document.getSelection()
			if (!selection || selection.rangeCount === 0) return

			const anchorNode = selection.anchorNode
			if (!isBlockedSurfaceTarget(anchorNode)) return
			if (shouldAllowNativeInteraction(anchorNode)) return

			selection.removeAllRanges()
		}

		const listenerOptions = { capture: true, passive: false } as const

		root.addEventListener(
			'touchstart',
			preventBrowserInteraction,
			listenerOptions,
		)
		root.addEventListener('contextmenu', preventBrowserInteraction, true)
		root.addEventListener('selectstart', preventBrowserInteraction, true)
		document.addEventListener('selectionchange', clearSelection)

		return () => {
			root.removeEventListener(
				'touchstart',
				preventBrowserInteraction,
				listenerOptions,
			)
			root.removeEventListener('contextmenu', preventBrowserInteraction, true)
			root.removeEventListener('selectstart', preventBrowserInteraction, true)
			document.removeEventListener('selectionchange', clearSelection)
		}
	}, [])
}
