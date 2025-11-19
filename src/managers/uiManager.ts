import { Assets, Spritesheet, type SpritesheetData, Texture } from 'pixi.js'
import { importUITexture, uiSpritesheets } from '../importers/uiImporter'

export class UIManager {
	private static instance: UIManager
	private spritesheets: Map<string, Spritesheet> = new Map()
	private textureCache: Map<string, Texture> = new Map()

	public static getInstance(): UIManager {
		if (!UIManager.instance) {
			UIManager.instance = new UIManager()
		}

		return UIManager.instance
	}

	public async loadAll(): Promise<void> {
		const spritesheetNames = new Set(Object.values(uiSpritesheets))

		await Promise.all(
			Array.from(spritesheetNames).map(async (spritesheetName) => {
				const textureData = await importUITexture(spritesheetName)

				if (!textureData) {
					console.warn(`UI texture data for ${spritesheetName} not found`)
					return
				}

				const imageTexture = await Assets.load(textureData.png)

				const spritesheet = new Spritesheet(
					imageTexture,
					textureData.json as unknown as SpritesheetData,
				)
				await spritesheet.parse()

				this.spritesheets.set(spritesheetName, spritesheet)

				for (const [textureName, texture] of Object.entries(
					spritesheet.textures,
				)) {
					this.textureCache.set(textureName, texture)
				}
			}),
		)
	}

	public get(name: string): Texture {
		const texture = this.textureCache.get(name)

		if (!texture) {
			console.warn(`UI texture ${name} not found`)
			return Texture.EMPTY
		}

		return texture
	}
}

export const uiManager = UIManager.getInstance()
