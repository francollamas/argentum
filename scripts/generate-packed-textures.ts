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


async function generateImportsFile() {
    const texturesDir = path.join(__dirname, '../src/assets/textures')

    // Output JSON file
    const outputFilePath = path.join(__dirname, '../src/assets.ts')

    try {
        const files = await fs.promises.readdir(texturesDir);

        // Filtrar los archivos PNG y JSON
        const pngFiles = files.filter(file => file.endsWith('.png'));
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        // Encontrar pares de archivos PNG y JSON
        const textureData = pngFiles
            .map(png => {
                const baseName = path.basename(png, '.png');
                const jsonFile = jsonFiles.find(json => json.startsWith(baseName));
                if (jsonFile) {
                    return {baseName, png, json: jsonFile};
                }
                return null;
            })
            .filter(Boolean) as { baseName: string; png: string; json: string }[];

        // Generar las líneas de import y el listado de pares
        let importsContent = `import { TextureData } from './types';\n\n`;
        let pairsArray = `export const textureData: TextureData[] = [\n`;

        textureData.forEach(({baseName, png, json}) => {
            baseName = baseName.replace("-", "")
            const importLinePng = `import ${baseName}Png from './assets/textures/${png}';\n`;
            const importLineJson = `import ${baseName}Json from './assets/textures/${json}';\n`;

            importsContent += importLinePng;
            importsContent += importLineJson;

            pairsArray += `  { json: ${baseName}Json, png: ${baseName}Png },\n`;
        });

        pairsArray += `];\n`;

        // Escribir el archivo de imports
        await fs.promises.writeFile(outputFilePath, importsContent + '\n' + pairsArray);
        console.log(`File ${outputFilePath} generated successfully.`);
    } catch (error) {
        console.error('Error generating imports:', error);
    }
}

// Function to run the pnpm command
async function generatePackedTextures(projectName: string) {
    try {
        const projectFileName = path.join(
            __dirname,
            `../tools/texpacker/${projectName}.ftpp`,
        )

        const projectFile = await fs.promises.readFile(projectFileName, 'utf-8');
        const project = JSON.parse(projectFile)
        const imageFolderFileName = path.join(__dirname, `../tools/texpacker/textures-${projectName}`)
        project.folders = [imageFolderFileName]

        const tempProjectFileName = path.join(
            __dirname,
            `../tools/texpacker/temp.ftpp`,
        )
        await fs.promises.writeFile(tempProjectFileName, JSON.stringify(project))

        const texturesDir = path.join(__dirname, '../src/assets/textures')

        // Execute the command
        const {stdout, stderr} = await execPromise(
            `free-tex-packer-cli --project ${tempProjectFileName} --output ${texturesDir}`,
        )

        await fs.promises.unlink(tempProjectFileName)

        // Log the output and error (if any)
        if (stdout) console.log('Output:', stdout)
        if (stderr) console.error('Error:', stderr)
    } catch (error) {
        console.error('Error executing pnpm command:', error)
    }
}

await generatePackedTextures('normal')
await generatePackedTextures('bigger')
await generateImportsFile()