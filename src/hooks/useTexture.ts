import { Texture } from 'pixi.js'
import { useEffect, useState } from 'react'
import { TextureManager } from '../managers/textureManager.ts'

export const useTexture = (id: string) => {
	const [texture, setTexture] = useState<Texture>(Texture.EMPTY)

	useEffect(() => {
		;(async () => {
			const texture = await TextureManager.getInstance().load(id)
			setTexture(texture)
		})()
	}, [id])

	return texture
}
