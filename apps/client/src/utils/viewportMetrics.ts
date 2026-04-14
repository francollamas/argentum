import {
	DEFAULT_WORLD_ZOOM,
	MAX_UI_SCALE,
	MAX_WORLD_ZOOM,
	MIN_UI_SCALE,
	MIN_WORLD_ZOOM,
	UI_DESIGN_HEIGHT,
	UI_DESIGN_WIDTH,
} from '../constants/viewport'

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max)

export type ScreenMetrics = {
	screenWidth: number
	screenHeight: number
	screenAspectRatio: number
	uiScale: number
}

export type ContentFrameMetrics = {
	contentFrameScale: number
	contentFrameWidth: number
	contentFrameHeight: number
	contentFrameX: number
	contentFrameY: number
	contentFrameDesignWidth: number
	contentFrameDesignHeight: number
}

export type WorldViewportMetrics = {
	worldViewportX: number
	worldViewportY: number
	worldViewportWidth: number
	worldViewportHeight: number
	worldZoom: number
	visibleWorldWidth: number
	visibleWorldHeight: number
}

export type ViewportMetrics = ScreenMetrics &
	ContentFrameMetrics &
	WorldViewportMetrics

export const clampWorldZoom = (zoom: number) =>
	clamp(zoom, MIN_WORLD_ZOOM, MAX_WORLD_ZOOM)

export const calculateScreenMetrics = (
	screenWidth: number,
	screenHeight: number,
): ScreenMetrics => {
	const safeScreenWidth = Math.max(1, Math.round(screenWidth))
	const safeScreenHeight = Math.max(1, Math.round(screenHeight))
	const uiScale = clamp(
		Math.min(
			safeScreenWidth / UI_DESIGN_WIDTH,
			safeScreenHeight / UI_DESIGN_HEIGHT,
		),
		MIN_UI_SCALE,
		MAX_UI_SCALE,
	)

	return {
		screenWidth: safeScreenWidth,
		screenHeight: safeScreenHeight,
		screenAspectRatio: safeScreenWidth / safeScreenHeight,
		uiScale,
	}
}

export const calculateContentFrameMetrics = (
	screenWidth: number,
	screenHeight: number,
): ContentFrameMetrics => {
	const { uiScale } = calculateScreenMetrics(screenWidth, screenHeight)
	const contentFrameWidth = Math.round(UI_DESIGN_WIDTH * uiScale)
	const contentFrameHeight = Math.round(UI_DESIGN_HEIGHT * uiScale)

	return {
		contentFrameScale: uiScale,
		contentFrameWidth,
		contentFrameHeight,
		contentFrameX: Math.floor((screenWidth - contentFrameWidth) / 2),
		contentFrameY: Math.floor((screenHeight - contentFrameHeight) / 2),
		contentFrameDesignWidth: UI_DESIGN_WIDTH,
		contentFrameDesignHeight: UI_DESIGN_HEIGHT,
	}
}

export const calculateWorldViewportMetrics = (
	screenWidth: number,
	screenHeight: number,
	worldZoom: number = DEFAULT_WORLD_ZOOM,
): WorldViewportMetrics => {
	const safeWorldZoom = clampWorldZoom(worldZoom)

	return {
		worldViewportX: 0,
		worldViewportY: 0,
		worldViewportWidth: screenWidth,
		worldViewportHeight: screenHeight,
		worldZoom: safeWorldZoom,
		visibleWorldWidth: screenWidth / safeWorldZoom,
		visibleWorldHeight: screenHeight / safeWorldZoom,
	}
}

export const calculateViewportMetrics = (
	screenWidth: number,
	screenHeight: number,
	worldZoom: number = DEFAULT_WORLD_ZOOM,
): ViewportMetrics => ({
	...calculateScreenMetrics(screenWidth, screenHeight),
	...calculateContentFrameMetrics(screenWidth, screenHeight),
	...calculateWorldViewportMetrics(screenWidth, screenHeight, worldZoom),
})
