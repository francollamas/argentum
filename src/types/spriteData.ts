import type { Rectangle } from 'pixi.js'

export type SpriteData = {
	textureID: string
	region: Rectangle
	frames: string[]
	speed: number
}
