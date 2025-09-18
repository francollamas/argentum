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
		// Start centered on tile 50,50 (middle of screen)
		// Calculation: -(target_tile * TILE_SIZE - viewport_center)
		// For tile 50: -(50 * 32 - 272) = -(1600 - 272) = -1328
		DEFAULT_X: -1328,  // Centers tile 50 horizontally
		DEFAULT_Y: -1392,  // Centers tile 50 vertically (adjusted for 13 tiles height)
		// Movement speed
		MOVE_SPEED: 1, // Multiplier for movement
	},
	VIEWPORT: {
		// Original client dimensions: 17x13 tiles visible (544x416 pixels)
		DEFAULT_WIDTH: 17 * 32,   // 544 pixels
		DEFAULT_HEIGHT: 13 * 32,  // 416 pixels
		// Visible tiles (odd numbers for perfect center)
		TILES_HORIZONTAL: 17,
		TILES_VERTICAL: 13,
		// Rendering padding by layer (like original client)
		PADDING: {
			GROUND: 2,     // Layers 1-2: ground textures
			OBJECTS: 10,   // Objects & Layer 3: large sprites (increased for big objects)
			OVERLAY: 12,   // Layer 4: very large overlays and effects (increased for massive graphics)
		},
	},
} as const
