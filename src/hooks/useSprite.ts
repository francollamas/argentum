import { useEffect, useState } from 'react'
import { Assets, Rectangle } from 'pixi.js'
import { Texture } from 'pixi.js'
import spritesBin from '../assets/inits/sprites.bin'
import { TextureManager } from '../managers/textureManager.ts'

export const useSprite = (id: string) => {
	const [textures, setTextures] = useState<Texture[]>([])

	useEffect(() => {
		;(async () => {
			const spritesData = Assets.get(spritesBin)
			const spriteData = spritesData[id]
			if (!spriteData) return

			const textures: Texture[] = await Promise.all(
				spriteData.frames.map(async (frame: string) => {
					const frameData = spritesData[frame]

					const texture = await TextureManager.getInstance().load(
						frameData.textureID,
					)

					return new Texture({
						source: texture.source,
						frame: new Rectangle(
							texture.frame.x + frameData.region.x,
							texture.frame.y + frameData.region.y,
							frameData.region.width,
							frameData.region.height,
						),
					})
				}),
			)

			setTextures(textures)
		})()
	}, [id])

	return { textures }
}
