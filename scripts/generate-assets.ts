import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'
import type { SpritesheetData } from 'pixi.js'

// Get the current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __assetspath = path.join(__dirname, '../src/assets')

async function loadJSON<T>(filePath: string): Promise<T> {
	const data = await fs.promises.readFile(filePath, 'utf-8')

	return JSON.parse(data)
}

async function generatePackedTextures(projectName: string) {
	const texPackerPath = path.join(__dirname, '../tools/texpacker')
	const projectPath = path.join(texPackerPath, `${projectName}.ftpp`)
	const projectFile = await fs.promises.readFile(projectPath, 'utf-8')
	const inputPath = path.join(texPackerPath, `textures-${projectName}`)
	const outputPath = path.join(__assetspath, 'textures')

	// Create a temporary project file
	const projectData = JSON.parse(projectFile)
	projectData.folders = [inputPath]
	const tempProjectPath = path.join(texPackerPath, 'temp.ftpp')
	await fs.promises.writeFile(tempProjectPath, JSON.stringify(projectData))

	// Execute the packer
	const execPromise = util.promisify(exec)
	await execPromise(
		`free-tex-packer-cli --project ${tempProjectPath} --output ${outputPath}`,
	)

	// Delete the temporary project file
	await fs.promises.unlink(tempProjectPath)
}

async function generateSpritesheetFile() {
	const texturesPath = path.join(__assetspath, 'textures')

	// Filter PNG and JSON files
	const files = await fs.promises.readdir(texturesPath)
	const jsonFiles = files.filter(
		(file) => file.endsWith('.json') && file !== 'spritesheets.json',
	)

	let texMap = '{\n'
	for (let i = 0; i < jsonFiles.length; i++) {
		const jsonPath = path.join(texturesPath, jsonFiles[i])
		const jsonData = await loadJSON<SpritesheetData>(jsonPath)
		const keys = Object.keys(jsonData.frames)

		const baseName = path.basename(jsonPath, '.json').replace('-', '')
		for (const key of keys) {
			if (i === jsonFiles.length - 1) {
				texMap += `  "${key}": "${baseName}"\n`
			} else {
				texMap += `  "${key}": "${baseName}",\n`
			}
		}
	}

	texMap += '}\n'

	// Write the imports file
	const assetsFilePath = path.join(texturesPath, 'spritesheets.json')
	await fs.promises.writeFile(assetsFilePath, texMap)
}

async function generateAssetsFile() {
	const texturesPath = path.join(__assetspath, 'textures')

	// Filter PNG and JSON files
	const files = await fs.promises.readdir(texturesPath)
	const pngFiles = files.filter((file) => file.endsWith('.png'))
	const jsonFiles = files.filter((file) => file.endsWith('.json'))

	// Find pairs of PNG and JSON files
	const textureData = pngFiles
		.map((png) => {
			const baseName = path.basename(png, '.png')
			const jsonFile = jsonFiles.find((json) => json.startsWith(baseName))
			if (jsonFile) {
				return { baseName, png, json: jsonFile }
			}
			return null
		})
		.filter(Boolean) as { baseName: string; png: string; json: string }[]

	// Generate import lines and pairs list
	let importsContent = `import spritesheetsJson from './assets/textures/spritesheets.json'\n`
	importsContent += `import type { SpritesheetList, TextureData } from './types'\n\n`

	let pairsArray = 'export const textureData: TextureData = {\n'

	const spritesheetsJson =
		'export const spritesheets: SpritesheetList = spritesheetsJson\n'

	for (let { baseName, png, json } of textureData) {
		baseName = baseName.replace('-', '')
		const importLinePng = `import ${baseName}Png from './assets/textures/${png}'\n`
		const importLineJson = `import ${baseName}Json from './assets/textures/${json}'\n`

		importsContent += importLinePng
		importsContent += importLineJson

		pairsArray += `\t${baseName}: { json: ${baseName}Json, png: ${baseName}Png },\n`
	}

	pairsArray += '}\n'

	// Write the imports file
	const assetsFilePath = path.join(__dirname, '../src/assets.ts')
	await fs.promises.writeFile(
		assetsFilePath,
		`${importsContent}\n${pairsArray}\n${spritesheetsJson}`,
	)
}

//await generatePackedTextures('normal')
//await generatePackedTextures('bigger')
await generateSpritesheetFile()
await generateAssetsFile()
