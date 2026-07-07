import type { Container } from 'pixi.js'
import { useCallback, useRef } from 'react'

type PixiLayoutTarget = Pick<Container, 'on' | 'off'>

export function usePixiLayoutListener<T extends PixiLayoutTarget>(
	onLayout: () => void,
) {
	const nodeRef = useRef<T | null>(null)

	const refCallback = useCallback(
		(node: T | null) => {
			const previousNode = nodeRef.current
			if (previousNode) {
				previousNode.off('layout', onLayout)
			}

			nodeRef.current = node

			if (node) {
				node.on('layout', onLayout)
				onLayout()
			}
		},
		[onLayout],
	)

	return {
		nodeRef,
		refCallback,
	}
}
