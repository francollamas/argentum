import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
	clearAtlasOutput,
	ensureAtlasifyInstalled,
	packAtlas,
} from './atlasify'
import { generateSpritesheetManifest, patchSpritesheets } from './spritesheets'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __assetspath = path.join(__dirname, '../../src/assets')

async function generatePackedTextures(projectName: string) {
	const texPackerPath = path.join(__dirname, '../../tools/texpacker')
	const inputPath = path.join(texPackerPath, `textures-${projectName}`)
	const outputPath = path.join(__assetspath, 'textures')
	const textureName = projectName === 'bigger' ? 'textureb' : 'texture'
	const maxSize = projectName === 'bigger' ? 2048 : 1024

	await packAtlas({
		inputPath,
		outputPath,
		outputName: textureName,
		width: maxSize,
		height: maxSize,
	})
}

export async function generateTextures() {
	const outputPath = path.join(__assetspath, 'textures')

	await ensureAtlasifyInstalled()
	await clearAtlasOutput(outputPath, ['texture', 'textureb'])
	await generatePackedTextures('normal')
	await generatePackedTextures('bigger')
	await patchSpritesheets(outputPath)
	await generateSpritesheetManifest(outputPath)
}
