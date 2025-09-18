export const GAME_CONSTANTS = {
	TILE_SIZE: 32,
	MAP: {
		MIN_X: 1,
		MIN_Y: 1,
		MAX_X: 100,
		MAX_Y: 100,
		LAYER_COUNT: 4,
		HEADER_SIZE: 273,
		// Calculated map dimensions
		get WIDTH() {
			return this.MAX_X - this.MIN_X + 1
		},
		get HEIGHT() {
			return this.MAX_Y - this.MIN_Y + 1
		},
		get WIDTH_PIXELS() {
			return this.WIDTH * GAME_CONSTANTS.TILE_SIZE
		},
		get HEIGHT_PIXELS() {
			return this.HEIGHT * GAME_CONSTANTS.TILE_SIZE
		},
	},
	WATER_SPRITE_RANGES: [
		[1505, 1520],
		[5665, 5680],
		[13547, 13562],
	] as const,
	CAMERA: {
		// Start centered on tile 50,50 with perfect tile alignment
		// For 17x13 viewport: center tile is at position 8,6 (0-indexed) or 9,7 (1-indexed)
		// Camera position = -(tile_index_from_min * TILE_SIZE)
		// For tile 50: tile_index = 50 - 1 = 49, center at 49 * 32 = 1568
		// Viewport offset: 8 tiles * 32 = 256 (horizontal), 6 tiles * 32 = 192 (vertical)
		DEFAULT_X: -(49 * 32 - 8 * 32), // -1568 + 256 = -1312
		DEFAULT_Y: -(49 * 32 - 6 * 32), // -1568 + 192 = -1376
		// Movement speed
		MOVE_SPEED: 1, // Multiplier for movement
	},
	VIEWPORT: {
		// Original client dimensions: 17x13 tiles visible (544x416 pixels)
		DEFAULT_WIDTH: 17 * 32, // 544 pixels
		DEFAULT_HEIGHT: 13 * 32, // 416 pixels
		// Visible tiles (odd numbers for perfect center)
		TILES_HORIZONTAL: 17,
		TILES_VERTICAL: 13,
		// Rendering padding by layer (like original client)
		PADDING: {
			GROUND: 2, // Layers 1-2: ground textures
			OBJECTS: 10, // Objects & Layer 3: large sprites (increased for big objects)
			OVERLAY: 12, // Layer 4: very large overlays and effects (increased for massive graphics)
		},
	},
} as const
