import type { GameMap } from '../types/map'
import { worldTileToArrayIndex } from '../utils/coordinates'

export class MovementService {
	private map: GameMap | null = null

	setMap(map: GameMap) {
		this.map = map
	}

	getTileAt(tileX: number, tileY: number) {
		if (!this.map) return null

		// Convert world coordinates to array indices
		const { x: arrayX, y: arrayY } = worldTileToArrayIndex(tileX, tileY)

		if (
			arrayX < 0 ||
			arrayX >= this.map.width ||
			arrayY < 0 ||
			arrayY >= this.map.height
		) {
			return null
		}

		return this.map.tiles[arrayX][arrayY]
	}

	isValidPosition(tileX: number, tileY: number): boolean {
		const tile = this.getTileAt(tileX, tileY)
		return tile ? !tile.isBlocked : false
	}

	isRoofTrigger(tileX: number, tileY: number): boolean {
		const tile = this.getTileAt(tileX, tileY)
		if (!tile) return false

		// Trigger values 1, 2, 4 correspond to roof triggers
		return tile.trigger !== null && [1, 2, 4].includes(tile.trigger)
	}

	calculateNextPosition(
		currentX: number,
		currentY: number,
		direction: 'up' | 'down' | 'left' | 'right',
	): { x: number; y: number } {
		switch (direction) {
			case 'up':
				return { x: currentX, y: currentY - 1 }
			case 'down':
				return { x: currentX, y: currentY + 1 }
			case 'left':
				return { x: currentX - 1, y: currentY }
			case 'right':
				return { x: currentX + 1, y: currentY }
		}
	}
}

// Singleton instance
export const movementService = new MovementService()
