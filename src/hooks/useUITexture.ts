import type { Texture } from 'pixi.js'
import { uiManager } from '../managers/uiManager'

export const useUITexture = (name: string): Texture => {
	return uiManager.get(name)
}
