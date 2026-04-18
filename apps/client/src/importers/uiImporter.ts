import spritesheetsJson from '../assets/ui/spritesheets.json'
import type { SpritesheetList } from '../types/textureData'

const pngFiles = import.meta.glob('../assets/ui/*.png')
const jsonFiles = import.meta.glob('../assets/ui/*.json')

function getBaseName(path: string): string {
	const filename = path.split('/').pop() || ''
	return filename.replace(/\.(png|json)$/, '').replace(/^ui\.(\d+)$/, 'ui$1')
}

const uiTextureMap: Record<string, { pngPath: string; jsonPath: string }> = {}

Object.keys(pngFiles).forEach((pngPath) => {
	const baseName = getBaseName(pngPath)

	const jsonPath = Object.keys(jsonFiles).find(
		(path) => getBaseName(path) === baseName && !path.includes('spritesheets'),
	)

	if (jsonPath) {
		uiTextureMap[baseName] = { pngPath, jsonPath }
	}
})

type PngModule = {
	default: string
}

type JsonModule = {
	default: Record<string, unknown>
}

export async function importUITexture(
	textureName: string,
): Promise<{ png: string; json: Record<string, unknown> } | undefined> {
	const paths = uiTextureMap[textureName]
	if (!paths) return undefined

	const [pngModule, jsonModule] = await Promise.all([
		pngFiles[paths.pngPath](),
		jsonFiles[paths.jsonPath](),
	])

	return {
		png: (pngModule as PngModule).default,
		json: (jsonModule as JsonModule).default,
	}
}

export const uiSpritesheets: SpritesheetList = spritesheetsJson
