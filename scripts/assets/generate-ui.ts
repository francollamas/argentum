import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'
import sharp from 'sharp'
import type { SpritesheetData } from 'pixi.js'

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

    const texMap = '{\n' + entries.join(',\n') + '\n}\n'

    const spritesheetsFilePath = path.join(outputPath, 'spritesheets.json')
    await fs.promises.writeFile(spritesheetsFilePath, texMap)
}

async function generateUITextures() {
    const texPackerPath = path.join(__dirname, '../../tools/texpacker')
    const svgInputPath = path.join(texPackerPath, 'ui')
    const pngTempPath = path.join(texPackerPath, 'ui/png')
    const outputPath = path.join(__assetspath, 'ui')
    const tempProjectPath = path.join(texPackerPath, 'temp-ui.ftpp')

    try {
        await fs.promises.mkdir(pngTempPath, { recursive: true })

        const files = await fs.promises.readdir(svgInputPath)
        const svgFiles = files.filter((file) => file.endsWith('.svg'))

        for (const svgFile of svgFiles) {
            const inputPath = path.join(svgInputPath, svgFile)
            const outputFile = svgFile.replace('.svg', '.png')
            const outputFilePath = path.join(pngTempPath, outputFile)

            await sharp(inputPath, { density: 72}).png().toFile(outputFilePath)
        }

        const projectPath = path.join(texPackerPath, 'ui.ftpp')
        const projectFile = await fs.promises.readFile(projectPath, 'utf-8')

        const projectData = JSON.parse(projectFile)
        projectData.folders = [pngTempPath]
        await fs.promises.writeFile(tempProjectPath, JSON.stringify(projectData))

        const execPromise = util.promisify(exec)
        await execPromise(
            `npx free-tex-packer-cli --project ${tempProjectPath} --output ${outputPath}`,
        )

        await generateSpritesheetFile(outputPath)
    } finally {
        await fs.promises.unlink(tempProjectPath).catch(() => { })
        await fs.promises.rm(pngTempPath, { recursive: true, force: true })
    }
}

await generateUITextures()