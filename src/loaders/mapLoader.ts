import { Assets, ExtensionType } from 'pixi.js'
import { GAME_CONSTANTS } from '../constants/game'
import type { GameMap, MapTile, TileLayer } from '../types/map'
import { importMap } from '../importers/mapsImporter'

const parserName = 'loadMaps'

const createEmptyTile = (): MapTile => ({
	layers: [
		{ spriteId: null },
		{ spriteId: null },
		{ spriteId: null },
		{ spriteId: null },
	] as [TileLayer, TileLayer, TileLayer, TileLayer],
	isBlocked: false,
	trigger: null,
	characterIndex: null,
	objectSpriteId: null,
	hasWater: false,
})

const createTileLayer = (spriteIndex: number): TileLayer => ({
	spriteId: spriteIndex > 0 ? String(spriteIndex) : null,
})

const checkIfTileHasWater = (tile: MapTile): boolean => {
	const layer1SpriteId = tile.layers[0].spriteId
	if (!layer1SpriteId) return false

	const spriteIndex = Number.parseInt(layer1SpriteId, 10)
	if (Number.isNaN(spriteIndex)) return false

	const isWaterSprite = GAME_CONSTANTS.WATER_SPRITE_RANGES.some(
		([min, max]) => spriteIndex >= min && spriteIndex <= max,
	)
	const layer2IsEmpty = tile.layers[1].spriteId === null

	return isWaterSprite && layer2IsEmpty
}

const parseMapData = (mapNumber: number, buffer: ArrayBuffer): GameMap => {
	const view = new DataView(buffer)
	let offset = GAME_CONSTANTS.MAP.HEADER_SIZE

	const width =
		Math.abs(GAME_CONSTANTS.MAP.MAX_X - GAME_CONSTANTS.MAP.MIN_X) + 1
	const height =
		Math.abs(GAME_CONSTANTS.MAP.MAX_Y - GAME_CONSTANTS.MAP.MIN_Y) + 1

	const tiles: MapTile[][] = Array.from({ length: width }, () =>
		Array.from({ length: height }, () => createEmptyTile()),
	)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const flags = view.getUint8(offset++)
			const tile = tiles[x][y]

			tile.isBlocked = (flags & 1) > 0

			const layer1SpriteId = view.getUint16(offset, true)
			offset += 2
			tile.layers[0] = createTileLayer(layer1SpriteId)

			if ((flags & 2) > 0) {
				const layer2SpriteId = view.getUint16(offset, true)
				offset += 2
				tile.layers[1] = createTileLayer(layer2SpriteId)
			}

			if ((flags & 4) > 0) {
				const layer3SpriteId = view.getUint16(offset, true)
				offset += 2
				tile.layers[2] = createTileLayer(layer3SpriteId)
			}

			if ((flags & 8) > 0) {
				const layer4SpriteId = view.getUint16(offset, true)
				offset += 2
				tile.layers[3] = createTileLayer(layer4SpriteId)
			}

			if ((flags & 16) > 0) {
				tile.trigger = view.getUint16(offset, true)
				offset += 2
			}

			tile.hasWater = checkIfTileHasWater(tile)
		}
	}

	return {
		number: mapNumber,
		bounds: {
			minX: GAME_CONSTANTS.MAP.MIN_X,
			minY: GAME_CONSTANTS.MAP.MIN_Y,
			maxX: GAME_CONSTANTS.MAP.MAX_X,
			maxY: GAME_CONSTANTS.MAP.MAX_Y,
		},
		tiles,
		width,
		height,
	}
}

export const mapsParser = {
	name: parserName,
	extension: {
		type: ExtensionType.LoadParser,
	},
	test: (url: string): boolean => url.endsWith('.map.bin'),
	load: async (url: string): Promise<GameMap> => {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to load map: ${response.statusText}`)
		}
		const buffer = await response.arrayBuffer()
		const mapNumber = Number.parseInt(
			url.split('/').pop()?.replace('.map.bin', '') || '0',
			10,
		)
		return parseMapData(mapNumber, buffer)
	},
}

export const getMap = async (mapNumber: number): Promise<GameMap> => {
	const cacheKey = `map_${mapNumber}`
	if (Assets.cache.has(cacheKey)) {
		return Assets.cache.get(cacheKey)
	}

	const importedMap = await importMap(mapNumber.toString())
	if (!importedMap) {
		throw new Error(`Map ${mapNumber} not found`)
	}

	const map = await Assets.load(importedMap)
	Assets.cache.set(cacheKey, map)
	return map
}