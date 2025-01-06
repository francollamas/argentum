import { useEffect, useState } from 'react'
import { extensions, ExtensionType, Rectangle } from 'pixi.js'
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

					// Skip the first 4 bytes (not relevant for the current logic)
					offset += 4

					// Read the number of sprites
					const spriteCount = view.getInt32(offset, true)
					offset += 4

					// Process each SpriteData
					while (offset < view.byteLength) {
						// Read the index
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

						// Read the number of frames
						const frameCount = view.getInt16(offset, true)
						offset += 2

						if (frameCount === 1) {
							// Single-frame Sprite
							sprite.frames.push(index)

							// Read properties
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
							sprite.speed = view.getFloat32(offset, true) / 45
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
