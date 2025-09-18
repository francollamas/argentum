import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useMapLoader } from '../../hooks/useMapLoader'
import type { GameMap } from '../../types/map'
import { CustomSprite } from '../common/CustomSprite'

extend({ Container })

type MapRendererProps = {
	mapNumber: number
	viewportWidth?: number
	viewportHeight?: number
}

const MapContent: FC<{ map: GameMap }> = ({ map }) => {
	const renderLayers = []

	for (let y = 0; y < map.height; y++) {
		for (let x = 0; x < map.width; x++) {
			const tile = map.tiles[x][y]
			if (tile?.layers[0].spriteId) {
				renderLayers.push(
					<CustomSprite
						key={`layer1-${x}-${y}`}
						id={tile.layers[0].spriteId}
						x={x * GAME_CONSTANTS.TILE_SIZE}
						y={y * GAME_CONSTANTS.TILE_SIZE}
						centered={false}
					/>,
				)
			}
			if (tile?.layers[1].spriteId) {
				renderLayers.push(
					<CustomSprite
						key={`layer2-${x}-${y}`}
						id={tile.layers[1].spriteId}
						x={x * GAME_CONSTANTS.TILE_SIZE}
						y={y * GAME_CONSTANTS.TILE_SIZE}
						centered={true}
					/>,
				)
			}
		}
	}

	for (let y = 0; y < map.height; y++) {
		for (let x = 0; x < map.width; x++) {
			const tile = map.tiles[x][y]
			if (tile?.objectSpriteId) {
				renderLayers.push(
					<CustomSprite
						key={`object-${x}-${y}`}
						id={tile.objectSpriteId}
						x={x * GAME_CONSTANTS.TILE_SIZE}
						y={y * GAME_CONSTANTS.TILE_SIZE}
						centered={true}
					/>,
				)
			}
			if (tile?.layers[2].spriteId) {
				renderLayers.push(
					<CustomSprite
						key={`layer3-${x}-${y}`}
						id={tile.layers[2].spriteId}
						x={x * GAME_CONSTANTS.TILE_SIZE}
						y={y * GAME_CONSTANTS.TILE_SIZE}
						centered={true}
					/>,
				)
			}
		}
	}

	for (let y = 0; y < map.height; y++) {
		for (let x = 0; x < map.width; x++) {
			const tile = map.tiles[x][y]
			if (tile?.layers[3].spriteId) {
				renderLayers.push(
					<CustomSprite
						key={`layer4-${x}-${y}`}
						id={tile.layers[3].spriteId}
						x={x * GAME_CONSTANTS.TILE_SIZE}
						y={y * GAME_CONSTANTS.TILE_SIZE}
						centered={true}
					/>,
				)
			}
		}
	}

	return <>{renderLayers}</>
}

export const MapRenderer: FC<MapRendererProps> = ({ mapNumber }) => {
	const { map, loading, error } = useMapLoader(mapNumber)

	if (loading || error || !map) {
		return <pixiContainer />
	}

	return (
		<pixiContainer>
			<MapContent map={map} />
		</pixiContainer>
	)
}
