import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
	clearAtlasOutput,
	ensureAtlasifyInstalled,
	packAtlas,
} from './atlasify'
import { generateSpritesheetManifest, patchSpritesheets } from './spritesheets'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __assetspath = path.join(__dirname, '../../src/assets')

export async function generateUITextures() {
	const texPackerPath = path.join(__dirname, '../../tools/texpacker')
	const svgInputPath = path.join(texPackerPath, 'ui')
	const pngTempPath = path.join(texPackerPath, 'ui/png')
	const outputPath = path.join(__assetspath, 'ui')

	await ensureAtlasifyInstalled()
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

		await packAtlas({
			inputPath: pngTempPath,
			outputPath,
			outputName: 'ui',
			width: 4096,
			height: 4096,
		})

		await patchSpritesheets(outputPath, 2)
		await generateSpritesheetManifest(outputPath)
	} finally {
		await fs.promises.rm(pngTempPath, { recursive: true, force: true })
	}
}
