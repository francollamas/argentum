import { Assets, Spritesheet, Texture } from 'pixi.js'
import { spritesheets, textureData as textureDataList } from '../assets.ts'

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
			const textureData = textureDataList[spritesheetName]
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
