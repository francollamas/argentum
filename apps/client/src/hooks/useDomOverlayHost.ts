import type { Application } from 'pixi.js'
import { useEffect, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'

type DomOverlayHost = {
	hostElement: HTMLDivElement | null
	overlayRoot: Root | null
}

export function useDomOverlayHost(
	app: Application | null | undefined,
): DomOverlayHost {
	const [host, setHost] = useState<DomOverlayHost>({
		hostElement: null,
		overlayRoot: null,
	})

	useEffect(() => {
		if (!app?.canvas) return

		const canvas = app.canvas as HTMLCanvasElement
		const canvasParent = canvas.parentElement
		if (!canvasParent) return

		const parentStyle = window.getComputedStyle(canvasParent)
		const shouldRestorePosition = parentStyle.position === 'static'
		const hostElement = document.createElement('div')
		const overlayRoot = createRoot(hostElement)
		hostElement.className = 'game-surface-overlay-host'

		if (shouldRestorePosition) {
			canvasParent.style.position = 'relative'
		}

		canvasParent.appendChild(hostElement)
		setHost({ hostElement, overlayRoot })

		return () => {
			overlayRoot.unmount()
			hostElement.remove()
			setHost({ hostElement: null, overlayRoot: null })

			if (shouldRestorePosition) {
				canvasParent.style.position = ''
			}
		}
	}, [app])

	return host
}
