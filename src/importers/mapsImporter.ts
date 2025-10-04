// Import all map files with glob pattern
const mapFiles = import.meta.glob('../assets/maps/*.mmap', {
	query: '?url',
	import: 'default',
})

function getBaseName(path: string): string {
	const filename = path.split('/').pop() || ''
	return filename.replace(/\.mmap$/, '')
}

// Create mapping from map number to import function
const mapMap: Record<string, () => Promise<string>> = {}

// Process each map file path and create the mapping
Object.entries(mapFiles).forEach(([mapPath, importFn]) => {
	const baseName = getBaseName(mapPath)
	mapMap[baseName] = importFn as () => Promise<string>
})

import { logger } from '../utils/logger'

export async function importMap(mapName: string): Promise<string | undefined> {
	logger.debug(`Attempting to load map: ${mapName}`)
	logger.debug('Available maps', { maps: Object.keys(mapMap) })

	const importFn = mapMap[mapName]
	if (!importFn) {
		logger.error(`Map import function not found for: ${mapName}`, {
			requestedMap: mapName,
			availableMaps: Object.keys(mapMap),
		})
		return undefined
	}

	logger.debug(`Found import function for map: ${mapName}`)

	try {
		const url = await importFn()
		logger.debug(`Successfully loaded map URL`, { mapName, url })
		return url
	} catch (error) {
		logger.error(`Failed to load map ${mapName}`, { mapName, error })
		throw error
	}
}
