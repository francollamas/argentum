import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fontsInputPath = path.join(__dirname, '../../tools/fonts')
const fontsOutputPath = path.join(__dirname, '../../public/fonts')
const charsetPath = path.join(fontsInputPath, 'charset.txt')

const execPromise = util.promisify(exec)

async function cleanOutputDirectory() {
	if (fs.existsSync(fontsOutputPath)) {
		const files = await fs.promises.readdir(fontsOutputPath)
		for (const file of files) {
			await fs.promises.unlink(path.join(fontsOutputPath, file))
		}
	} else {
		await fs.promises.mkdir(fontsOutputPath, { recursive: true })
	}
}

async function generateFonts() {
	const files = await fs.promises.readdir(fontsInputPath)
	const ttfFiles = files.filter((file) => file.endsWith('.ttf'))
	const fontAliases: string[] = []

	for (const ttfFile of ttfFiles) {
		const fontPath = path.join(fontsInputPath, ttfFile)
		const fontName = path.basename(ttfFile, '.ttf')

		console.log(`Generating MSDF font for ${fontName}...`)

		await execPromise(
			`npx msdf-bmfont-xml "${fontPath}" -o "${fontsOutputPath}/${fontName}.png" -m 512,512 -t msdf -f xml --pot --smart-size --charset-file "${charsetPath}"`,
		)

		fontAliases.push(fontName)
	}

	return fontAliases
}

async function createFontsManifest(fontAliases: string[]) {
	const manifestPath = path.join(fontsOutputPath, 'fonts.json')
	await fs.promises.writeFile(manifestPath, JSON.stringify(fontAliases, null, 2))
	console.log(`Generated fonts.json with ${fontAliases.length} fonts`)
}

export async function generateMSDFFonts() {
	console.log('Cleaning output directory...')
	await cleanOutputDirectory()

	console.log('Generating MSDF fonts...')
	const fontAliases = await generateFonts()

	console.log('Creating fonts manifest...')
	await createFontsManifest(fontAliases)

	console.log('Font generation complete!')
}
