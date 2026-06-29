import type { Container, Texture } from 'pixi.js'
import { NineSliceSprite } from 'pixi.js'
import { useCallback, useEffect, useMemo, useRef } from 'react'

type NineSliceBackgroundOptions = {
	texture: Texture
	sliceSize: number
}

export function useNineSliceBackground({
	texture,
	sliceSize,
}: NineSliceBackgroundOptions) {
	const containerRef = useRef<Container>(null)

	const bgSprite = useMemo(
		() =>
			new NineSliceSprite({
				texture,
				leftWidth: sliceSize,
				topHeight: sliceSize,
				rightWidth: sliceSize,
				bottomHeight: sliceSize,
			}),
		[texture, sliceSize],
	)

	const setTexture = useCallback(
		(newTexture: Texture) => {
			bgSprite.texture = newTexture
		},
		[bgSprite],
	)

	const containerRefCallback = useCallback(
		(node: Container | null) => {
			const prev = containerRef.current

			if (prev) {
				prev.off('layout', onLayout)
				if (bgSprite.parent === prev) {
					prev.removeChild(bgSprite)
				}
			}

			containerRef.current = node

			if (node) {
				node.addChildAt(bgSprite, 0)
				node.on('layout', onLayout)
			}

			function onLayout() {
				if (!node?.layout) return
				const { width: cw, height: ch } = node.layout.computedLayout
				const textureLogicalH = texture.height
				const uniformScale = ch / textureLogicalH
				bgSprite.width = cw / uniformScale
				bgSprite.height = textureLogicalH
				bgSprite.scale.set(uniformScale)
			}
		},
		[bgSprite, texture],
	)

	useEffect(() => {
		return () => {
			const parent = bgSprite.parent
			if (parent) {
				parent.removeChild(bgSprite)
			}
			bgSprite.destroy()
		}
	}, [bgSprite])

	return { containerRefCallback, setTexture }
}
