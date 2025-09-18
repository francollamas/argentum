import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useMapLoader } from '../../hooks/useMapLoader'
import { CustomSprite } from '../common/CustomSprite'

extend({ Container })

type MapRendererProps = {
	mapNumber: number
}

export const MapRenderer: FC<MapRendererProps> = ({ mapNumber }) => {
	const { map, loading, error } = useMapLoader(mapNumber)

	if (loading || error || !map) {
		return <pixiContainer />
	}

	// React 19 should auto-optimize this, but let's test performance
	const layer1and2: JSX.Element[] = []
	const objectsAndLayer3: JSX.Element[] = []
	const layer4: JSX.Element[] = []

	for (let y = 0; y < map.height; y++) {
		for (let x = 0; x < map.width; x++) {
			const tile = map.tiles[x][y]
			const tileX = x * GAME_CONSTANTS.TILE_SIZE
			const tileY = y * GAME_CONSTANTS.TILE_SIZE

			// Pass 1: Layers 1 and 2
			if (tile?.layers[0].spriteId) {
				layer1and2.push(
					<CustomSprite
						key={`layer1-${x}-${y}`}
						id={tile.layers[0].spriteId}
						x={tileX}
						y={tileY}
						centered={false}
					/>,
				)
			}
			if (tile?.layers[1].spriteId) {
				layer1and2.push(
					<CustomSprite
						key={`layer2-${x}-${y}`}
						id={tile.layers[1].spriteId}
						x={tileX}
						y={tileY}
						centered={true}
					/>,
				)
			}

			// Pass 2: Objects and Layer 3
			if (tile?.objectSpriteId) {
				objectsAndLayer3.push(
					<CustomSprite
						key={`object-${x}-${y}`}
						id={tile.objectSpriteId}
						x={tileX}
						y={tileY}
						centered={true}
					/>,
				)
			}
			if (tile?.layers[2].spriteId) {
				objectsAndLayer3.push(
					<CustomSprite
						key={`layer3-${x}-${y}`}
						id={tile.layers[2].spriteId}
						x={tileX}
						y={tileY}
						centered={true}
					/>,
				)
			}

			// Pass 3: Layer 4
			if (tile?.layers[3].spriteId) {
				layer4.push(
					<CustomSprite
						key={`layer4-${x}-${y}`}
						id={tile.layers[3].spriteId}
						x={tileX}
						y={tileY}
						centered={true}
					/>,
				)
			}
		}
	}

	return (
		<pixiContainer>
			{layer1and2}
			{objectsAndLayer3}
			{layer4}
		</pixiContainer>
	)
}
