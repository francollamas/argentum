const mapFiles = import.meta.glob('../assets/maps/*.map.bin')

type MapModule = {
	default: string
}

function getBaseName(path: string): string {
	const filename = path.split('/').pop() || ''
	return filename.replace(/\.map\.bin$/, '')
}

const mapMap: Record<string, string> = {}

Object.keys(mapFiles).forEach((mapPath) => {
	const baseName = getBaseName(mapPath)
	mapMap[baseName] = mapPath
})

export async function importMap(
	mapName: string,
): Promise<string | undefined> {
	const path = mapMap[mapName]
	if (!path) return undefined

	const mod = await mapFiles[path]() as MapModule
	const url = mod.default

	return url
}