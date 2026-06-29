import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

const OverlayLayerContext = createContext(0)
const TopModalLayerContext = createContext(0)

type OverlayLayerProviderProps = {
	children?: ReactNode
	layer: number
	topModalLayer: number
}

export const OverlayLayerProvider = ({
	children,
	layer,
	topModalLayer,
}: OverlayLayerProviderProps) => {
	return (
		<OverlayLayerContext.Provider value={layer}>
			<TopModalLayerContext.Provider value={topModalLayer}>
				{children}
			</TopModalLayerContext.Provider>
		</OverlayLayerContext.Provider>
	)
}

export const useOverlayLayer = () => useContext(OverlayLayerContext)

export const useTopModalLayer = () => useContext(TopModalLayerContext)

export const useIsDomOverlayOccluded = () => {
	const layer = useOverlayLayer()
	const topModalLayer = useTopModalLayer()

	return layer < topModalLayer
}
