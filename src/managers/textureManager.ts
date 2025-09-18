import { Assets, Spritesheet, Texture } from 'pixi.js'
import { importTexture, spritesheets } from '../importers/texturesImporter.ts'

export class TextureManager {
	private static instance: TextureManager

	public static getInstance(): TextureManager {
		if (!TextureManager.instance) {
			TextureManager.instance = new TextureManager()
		}

		return TextureManager.instance
	}

	public async load(id: string): Promise<Texture> {
		const spritesheetName = spritesheets[id]
		if (!spritesheetName) {
			console.warn(`Texture ${id} not found`)
			return Texture.EMPTY
		}

		if (!Assets.cache.has(spritesheetName)) {
			const textureData = await importTexture(spritesheetName)

			if (!textureData) {
				console.warn(`Texture data for ${spritesheetName} not found`)
				return Texture.EMPTY
			}

			const imageTexture = await Assets.load(textureData.png)

			const spritesheet = new Spritesheet(imageTexture, textureData.json)
			await spritesheet.parse()

			if (!Assets.cache.has(spritesheetName)) {
				Assets.cache.set(spritesheetName, spritesheet)
			}
		}

		const spritesheet = Assets.get<Spritesheet>(spritesheetName)
		if (!spritesheet) {
			return Texture.EMPTY
		}

		return spritesheet.textures[id]
	}
}
