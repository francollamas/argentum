import type { FC } from 'react'
import { useMemo } from 'react'
import type { GameMap } from '../../types/map'
import {
	getTilePositionInPixels,
	type ViewportBounds,
} from '../../utils/viewport'
import { CustomSprite } from '../common/CustomSprite'

interface MapLayerRendererProps {
	map: GameMap
	bounds: ViewportBounds
	layer: 'ground' | 'background' | 'objects' | 'foreground' | 'overlay'
}

// Configuración de capas - qué layer index y si es centrado
const LAYER_CONFIG = {
	ground: { index: 0, centered: false },
	background: { index: 1, centered: true },
	objects: { spriteKey: 'objectSpriteId', centered: true },
	foreground: { index: 2, centered: true },
	overlay: { index: 3, centered: true },
} as const

export const MapLayerRenderer: FC<MapLayerRendererProps> = ({
	map,
	bounds,
	layer,
}) => {
	// Memoizar lista de tiles visibles con sus propiedades
	const visibleTiles = useMemo(() => {
		const tiles: Array<{
			spriteId: string
			x: number
			y: number
			centered: boolean
			key: string
		}> = []

		const config = LAYER_CONFIG[layer]
		const { startX, endX, startY, endY } = bounds

		for (let y = startY; y <= endY; y++) {
			for (let x = startX; x <= endX; x++) {
				const tile = map.tiles[x][y]
				if (!tile) continue

				// Obtener sprite ID según la capa
				let spriteId: string | undefined
				if ('index' in config) {
					spriteId = tile.layers[config.index]?.spriteId || undefined
				} else {
					spriteId =
						(tile[config.spriteKey as keyof typeof tile] as string) || undefined
				}

				if (!spriteId) continue

				const { x: tileX, y: tileY } = getTilePositionInPixels(x, y)

				tiles.push({
					spriteId,
					x: tileX,
					y: tileY,
					centered: config.centered,
					key: `${layer}-${x}-${y}`,
				})
			}
		}

		return tiles
	}, [map.tiles, bounds, layer])

	// Renderizar usando sprites optimizados
	return (
		<>
			{visibleTiles.map((tile) => (
				<CustomSprite
					key={tile.key}
					id={tile.spriteId}
					x={tile.x}
					y={tile.y}
					centered={tile.centered}
				/>
			))}
		</>
	)
}
