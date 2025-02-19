import { ExtensionType, Rectangle, extensions } from 'pixi.js'
import { useEffect, useState } from 'react'
import type { SpriteData } from '../../types'

export const useSpritesParser = () => {
	const [added, setAdded] = useState(false)

	useEffect(() => {
		;(async () => {
			const spritesLoader = {
				name: 'loadSprites',
				extension: {
					type: ExtensionType.LoadParser,
				},
				test: (url: string): boolean => {
					return url.endsWith('.bin')
				},
				load: async (url: string): Promise<{ [key: string]: SpriteData }> => {
					const response = await fetch(url)

					if (!response.ok) {
						throw new Error(`Error loading .bin file: ${response.statusText}`)
					}

					const spriteData: { [key: string]: SpriteData } = {}

					const buffer = await response.arrayBuffer()
					const view = new DataView(buffer)

					let offset = 0
					offset += 4
					const spriteCount = view.getInt32(offset, true)
					offset += 4

					while (offset < view.byteLength) {
						const index = view.getInt32(offset, true)
						offset += 4

						if (index <= 0 || index > spriteCount) {
							throw new Error(`Invalid index: ${index}`)
						}

						spriteData[index] = {
							textureID: '',
							region: new Rectangle(0, 0, 0, 0),
							frames: [],
							speed: 0,
						}

						const sprite = spriteData[index]
						const frameCount = view.getInt16(offset, true)
						offset += 2

						if (frameCount === 1) {
							sprite.frames.push(index.toString())
							sprite.textureID = `${view.getInt32(offset, true)}`
							offset += 4

							sprite.region.x = view.getInt16(offset, true)
							offset += 2

							sprite.region.y = view.getInt16(offset, true)
							offset += 2

							sprite.region.width = view.getInt16(offset, true)
							offset += 2

							sprite.region.height = view.getInt16(offset, true)
							offset += 2
						} else {
							// Animation Sprite
							for (let i = 0; i < frameCount; i++) {
								const frame = view.getInt32(offset, true)
								offset += 4

								if (frame > 0 && frame <= spriteCount) {
									sprite.frames.push(frame.toString())
								}
							}

							// Read animation properties
							sprite.speed = view.getFloat32(offset, true) / 2025
							offset += 4

							const firstFrame = spriteData[sprite.frames[0]]
							if (firstFrame) {
								sprite.region.width = firstFrame.region.width
								sprite.region.height = firstFrame.region.height
							}
						}
					}

					return spriteData
				},
			}

			extensions.add(spritesLoader)
			setAdded(true)
		})()
	}, [])

	return added
}
