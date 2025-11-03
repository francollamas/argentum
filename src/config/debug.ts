// DEBUG CONFIGURATION
// Set DEBUG_MODE to true to enable debug overlays
export const DEBUG_MODE = true

// Individual debug features (only work if DEBUG_MODE is true)
export const DEBUG_CONFIG = {
	// Show player position coordinates and highlight player tile
	showPlayerPosition: true,

	// Show blocked tiles with red X
	showBlockedTiles: false,

	// Show trigger numbers on tiles
	showTriggerNumbers: false,
} as const
