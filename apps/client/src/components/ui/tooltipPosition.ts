export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipRect = {
	x: number
	y: number
	width: number
	height: number
}

export type TooltipSize = {
	width: number
	height: number
}

export type TooltipCoordinates = {
	x: number
	y: number
}

export const resolvePlacement = (
	placement: TooltipPlacement,
	triggerBounds: TooltipRect,
	tooltipBounds: TooltipSize,
	gap: number,
): TooltipCoordinates => {
	const centeredX =
		triggerBounds.x + (triggerBounds.width - tooltipBounds.width) / 2
	const centeredY =
		triggerBounds.y + (triggerBounds.height - tooltipBounds.height) / 2

	if (placement === 'top') {
		return {
			x: centeredX,
			y: triggerBounds.y - tooltipBounds.height - gap,
		}
	}

	if (placement === 'bottom') {
		return {
			x: centeredX,
			y: triggerBounds.y + triggerBounds.height + gap,
		}
	}

	if (placement === 'left') {
		return {
			x: triggerBounds.x - tooltipBounds.width - gap,
			y: centeredY,
		}
	}

	return {
		x: triggerBounds.x + triggerBounds.width + gap,
		y: centeredY,
	}
}
