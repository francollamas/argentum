import type { LayoutOptions } from '@pixi/layout'
import type { Container } from 'pixi.js'
import type { TooltipRect } from './tooltipPosition'

export type LayoutMeasuredContainer = Container & {
	layout?: {
		computedLayout?: {
			width?: number
			height?: number
		}
	}
}

export const TOOLTIP_GAP = 8
export const TOOLTIP_SLICE_SIZE = 16
export const TOOLTIP_PADDING_X = 14
export const TOOLTIP_PADDING_Y = 10
export const TOOLTIP_CONTENT_GAP = 0

export const getMeasuredSize = (node: LayoutMeasuredContainer) => {
	const width =
		node.layout?.computedLayout?.width ?? node.getLocalBounds().width
	const height =
		node.layout?.computedLayout?.height ?? node.getLocalBounds().height

	if (width <= 0 || height <= 0) {
		return null
	}

	return { width, height }
}

export const getRelativeBounds = (
	rootNode: Container,
	node: LayoutMeasuredContainer,
): TooltipRect | null => {
	const measuredSize = getMeasuredSize(node)

	if (!measuredSize) {
		return null
	}

	const globalPosition = node.getGlobalPosition()
	const localPosition = rootNode.toLocal(globalPosition)

	return {
		x: localPosition.x,
		y: localPosition.y,
		width: measuredSize.width,
		height: measuredSize.height,
	}
}

export const getTooltipContentLayout = (
	position: {
		x: number
		y: number
	} | null,
) =>
	({
		position: 'absolute' as const,
		left: position?.x ?? 0,
		top: position?.y ?? 0,
		alignSelf: 'flex-start' as const,
	}) as unknown as Omit<LayoutOptions, 'target'>

export const getTooltipInnerLayout = () =>
	({
		paddingLeft: TOOLTIP_PADDING_X,
		paddingRight: TOOLTIP_PADDING_X,
		paddingTop: TOOLTIP_PADDING_Y,
		paddingBottom: TOOLTIP_PADDING_Y,
		gap: TOOLTIP_CONTENT_GAP,
	}) as unknown as Omit<LayoutOptions, 'target'>
