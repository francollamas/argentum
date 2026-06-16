import type { Bounds } from 'pixi.js'
import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

type BoundsTarget = {
	getBounds: () => Bounds
}

type EditorBounds = {
	width: number
	height: number
}

export function useEditorBounds(
	targetRef: RefObject<BoundsTarget | null>,
	fallbackWidth: number,
	fallbackHeight: number,
) {
	const [bounds, setBounds] = useState<EditorBounds>({
		width: fallbackWidth,
		height: fallbackHeight,
	})

	useEffect(() => {
		let frame = 0

		const updateBounds = () => {
			const nextBounds = targetRef.current?.getBounds()

			setBounds((currentBounds) => {
				const nextWidth = nextBounds?.width ?? fallbackWidth
				const nextHeight = nextBounds?.height ?? fallbackHeight

				if (
					currentBounds.width === nextWidth &&
					currentBounds.height === nextHeight
				) {
					return currentBounds
				}

				return {
					width: nextWidth,
					height: nextHeight,
				}
			})

			frame = requestAnimationFrame(updateBounds)
		}

		updateBounds()

		return () => {
			cancelAnimationFrame(frame)
		}
	}, [fallbackHeight, fallbackWidth, targetRef])

	return bounds
}
