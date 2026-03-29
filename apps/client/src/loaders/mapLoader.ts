import { Assets, ExtensionType } from 'pixi.js'
import { GAME_CONSTANTS } from '../constants/game'
import { importMap } from '../importers/mapsImporter'
import type { GameMap, MapTile, TileLayer } from '../types/map'

const parserName = 'loadMaps'
const CURRENT_MAP_CACHE_KEY = 'current_map'

/**
 * Loads a map by number. Only one map is kept in cache at a time.
 * @param mapNumber - The map number to load
 * @returns The loaded GameMap
 */
export const loadMap = async (mapNumber: number): Promise<GameMap> => {
	const cacheKey = CURRENT_MAP_CACHE_KEY

	// If we already have this exact map loaded, return it
	if (Assets.cache.has(cacheKey)) {
		const cachedMap = Assets.cache.get<GameMap>(cacheKey)
		if (cachedMap && cachedMap.number === mapNumber) {
			return cachedMap
		}
	}

	// Load the new map
	const importedMap = await importMap(mapNumber.toString())
	if (!importedMap) {
		throw new Error(`Map ${mapNumber} not found`)
	}

	const map = await Assets.load<GameMap>(importedMap)

	// Replace whatever map was in cache with the new one
	Assets.cache.set(cacheKey, map)

	return map
}

const createEmptyTile = (): MapTile => ({
	layers: [
		{ spriteId: null },
		{ spriteId: null },
		{ spriteId: null },
		{ spriteId: null },
	] as [TileLayer, TileLayer, TileLayer, TileLayer],
	isBlocked: false,
	trigger: null,
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
	test: (url: string): boolean => url.endsWith('.mmap'),
	load: async (url: string): Promise<GameMap> => {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to load map: ${response.statusText}`)
		}
		const buffer = await response.arrayBuffer()
		const mapNumber = Number.parseInt(
			url.split('/').pop()?.replace('.mmap', '') || '0',
			10,
		)
		return parseMapData(mapNumber, buffer)
	},
}
