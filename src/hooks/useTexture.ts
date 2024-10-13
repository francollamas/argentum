import { useEffect, useState } from 'react'
import { Assets, Spritesheet, type Texture } from 'pixi.js'
import { textureData as textureDataList } from '../assets.ts'
import { spritesheets } from '../assets.ts'

export const useTexture = (id: string) => {
	const [texture, setTexture] = useState<Texture | null>(null)

	useEffect(() => {
		;(async () => {
			if (!spritesheets[id]) {
				return
			}

			if (!Assets.cache.has(spritesheets[id])) {
				const textureData = textureDataList[spritesheets[id]]
				const imageTexture = await Assets.load(textureData.png)

				const spritesheet = new Spritesheet(imageTexture, textureData.json)
				await spritesheet.parse()

				Assets.cache.set(spritesheets[id], spritesheet)
			}

			const spritesheet = Assets.get<Spritesheet>(spritesheets[id])

			setTexture(spritesheet.textures[id])
		})()
	}, [id])

	return texture
}

/*    useEffect(() => { // TODO F: sacar afuera y llamar desde el arranque para que no se vuelva a ejecutar!!! (ver de guardar en redux, o algun contexto de Pixi)
        (async () => {

            //const textureList = await loadJson<string[]>("textures")
            const parsedSpritesheetList: Record<string, Texture>[] = []

            for (let i = 0; i < textureDataList.length; i++) {
                const spritesheetName = `spritesheet${i}`
                Assets.addBundle(spritesheetName, {
                    json: textureDataList[i].json,
                    image: textureDataList[i].png
                })
            }

            for (const textureData of textureDataList) {

                const sp: Spritesheet = await Assets.loadBundle('mySpritesheet')
                sp.

                //if (!textureData.json.meta?.image) continue; // TODO F deberiamos manejar este error?

                //const imageFile = await loadImage(jsonFile.meta?.image)
                const imageTexture = await Assets.load(textureData.png)

                const spritesheet = new Spritesheet(imageTexture, textureData.json)
                const parsedSpritesheet = await spritesheet.parse()
                parsedSpritesheetList.push(parsedSpritesheet)

                const listadoRecords: Record<string, Texture> = Object.assign({}, ...parsedSpritesheetList);

                setTextureRecord({...textureRecord, ...listadoRecords})
                setLoaded(true)
            }
        })()
    }, []);*/
