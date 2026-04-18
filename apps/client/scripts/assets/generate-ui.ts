import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SpritesheetData } from 'pixi.js'
import sharp from 'sharp'
import {
	clearAtlasOutput,
	ensureFastPackInstalled,
	packProject,
} from './fastpack'

// Get the current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __assetspath = path.join(__dirname, '../../src/assets')

async function loadJSON<T>(filePath: string): Promise<T> {
	const data = await fs.promises.readFile(filePath, 'utf-8')
	return JSON.parse(data)
}

async function generateSpritesheetFile(outputPath: string) {
	const files = await fs.promises.readdir(outputPath)
	const jsonFiles = files.filter(
		(file) => file.endsWith('.json') && file !== 'spritesheets.json',
	)
	jsonFiles.sort((left, right) =>
		left.localeCompare(right, undefined, { numeric: true }),
	)

	const entries: string[] = []
	for (const jsonFile of jsonFiles) {
		const jsonPath = path.join(outputPath, jsonFile)
		const jsonData = await loadJSON<SpritesheetData>(jsonPath)
		const keys = Object.keys(jsonData.frames)

		const baseName = path.basename(jsonPath, '.json').replace('-', '')
		for (const key of keys) {
			entries.push(`  "${key}": "${baseName}"`)
		}
	}

	const texMap = `{\n${entries.join(',\n')}\n}\n`

	const spritesheetsFilePath = path.join(outputPath, 'spritesheets.json')
	await fs.promises.writeFile(spritesheetsFilePath, texMap)
}

async function patchSpritesheetResolution(
	outputPath: string,
	resolution: number,
) {
	const files = await fs.promises.readdir(outputPath)
	const jsonFiles = files.filter(
		(file) => file.endsWith('.json') && file !== 'spritesheets.json',
	)

	for (const jsonFile of jsonFiles) {
		const jsonPath = path.join(outputPath, jsonFile)
		const data = await loadJSON<{ meta: { scale: number } }>(jsonPath)
		data.meta.scale = resolution
		await fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2))
	}
}

export async function generateUITextures() {
	const texPackerPath = path.join(__dirname, '../../tools/texpacker')
	const svgInputPath = path.join(texPackerPath, 'ui')
	const pngTempPath = path.join(texPackerPath, 'ui/png')
	const outputPath = path.join(__assetspath, 'ui')

	await ensureFastPackInstalled()
	await clearAtlasOutput(outputPath, ['ui'])

	try {
		await fs.promises.mkdir(pngTempPath, { recursive: true })

		const files = await fs.promises.readdir(svgInputPath)
		const svgFiles = files.filter((file) => file.endsWith('.svg'))

		for (const svgFile of svgFiles) {
			const inputPath = path.join(svgInputPath, svgFile)
			const outputFile = svgFile.replace('.svg', '.png')
			const outputFilePath = path.join(pngTempPath, outputFile)

			await sharp(inputPath, { density: 144 }).png().toFile(outputFilePath)
		}

		await packProject({
			projectPath: path.join(texPackerPath, 'ui.fpsheet'),
			outputPath,
			name: 'ui',
		})

		await patchSpritesheetResolution(outputPath, 2)
		await generateSpritesheetFile(outputPath)
	} finally {
		await fs.promises.rm(pngTempPath, { recursive: true, force: true })
	}
}
