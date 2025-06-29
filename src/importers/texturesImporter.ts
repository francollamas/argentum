import type { SpritesheetList } from '../types'
import spritesheetsJson from '../assets/textures/spritesheets.json'

// Importar todos los archivos PNG y JSON en modo lazy (bajo demanda)
const pngFiles = import.meta.glob('../assets/textures/*.png')
const jsonFiles = import.meta.glob('../assets/textures/*.json')

// Función para extraer el nombre base de la ruta del archivo
function getBaseName(path: string): string {
  const filename = path.split('/').pop() || ''
  return filename.replace(/\.(png|json)$/, '').replace(/^texture-/, 'texture').replace(/^textureb-/, 'textureb')
}

// Crear un mapa de nombres de texturas a sus rutas de archivos
const textureMap: Record<string, { pngPath: string; jsonPath: string }> = {}

// Poblar el mapa con las rutas
Object.keys(pngFiles).forEach(pngPath => {
  const baseName = getBaseName(pngPath)
  
  // Buscar el JSON correspondiente
  const jsonPath = Object.keys(jsonFiles).find(path => getBaseName(path) === baseName)
  
  if (jsonPath) {
    textureMap[baseName] = { pngPath, jsonPath }
  }
})

// Función para cargar una textura específica bajo demanda
export async function importTexture(textureName: string): Promise<{ png: any; json: any } | undefined> {
  const paths = textureMap[textureName]
  if (!paths) return undefined
  
  // Cargar ambos archivos en paralelo
  // Vite cacheará internamente los resultados de estas llamadas
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
