import { GAME_CONSTANTS } from '../constants/game'

export type Bounds = {
	minX: number
	minY: number
	maxX: number
	maxY: number
}

export type TileLayer = {
	spriteId: string | null
}

export type MapTile = {
	layers: [TileLayer, TileLayer, TileLayer, TileLayer]
	isBlocked: boolean
	trigger: number | null
	objectSpriteId: string | null
	hasWater: boolean
}

export type GameMap = {
	number: number
	name?: string
	bounds: Bounds
	tiles: MapTile[][]
	width: number
	height: number
}

export const { MAP: MAP_CONSTANTS } = GAME_CONSTANTS
