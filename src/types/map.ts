import { GAME_CONSTANTS } from '../constants/game'

export type Position = {
	x: number
	y: number
}

export type Bounds = {
	minX: number
	minY: number
	maxX: number
	maxY: number
}

export enum Direction {
	North = 0,
	Northeast = 1,
	East = 2,
	Southeast = 3,
	South = 4,
	Southwest = 5,
	West = 6,
	Northwest = 7,
}

export type TileLayer = {
	spriteId: string | null
}

export type MapTile = {
	layers: [TileLayer, TileLayer, TileLayer, TileLayer]
	isBlocked: boolean
	trigger: number | null
	characterIndex: number | null
	objectSpriteId: string | null
	hasWater: boolean
	lightColor?: string
	particleEffect?: string
}

export type GameMap = {
	number: number
	name?: string
	bounds: Bounds
	tiles: MapTile[][]
	width: number
	height: number
}

export type MapLoadData = {
	mapNumber: number
	rawData: ArrayBuffer
}

export type TileCoordinates = {
	x: number
	y: number
}

export type ViewportInfo = {
	centerX: number
	centerY: number
	tilesWidth: number
	tilesHeight: number
	visibleBounds: Bounds
}

export const { MAP: MAP_CONSTANTS } = GAME_CONSTANTS
