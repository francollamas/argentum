import type { SpritesheetList } from '../types'
import spritesheetsJson from '../assets/textures/spritesheets.json'

const pngFiles = import.meta.glob('../assets/textures/*.png')
const jsonFiles = import.meta.glob('../assets/textures/*.json')

function getBaseName(path: string): string {
  const filename = path.split('/').pop() || ''
  return filename.replace(/\.(png|json)$/, '').replace(/^texture-/, 'texture').replace(/^textureb-/, 'textureb')
}

const textureMap: Record<string, { pngPath: string; jsonPath: string }> = {}

Object.keys(pngFiles).forEach(pngPath => {
  const baseName = getBaseName(pngPath)
  
  const jsonPath = Object.keys(jsonFiles).find(path => getBaseName(path) === baseName)
  
  if (jsonPath) {
    textureMap[baseName] = { pngPath, jsonPath }
  }
})

export async function importTexture(textureName: string): Promise<{ png: any; json: any } | undefined> {
  const paths = textureMap[textureName]
  if (!paths) return undefined
  
  const [pngModule, jsonModule] = await Promise.all([
    pngFiles[paths.pngPath](),
    jsonFiles[paths.jsonPath]()
  ])
  
  return {
    png: (pngModule as any).default,
    json: (jsonModule as any).default
  }
}

export const spritesheets: SpritesheetList = spritesheetsJson
