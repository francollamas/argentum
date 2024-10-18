import { Assets, Spritesheet, Texture } from 'pixi.js'
import { useEffect, useState } from 'react'
import { textureData as textureDataList } from '../assets.ts'
import { spritesheets } from '../assets.ts'

export const useTexture = (id: string) => {
	const [texture, setTexture] = useState<Texture>(Texture.EMPTY)

	useEffect(() => {
		;(async () => {
			const spritesheetName = spritesheets[id]
			if (!spritesheetName) {
				console.warn(`Texture ${id} not found`)
				setTexture(Texture.EMPTY)
				return
			}

			if (!Assets.cache.has(spritesheetName)) {
				const textureData = textureDataList[spritesheetName]
				const imageTexture = await Assets.load(textureData.png)

				const spritesheet = new Spritesheet(imageTexture, textureData.json)
				await spritesheet.parse()

				Assets.cache.set(spritesheetName, spritesheet)
			}

			const spritesheet = Assets.get<Spritesheet>(spritesheetName)
			if (!spritesheet) {
				setTexture(Texture.EMPTY)
			}

			setTexture(spritesheet.textures[id])
		})()
	}, [id])

	return texture
}
