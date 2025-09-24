// Import all map files with glob pattern
const mapFiles = import.meta.glob('../assets/maps/*.mmap', { eager: false, as: 'url' })

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

export async function importMap(
	mapName: string,
): Promise<string | undefined> {
	console.log(`[MAP DEBUG] Attempting to load map: ${mapName}`)
	console.log(`[MAP DEBUG] Available maps:`, Object.keys(mapMap))
	console.log(`[MAP DEBUG] Import functions:`, mapFiles)

	const importFn = mapMap[mapName]
	if (!importFn) {
		console.error(`[MAP DEBUG] Map import function not found for: ${mapName}`)
		return undefined
	}

	console.log(`[MAP DEBUG] Found import function for: ${mapName}`)

	try {
		const url = await importFn()
		console.log(`[MAP DEBUG] Successfully loaded URL: ${url}`)
		return url
	} catch (error) {
		console.error(`[MAP DEBUG] Failed to load map ${mapName}:`, error)
		throw error
	}
}