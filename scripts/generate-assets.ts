import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {exec} from 'node:child_process'
import util from 'node:util'

// Get the current directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __assetspath = path.join(__dirname, '../src/assets')

async function generatePackedTextures(projectName: string) {
    const texPackerPath = path.join(__dirname, '../tools/texpacker')
    const projectPath = path.join(texPackerPath, `${projectName}.ftpp`)
    const projectFile = await fs.promises.readFile(projectPath, 'utf-8');
    const inputPath = path.join(texPackerPath, `textures-${projectName}`)
    const outputPath = path.join(__assetspath, 'textures')

    // Create a temporary project file
    const projectData = JSON.parse(projectFile)
    projectData.folders = [inputPath]
    const tempProjectPath = path.join(texPackerPath, `temp.ftpp`)
    await fs.promises.writeFile(tempProjectPath, JSON.stringify(projectData))

    // Execute the packer
    const execPromise = util.promisify(exec)
    await execPromise(`free-tex-packer-cli --project ${tempProjectPath} --output ${outputPath}`)

    // Delete the temporary project file
    await fs.promises.unlink(tempProjectPath)
}

async function generateAssetsFile() {
    const texturesPath = path.join(__assetspath, 'textures')

    // Filter PNG and JSON files
    const files = await fs.promises.readdir(texturesPath);
    const pngFiles = files.filter(file => file.endsWith('.png'));
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // Find pairs of PNG and JSON files
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

    // Generate import lines and pairs list
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

    // Write the imports file
    const assetsFilePath = path.join(__dirname, '../src/assets.ts')
    await fs.promises.writeFile(assetsFilePath, importsContent + '\n' + pairsArray);
}

await generatePackedTextures('normal')
await generatePackedTextures('bigger')
await generateAssetsFile()
