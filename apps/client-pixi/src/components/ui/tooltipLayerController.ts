import type { ReactNode } from 'react'
import type { TooltipPlacement, TooltipRect } from './tooltipPosition'

export type TooltipLayerRequest = {
	id: string
	content: ReactNode
	placement: TooltipPlacement
	triggerBounds: TooltipRect
}

export const createTooltipLayerController = (
	setActiveRequest: (request: TooltipLayerRequest | null) => void,
) => {
	let activeTooltipId: string | null = null

	return {
		show: (request: TooltipLayerRequest) => {
			activeTooltipId = request.id
			setActiveRequest(request)
		},
		hide: (tooltipId: string) => {
			if (activeTooltipId !== tooltipId) {
				return
			}

			activeTooltipId = null
			setActiveRequest(null)
		},
	}
}
