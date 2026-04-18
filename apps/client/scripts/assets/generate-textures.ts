import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SpritesheetData } from 'pixi.js'
import {
	clearAtlasOutput,
	ensureFastPackInstalled,
	packProject,
} from './fastpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __assetspath = path.join(__dirname, '../../src/assets')

async function loadJSON<T>(filePath: string): Promise<T> {
	const data = await fs.promises.readFile(filePath, 'utf-8')

	return JSON.parse(data)
}

async function generatePackedTextures(projectName: string) {
	const texPackerPath = path.join(__dirname, '../../tools/texpacker')
	const projectPath = path.join(texPackerPath, `${projectName}.fpsheet`)
	const outputPath = path.join(__assetspath, 'textures')
	const textureName = projectName === 'bigger' ? 'textureb' : 'texture'

	await packProject({
		projectPath,
		outputPath,
		name: textureName,
	})
}

async function generateSpritesheetFile() {
	const texturesPath = path.join(__assetspath, 'textures')
	const files = await fs.promises.readdir(texturesPath)
	const jsonFiles = files.filter(
		(file) => file.endsWith('.json') && file !== 'spritesheets.json',
	)
	jsonFiles.sort((left, right) =>
		left.localeCompare(right, undefined, { numeric: true }),
	)

	const entries: string[] = []
	for (const jsonFile of jsonFiles) {
		const jsonPath = path.join(texturesPath, jsonFile)
		const jsonData = await loadJSON<SpritesheetData>(jsonPath)
		const keys = Object.keys(jsonData.frames)

		const baseName = path.basename(jsonPath, '.json').replace('-', '')
		for (const key of keys) {
			entries.push(`  "${key}": "${baseName}"`)
		}
	}

	const texMap = `{\n${entries.join(',\n')}\n}\n`
	const assetsFilePath = path.join(texturesPath, 'spritesheets.json')
	await fs.promises.writeFile(assetsFilePath, texMap)
}

export async function generateTextures() {
	await ensureFastPackInstalled()
	await clearAtlasOutput(path.join(__assetspath, 'textures'), [
		'texture',
		'textureb',
	])
	await generatePackedTextures('normal')
	await generatePackedTextures('bigger')
	await generateSpritesheetFile()
}
