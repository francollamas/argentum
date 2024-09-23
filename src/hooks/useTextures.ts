import {useCallback, useEffect, useState} from "react";
import {Assets, Spritesheet, Texture} from "pixi.js";
import {textureData as textureDataList} from "../assets.ts";

// const loadJson = async <T>(fileName: string): Promise<T> => {
//     const file = await import(`../assets/textures/${fileName}.json`);
//     return file.default
// }
//
// const loadImage = async (fileName: string): Promise<HTMLImageElement> => {
//     const imageUrl = new URL(`../assets/textures/${fileName}`, import.meta.url).href
//     return new Promise((resolve, reject) => {
//         const img = new Image()
//         img.src = imageUrl
//         img.onload = () => resolve(img)
//         img.onerror = (error) => reject(error)
//     });
// };

export const useTextures = () => {
    const [textureRecord, setTextureRecord] = useState<Record<string, Texture>>({})
    const [isLoaded, setLoaded] = useState(false)


    useEffect(() => { // TODO F: sacar afuera y llamar desde el arranque para que no se vuelva a ejecutar!!! (ver de guardar en redux, o algun contexto de Pixi)
        (async () => {

            //const textureList = await loadJson<string[]>("textures")
            const parsedSpritesheetList: Record<string, Texture>[] = []

            for (const textureData of textureDataList) {

                //if (!textureData.json.meta?.image) continue; // TODO F deberiamos manejar este error?

                //const imageFile = await loadImage(jsonFile.meta?.image)
                const imageTexture = await Assets.load(textureData.png)
                console.log("imagen cargada!" + textureData.png)

                const spritesheet = new Spritesheet(imageTexture, textureData.json)
                const parsedSpritesheet = await spritesheet.parse()
                parsedSpritesheetList.push(parsedSpritesheet)

                const listadoRecords: Record<string, Texture> = Object.assign({}, ...parsedSpritesheetList);

                setTextureRecord({...textureRecord, ...listadoRecords})
                setLoaded(true)
            }
        })()
    }, []);

    const getTexture = useCallback((id: string) => {
        return textureRecord[id]
    }, [textureRecord])

    return {isLoaded, getTexture}
}