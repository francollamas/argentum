import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import {
	DEFAULT_VIEWPORT_STATE,
	DEFAULT_WORLD_ZOOM,
	WORLD_ZOOM_STEP,
} from '../constants/viewport'
import {
	calculateContentFrameMetrics,
	calculateScreenMetrics,
	calculateViewportMetrics,
	calculateWorldViewportMetrics,
	clampWorldZoom,
} from '../utils/viewportMetrics'

type ViewportStoreState = {
	screenWidth: number
	screenHeight: number
	worldZoom: number
	setScreenSize: (width: number, height: number) => void
	setWorldZoom: (zoom: number) => void
	zoomIn: () => void
	zoomOut: () => void
	resetWorldZoom: () => void
}

export const useViewportStore = create<ViewportStoreState>()(
	devtools(
		(set) => ({
			...DEFAULT_VIEWPORT_STATE,
			setScreenSize: (width, height) =>
				set(
					{
						screenWidth: Math.max(1, Math.round(width)),
						screenHeight: Math.max(1, Math.round(height)),
					},
					false,
					'setScreenSize',
				),
			setWorldZoom: (zoom) =>
				set({ worldZoom: clampWorldZoom(zoom) }, false, 'setWorldZoom'),
			zoomIn: () =>
				set(
					(state) => ({
						worldZoom: clampWorldZoom(state.worldZoom + WORLD_ZOOM_STEP),
					}),
					false,
					'zoomIn',
				),
			zoomOut: () =>
				set(
					(state) => ({
						worldZoom: clampWorldZoom(state.worldZoom - WORLD_ZOOM_STEP),
					}),
					false,
					'zoomOut',
				),
			resetWorldZoom: () =>
				set({ worldZoom: DEFAULT_WORLD_ZOOM }, false, 'resetWorldZoom'),
		}),
		{ name: 'ViewportStore' },
	),
)

export const selectScreenMetrics = (state: ViewportStoreState) =>
	calculateScreenMetrics(state.screenWidth, state.screenHeight)

export const selectContentFrameMetrics = (state: ViewportStoreState) =>
	calculateContentFrameMetrics(state.screenWidth, state.screenHeight)

export const selectWorldViewportMetrics = (state: ViewportStoreState) =>
	calculateWorldViewportMetrics(
		state.screenWidth,
		state.screenHeight,
		state.worldZoom,
	)

export const selectViewportMetrics = (state: ViewportStoreState) =>
	calculateViewportMetrics(
		state.screenWidth,
		state.screenHeight,
		state.worldZoom,
	)

export const useScreenMetrics = () =>
	useViewportStore(useShallow(selectScreenMetrics))

export const useContentFrameMetrics = () =>
	useViewportStore(useShallow(selectContentFrameMetrics))

export const useWorldViewportMetrics = () =>
	useViewportStore(useShallow(selectWorldViewportMetrics))

export const useViewportMetrics = () =>
	useViewportStore(useShallow(selectViewportMetrics))
