import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import type { MapTile } from '../../types/map'
import { CustomSprite } from '../common/CustomSprite'

extend({ Container })

type MapTileRendererProps = {
	tile: MapTile
	x: number
	y: number
}

export const MapTileRenderer: FC<MapTileRendererProps> = ({ tile, x, y }) => {
	const pixelX = x * GAME_CONSTANTS.TILE_SIZE
	const pixelY = y * GAME_CONSTANTS.TILE_SIZE

	return (
		<pixiContainer x={pixelX} y={pixelY}>
			{tile.layers.map(
				(layer, index) =>
					layer.spriteId && (
						<CustomSprite
							key={`${layer.spriteId}-${index}`}
							id={layer.spriteId}
							x={0}
							y={0}
							centered={index > 0}
						/>
					),
			)}
			{tile.objectSpriteId && (
				<CustomSprite
					key='object'
					id={tile.objectSpriteId}
					x={0}
					y={0}
					centered={true}
				/>
			)}
		</pixiContainer>
	)
}
