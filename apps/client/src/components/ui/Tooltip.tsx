import type { LayoutOptions } from '@pixi/layout'
import {
	Children,
	type FC,
	type ReactElement,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useTooltipLayer } from './TooltipLayer'
import type { LayoutMeasuredContainer } from './tooltipLayout'
import type { TooltipPlacement } from './tooltipPosition'

type TooltipProps = {
	content: ReactNode
	placement?: TooltipPlacement
	delayMs?: number
	children: ReactElement
	layout?: Record<string, unknown>
}

type TooltipVisibilityControllerOptions = {
	delayMs: number
	onShow: () => void
	onHide: () => void
}

export const DEFAULT_TOOLTIP_DELAY_MS = 300

export const assertSingleTriggerChild = (children: ReactNode): ReactElement => {
	if (Children.count(children) !== 1) {
		throw new Error('Tooltip requires exactly one trigger child.')
	}

	return Children.only(children) as ReactElement
}

export const createTooltipVisibilityController = ({
	delayMs,
	onShow,
	onHide,
}: TooltipVisibilityControllerOptions) => {
	let showTimeout: ReturnType<typeof setTimeout> | null = null
	let isVisible = false

	const clearShowTimeout = () => {
		if (showTimeout) {
			clearTimeout(showTimeout)
			showTimeout = null
		}
	}

	return {
		handlePointerOver: () => {
			if (showTimeout || isVisible) {
				return
			}

			showTimeout = setTimeout(() => {
				showTimeout = null
				isVisible = true
				onShow()
			}, delayMs)
		},
		handlePointerOut: () => {
			clearShowTimeout()
			isVisible = false
			onHide()
		},
		dispose: () => {
			clearShowTimeout()
		},
	}
}

export const Tooltip: FC<TooltipProps> = ({
	content,
	placement = 'top',
	delayMs = DEFAULT_TOOLTIP_DELAY_MS,
	children,
	layout,
}) => {
	const tooltipLayer = useTooltipLayer()
	const tooltipId = useId()
	const triggerRef = useRef<LayoutMeasuredContainer | null>(null)
	const controllerRef = useRef<ReturnType<
		typeof createTooltipVisibilityController
	> | null>(null)
	const [isTooltipOpen, setIsTooltipOpen] = useState(false)

	const triggerChild = assertSingleTriggerChild(children)

	const handleTriggerRef = useCallback((node: unknown) => {
		triggerRef.current = node as LayoutMeasuredContainer | null
	}, [])

	const hideTooltip = useCallback(() => {
		setIsTooltipOpen(false)
		tooltipLayer.hideTooltip(tooltipId)
	}, [tooltipId, tooltipLayer])

	const syncTooltipInLayer = useCallback(() => {
		const triggerNode = triggerRef.current

		if (!isTooltipOpen || !triggerNode) {
			return
		}

		const triggerBounds = tooltipLayer.getTriggerBounds(triggerNode)

		if (!triggerBounds) {
			return
		}

		tooltipLayer.showTooltip({
			id: tooltipId,
			content,
			placement,
			triggerBounds,
		})
	}, [content, isTooltipOpen, placement, tooltipId, tooltipLayer])

	useEffect(() => {
		controllerRef.current = createTooltipVisibilityController({
			delayMs,
			onShow: () => {
				setIsTooltipOpen(true)
			},
			onHide: hideTooltip,
		})

		return () => {
			controllerRef.current?.dispose()
			controllerRef.current = null
		}
	}, [delayMs, hideTooltip])

	useEffect(() => {
		const triggerNode = triggerRef.current

		if (!isTooltipOpen || !triggerNode) {
			return
		}

		triggerNode.on('layout', syncTooltipInLayer)
		syncTooltipInLayer()

		return () => {
			triggerNode.off('layout', syncTooltipInLayer)
		}
	}, [isTooltipOpen, syncTooltipInLayer])

	const rootLayout = useMemo(
		() =>
			({
				position: 'relative' as const,
				alignSelf: 'flex-start' as const,
				...layout,
			}) as unknown as Omit<LayoutOptions, 'target'>,
		[layout],
	)

	return (
		<layoutContainer layout={rootLayout}>
			<layoutContainer
				ref={handleTriggerRef}
				layout={{ alignSelf: 'flex-start' }}
				eventMode='static'
				cursor='pointer'
				onPointerEnter={() => controllerRef.current?.handlePointerOver()}
				onPointerLeave={() => controllerRef.current?.handlePointerOut()}
			>
				{triggerChild}
			</layoutContainer>
		</layoutContainer>
	)
}
