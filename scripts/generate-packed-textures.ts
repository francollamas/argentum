import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {exec} from 'node:child_process'
import util from 'node:util'

// Promisify exec to use async/await
const execPromise = util.promisify(exec)

// Get the current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to generate the JSON file with list of JSON filenames
async function generateTexturesFile() {
    // Directory containing the JSON files
    const texturesDir = path.join(__dirname, '../src/assets/textures')

    // Output JSON file
    const outputFile = path.join(texturesDir, 'textures.json')

    try {
        // Read files in the directory
        const files = await fs.promises.readdir(texturesDir)

        // Filter out only JSON files and exclude the output file itself
        const jsonFiles = files.filter(
            (file) => file.endsWith('.json') && file !== 'textures.json',
        ).map(
            (file) => file.split(".")[0]
        )

        // Write the list of JSON filenames to the output file
        await fs.promises.writeFile(outputFile, JSON.stringify(jsonFiles, null, 2))

        console.log('textures.json has been created with the list of JSON files.')
    } catch (error) {
        console.error('Error generating textures.json:', error)
    }
}

// Function to run the pnpm command
async function generatePackedTextures(projectName: string) {
    try {
        const projectFile = path.join(
            __dirname,
            `../tools/texpacker/${projectName}.ftpp`,
        )

        const texturesDir = path.join(__dirname, '../src/assets/textures')

        // Execute the command
        const {stdout, stderr} = await execPromise(
            `pnpm free-tex-packer-cli --project ${projectFile} --output ${texturesDir}`,
        )

        // Log the output and error (if any)
        if (stdout) console.log('Output:', stdout)
        if (stderr) console.error('Error:', stderr)
    } catch (error) {
        console.error('Error executing pnpm command:', error)
    }
}

await generatePackedTextures('normal')
await generatePackedTextures('bigger')
//await generateTexturesFile()
