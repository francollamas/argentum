import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useMapLoader } from '../../hooks/useMapLoader'
import { CustomSprite } from '../common/CustomSprite'

extend({ Container })

type MapRendererProps = {
	mapNumber: number
	cameraX: number
	cameraY: number
}

export const MapRenderer: FC<MapRendererProps> = ({ mapNumber, cameraX, cameraY }) => {
	const { map, loading, error } = useMapLoader(mapNumber)

	if (loading || error || !map) {
		return <pixiContainer />
	}

	// Calculate visible tile bounds based on camera position
	const viewportLeft = -cameraX
	const viewportTop = -cameraY
	const viewportRight = viewportLeft + GAME_CONSTANTS.VIEWPORT.DEFAULT_WIDTH
	const viewportBottom = viewportTop + GAME_CONSTANTS.VIEWPORT.DEFAULT_HEIGHT

	// Different padding for different layers (like original client)
	const groundPadding = GAME_CONSTANTS.VIEWPORT.PADDING.GROUND
	const objectPadding = GAME_CONSTANTS.VIEWPORT.PADDING.OBJECTS
	const overlayPadding = GAME_CONSTANTS.VIEWPORT.PADDING.OVERLAY

	// Helper function to get bounds for specific padding
	const getBounds = (padding: number) => ({
		startX: Math.max(0, Math.floor(viewportLeft / GAME_CONSTANTS.TILE_SIZE) - padding),
		endX: Math.min(map.width - 1, Math.floor(viewportRight / GAME_CONSTANTS.TILE_SIZE) + padding),
		startY: Math.max(0, Math.floor(viewportTop / GAME_CONSTANTS.TILE_SIZE) - padding),
		endY: Math.min(map.height - 1, Math.floor(viewportBottom / GAME_CONSTANTS.TILE_SIZE) + padding),
	})

	const layer1and2: JSX.Element[] = []
	const objectsAndLayer3: JSX.Element[] = []
	const layer4: JSX.Element[] = []

	// Render layers 1-2 (ground) with minimal padding
	const groundBounds = getBounds(groundPadding)
	for (let y = groundBounds.startY; y <= groundBounds.endY; y++) {
		for (let x = groundBounds.startX; x <= groundBounds.endX; x++) {
			const tile = map.tiles[x][y]
			const tileX = x * GAME_CONSTANTS.TILE_SIZE
			const tileY = y * GAME_CONSTANTS.TILE_SIZE

			// Layer 1 (ground) - not centered
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

			// Layer 2 (background) - centered
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
		}
	}

	// Render objects and layer 3 with larger padding
	const objectBounds = getBounds(objectPadding)
	for (let y = objectBounds.startY; y <= objectBounds.endY; y++) {
		for (let x = objectBounds.startX; x <= objectBounds.endX; x++) {
			const tile = map.tiles[x][y]
			const tileX = x * GAME_CONSTANTS.TILE_SIZE
			const tileY = y * GAME_CONSTANTS.TILE_SIZE

			// Objects - centered
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

			// Layer 3 (foreground) - centered
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
		}
	}

	// Render layer 4 with maximum padding
	const overlayBounds = getBounds(overlayPadding)
	for (let y = overlayBounds.startY; y <= overlayBounds.endY; y++) {
		for (let x = overlayBounds.startX; x <= overlayBounds.endX; x++) {
			const tile = map.tiles[x][y]
			const tileX = x * GAME_CONSTANTS.TILE_SIZE
			const tileY = y * GAME_CONSTANTS.TILE_SIZE

			// Layer 4 (overlay) - centered
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
