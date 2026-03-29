import { Assets, ExtensionType, Point } from 'pixi.js'
import specialEffectsBin from '../assets/inits/specialeffects.o.bin'

import type { SpecialEffectData } from '../types/sprites'

const parserName = 'loadSpecialEffects'

export const loadSpecialEffects = async () => {
	await Assets.load({
		src: specialEffectsBin,
		parser: parserName,
	})
}

export const specialEffectsParser = {
	name: parserName,
	extension: {
		type: ExtensionType.LoadParser,
	},
	test: (url: string): boolean => {
		return url.endsWith('o.bin')
	},
	load: async (url: string): Promise<{ [key: string]: SpecialEffectData }> => {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`Error loading .bin file: ${response.statusText}`)
		}

		const buffer = await response.arrayBuffer()
		const view = new DataView(buffer)

		let offset = 263
		const quantity = view.getInt16(offset, true)
		offset += 2

		const directedSpriteData: { [key: string]: SpecialEffectData } = {}

		for (let i = 0; i < quantity; i++) {
			const sprite = view.getInt16(offset, true)
			offset += 2

			const x = view.getInt16(offset, true)
			offset += 2

			const y = view.getInt16(offset, true)
			offset += 2

			directedSpriteData[i] = {
				sprite: sprite.toString(),
				offset: new Point(x, y),
			}
		}

		return directedSpriteData
	},
}
