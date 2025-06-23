import type { Point, Rectangle } from 'pixi.js'
import type { Direction } from './general'

export type SpriteData = {
	textureID: string
	region: Rectangle
	frames: string[]
	speed: number
}

export type CharacterPartData = {
	directions: {
		[direction in Direction]: string
	}
	offset: Point
}

export type SpecialEffectData = {
	sprite: string
	offset: Point
}
