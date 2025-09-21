import { Assets, ExtensionType, Point } from 'pixi.js'
import bodiesBin from '../assets/inits/bodies.odir.bin'
import headsBin from '../assets/inits/heads.dir.bin'
import helmetsBin from '../assets/inits/helmets.dir.bin'
import shieldsBin from '../assets/inits/shields.dir.bin'
import weaponsBin from '../assets/inits/weapons.dir.bin'

import type { CharacterPartData } from '../types/sprites'
import { Direction } from '../types/general'

const parserName = 'loadCharacterParts'

export const loadBodies = async () => {
	await Assets.load({
		src: bodiesBin,
		parser: parserName,
	})
}

export const loadHeads = async () => {
	await Assets.load({
		src: headsBin,
		parser: parserName,
	})
}

export const loadHelmets = async () => {
	await Assets.load({
		src: helmetsBin,
		parser: parserName,
	})
}

export const loadShields = async () => {
	await Assets.load({
		src: shieldsBin,
		parser: parserName,
	})
}

export const loadWeapons = async () => {
	await Assets.load({
		src: weaponsBin,
		parser: parserName,
	})
}

export const characterPartsParser = {
	name: parserName,
	extension: {
		type: ExtensionType.LoadParser,
	},
	test: (url: string): boolean => {
		return url.endsWith('dir.bin')
	},
	load: async (url: string): Promise<{ [key: string]: CharacterPartData }> => {
		const response = await fetch(url)

		const hasOffset = url.endsWith('odir.bin')

		if (!response.ok) {
			throw new Error(`Error loading .bin file: ${response.statusText}`)
		}

		const buffer = await response.arrayBuffer()
		const view = new DataView(buffer)

		let offset = 263
		const quantity = view.getInt16(offset, true)
		offset += 2

		const directedSpriteData: { [key: string]: CharacterPartData } = {}

		for (let i = 0; i < quantity; i++) {
			const spriteData: CharacterPartData = {
				directions: {} as { [key in Direction]: string },
				offset: new Point(0, 0),
			}

			for (const direction of Object.values(Direction)) {
				const sprite = view.getInt16(offset, true)
				offset += 2
				spriteData.directions[direction] = sprite.toString()
			}

			if (hasOffset) {
				const x = view.getInt16(offset, true)
				offset += 2
				const y = view.getInt16(offset, true)
				offset += 2
				spriteData.offset = new Point(x, y)
			}

			directedSpriteData[i] = spriteData
		}

		return directedSpriteData
	},
}
