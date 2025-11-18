import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'
import sharp from 'sharp'

// Get the current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __assetspath = path.join(__dirname, '../../src/assets')

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

            await sharp(inputPath).png().toFile(outputFilePath)
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
    } finally {
        await fs.promises.unlink(tempProjectPath).catch(() => {})
        await fs.promises.rm(pngTempPath, { recursive: true, force: true })
    }
}

await generateUITextures()