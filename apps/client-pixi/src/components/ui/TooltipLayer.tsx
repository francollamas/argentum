import type { Container } from 'pixi.js'
import {
	createContext,
	type FC,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useUITexture } from '../../hooks/useUITexture'
import {
	createTooltipLayerController,
	type TooltipLayerRequest,
} from './tooltipLayerController'
import {
	getMeasuredSize,
	getRelativeBounds,
	getTooltipContentLayout,
	getTooltipInnerLayout,
	type LayoutMeasuredContainer,
	TOOLTIP_GAP,
	TOOLTIP_SLICE_SIZE,
} from './tooltipLayout'
import { resolvePlacement, type TooltipRect } from './tooltipPosition'

type TooltipLayerContextValue = {
	getTriggerBounds: (node: LayoutMeasuredContainer) => TooltipRect | null
	showTooltip: (request: TooltipLayerRequest) => void
	hideTooltip: (tooltipId: string) => void
}

const TooltipLayerContext = createContext<TooltipLayerContextValue | null>(null)

type TooltipLayerProviderProps = {
	children: ReactNode
}

export const TooltipLayerProvider: FC<TooltipLayerProviderProps> = ({
	children,
}) => {
	const tooltipTexture = useUITexture('tooltip')
	const overlayRootRef = useRef<Container | null>(null)
	const tooltipRef = useRef<LayoutMeasuredContainer | null>(null)
	const [activeRequest, setActiveRequest] =
		useState<TooltipLayerRequest | null>(null)
	const [position, setPosition] = useState<{ x: number; y: number } | null>(
		null,
	)
	const [isVisible, setIsVisible] = useState(false)
	const tooltipInnerLayout = useMemo(() => getTooltipInnerLayout(), [])

	const controller = useMemo(
		() => createTooltipLayerController(setActiveRequest),
		[],
	)

	const handleOverlayRootRef = useCallback((node: unknown) => {
		overlayRootRef.current = node as Container | null
	}, [])

	const handleTooltipRef = useCallback((node: unknown) => {
		tooltipRef.current = node as LayoutMeasuredContainer | null
	}, [])

	const getTriggerBounds = useCallback((node: LayoutMeasuredContainer) => {
		const overlayRootNode = overlayRootRef.current

		if (!overlayRootNode) {
			return null
		}

		return getRelativeBounds(overlayRootNode, node)
	}, [])

	const syncTooltipPosition = useCallback(() => {
		const tooltipNode = tooltipRef.current

		if (!activeRequest || !tooltipNode) {
			return
		}

		const tooltipBounds = getMeasuredSize(tooltipNode)

		if (!tooltipBounds) {
			return
		}

		setPosition(
			resolvePlacement(
				activeRequest.placement,
				activeRequest.triggerBounds,
				tooltipBounds,
				TOOLTIP_GAP,
			),
		)
		setIsVisible(true)
	}, [activeRequest])

	useEffect(() => {
		const tooltipNode = tooltipRef.current

		if (!activeRequest || !tooltipNode) {
			return
		}

		tooltipNode.on('layout', syncTooltipPosition)
		syncTooltipPosition()

		return () => {
			tooltipNode.off('layout', syncTooltipPosition)
		}
	}, [activeRequest, syncTooltipPosition])

	const showTooltip = useCallback(
		(request: TooltipLayerRequest) => {
			setPosition(null)
			setIsVisible(false)
			controller.show(request)
		},
		[controller],
	)

	const hideTooltip = useCallback(
		(tooltipId: string) => {
			setPosition(null)
			setIsVisible(false)
			controller.hide(tooltipId)
		},
		[controller],
	)

	const contextValue = useMemo(
		() => ({
			getTriggerBounds,
			showTooltip,
			hideTooltip,
		}),
		[getTriggerBounds, hideTooltip, showTooltip],
	)

	return (
		<TooltipLayerContext.Provider value={contextValue}>
			<layoutContainer
				layout={{
					width: '100%',
					height: '100%',
					position: 'relative',
				}}
			>
				{children}
				<layoutContainer
					ref={handleOverlayRootRef}
					layout={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						height: '100%',
					}}
					eventMode='none'
				>
					{activeRequest ? (
						<layoutContainer
							ref={handleTooltipRef}
							layout={getTooltipContentLayout(position)}
							eventMode='none'
							alpha={isVisible ? 1 : 0}
						>
							<pixiNineSliceSprite
								texture={tooltipTexture}
								leftWidth={TOOLTIP_SLICE_SIZE}
								topHeight={TOOLTIP_SLICE_SIZE}
								rightWidth={TOOLTIP_SLICE_SIZE}
								bottomHeight={TOOLTIP_SLICE_SIZE}
								layout={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									applySizeDirectly: true,
								}}
							/>
							<layoutContainer layout={tooltipInnerLayout} eventMode='none'>
								{activeRequest.content}
							</layoutContainer>
						</layoutContainer>
					) : null}
				</layoutContainer>
			</layoutContainer>
		</TooltipLayerContext.Provider>
	)
}

export const useTooltipLayer = () => {
	const context = useContext(TooltipLayerContext)

	if (!context) {
		throw new Error('Tooltip must render inside TooltipLayerProvider.')
	}

	return context
}
