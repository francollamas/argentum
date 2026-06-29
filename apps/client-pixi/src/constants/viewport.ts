export const UI_DESIGN_WIDTH = 1920
export const UI_DESIGN_HEIGHT = 1080
export const MIN_UI_SCALE = 0.5
export const MAX_UI_SCALE = 1

export const DEFAULT_WORLD_ZOOM = 1
export const MIN_WORLD_ZOOM = 0.5
export const MAX_WORLD_ZOOM = 2
export const WORLD_ZOOM_STEP = 0.01

export const DEFAULT_SCREEN_WIDTH =
	typeof window === 'undefined' ? UI_DESIGN_WIDTH : window.innerWidth
export const DEFAULT_SCREEN_HEIGHT =
	typeof window === 'undefined' ? UI_DESIGN_HEIGHT : window.innerHeight

export const DEFAULT_VIEWPORT_STATE = {
	screenWidth: DEFAULT_SCREEN_WIDTH,
	screenHeight: DEFAULT_SCREEN_HEIGHT,
	worldZoom: DEFAULT_WORLD_ZOOM,
} as const
