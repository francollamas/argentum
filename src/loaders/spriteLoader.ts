import { Assets, ExtensionType, Rectangle } from 'pixi.js'
import spritesBin from '../assets/inits/sprites.bin'
import type { SpriteData } from '../types'

const parserName = 'loadSprites'

export const loadSprites = async () => {
	await Assets.load({
		src: spritesBin,
		loadParser: parserName,
	})
}

export const spritesParser = {
	name: parserName,
	extension: {
		type: ExtensionType.LoadParser,
	},
	test: (url: string): boolean => {
		return url.endsWith('sprites.bin')
	},
	load: async (url: string): Promise<{ [key: string]: SpriteData }> => {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`Error loading .bin file: ${response.statusText}`)
		}

		const spriteData: { [key: string]: SpriteData } = {}

		const buffer = await response.arrayBuffer()
		const view = new DataView(buffer)

		let offset = 4
		const quantity = view.getInt32(offset, true)
		offset += 4

		while (offset < view.byteLength) {
			const index = view.getInt32(offset, true)
			offset += 4

			if (index <= 0 || index > quantity) {
				throw new Error(`Invalid index: ${index}`)
			}

			spriteData[index] = {
				textureID: '',
				region: new Rectangle(),
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
				for (let i = 0; i < frameCount; i++) {
					const frame = view.getInt32(offset, true)
					offset += 4

					if (frame > 0 && frame <= quantity) {
						sprite.frames.push(frame.toString())
					}
				}

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
