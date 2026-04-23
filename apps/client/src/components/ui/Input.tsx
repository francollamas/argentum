import type { LayoutOptions } from '@pixi/layout'
import { useApplication } from '@pixi/react'
import type { Container, NineSliceSprite } from 'pixi.js'
import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'
import { DomInputOverlay } from './DomInputOverlay'

type InputProps = {
	width?: number
	height?: number
	placeholder?: string
	value?: string
	maxLength?: number
	secure?: boolean
	align?: 'left' | 'center' | 'right'
	textColor?: number
	onChange?: (value: string) => void
	onEnter?: (value: string) => void
	layout?: Record<string, unknown>
}

const toCssColor = (value: number) => `#${value.toString(16).padStart(6, '0')}`

type DomInputStyle = CSSProperties & {
	'--input-placeholder-color': string
}

const INPUT_DOM_FONT_FAMILY = FONTS.input.domFontFamily
const INPUT_FONT_SIZE = FONTS.input.fontSize

export const Input: FC<InputProps> = ({
	width,
	height = 40,
	placeholder = '',
	value = '',
	maxLength,
	secure = false,
	align = 'left',
	textColor = 0xffffff,
	onChange,
	onEnter,
	layout,
}) => {
	const { app } = useApplication()
	const inputNodeRef = useRef<Container | null>(null)
	const backgroundNodeRef = useRef<NineSliceSprite | null>(null)
	const overlayHostRef = useRef<HTMLDivElement | null>(null)
	const overlayRootRef = useRef<Root | null>(null)
	const syncFrameRef = useRef<number | null>(null)
	const [active, setActive] = useState(false)
	const [domInputStyle, setDomInputStyle] = useState<DomInputStyle | null>(null)

	const inputTexture = useUITexture('input-field')

	const syncDomInputPosition = useCallback(() => {
		if (!app?.canvas) return
		const backgroundNode = backgroundNodeRef.current
		const container = overlayHostRef.current?.parentElement
		if (!backgroundNode || !container) return

		const canvasRect = app.canvas.getBoundingClientRect()
		const parentRect = container.getBoundingClientRect()

		const bounds = backgroundNode.getBounds()
		const left = canvasRect.left - parentRect.left + bounds.x
		const top = canvasRect.top - parentRect.top + bounds.y
		const width = bounds.width
		const renderedHeight = bounds.height
		const domScale = height > 0 ? renderedHeight / height : 1
		const paddingInline = Math.max(8, 12 * domScale)
		const fontSize = Math.max(12, INPUT_FONT_SIZE * domScale)
		const lineHeight = Math.max(1, renderedHeight - 2)
		const borderRadius = Math.max(6, 6 * domScale)

		setDomInputStyle({
			position: 'absolute',
			top,
			left,
			width,
			height: renderedHeight,
			padding: `0 ${paddingInline}px`,
			margin: 0,
			boxSizing: 'border-box',
			border: 'none',
			borderRadius,
			background: 'transparent',
			color: toCssColor(textColor),
			caretColor: toCssColor(textColor),
			textAlign: align,
			fontSize,
			fontFamily: INPUT_DOM_FONT_FAMILY,
			lineHeight: `${lineHeight}px`,
			appearance: 'none',
			outline: 'none',
			pointerEvents: 'auto',
			zIndex: 999,
			'--input-placeholder-color': '#888888',
		})
	}, [align, app, height, textColor])

	const scheduleDomInputSync = useCallback(() => {
		if (syncFrameRef.current != null) {
			cancelAnimationFrame(syncFrameRef.current)
		}

		syncFrameRef.current = requestAnimationFrame(() => {
			syncFrameRef.current = null
			syncDomInputPosition()
		})
	}, [syncDomInputPosition])

	useEffect(() => {
		return () => {
			if (syncFrameRef.current != null) {
				cancelAnimationFrame(syncFrameRef.current)
				syncFrameRef.current = null
			}
		}
	}, [])

	const inputRefCallback = useCallback(
		(node: Container | null) => {
			const previousNode = inputNodeRef.current
			if (previousNode) {
				previousNode.off('layout', scheduleDomInputSync)
			}

			inputNodeRef.current = node

			if (node) {
				node.on('layout', scheduleDomInputSync)
				scheduleDomInputSync()
			}
		},
		[scheduleDomInputSync],
	)

	useEffect(() => {
		if (!app?.canvas) return

		const canvas = app.canvas as HTMLCanvasElement
		const canvasParent = canvas.parentElement
		if (!canvasParent) return

		const parentStyle = window.getComputedStyle(canvasParent)
		const shouldRestorePosition = parentStyle.position === 'static'
		const overlayHost = document.createElement('div')
		overlayHostRef.current = overlayHost
		overlayRootRef.current = createRoot(overlayHost)
		canvasParent.appendChild(overlayHost)

		if (parentStyle.position === 'static') {
			canvasParent.style.position = 'relative'
		}

		return () => {
			overlayRootRef.current?.unmount()
			overlayRootRef.current = null
			overlayHost.remove()
			overlayHostRef.current = null
			if (syncFrameRef.current != null) {
				cancelAnimationFrame(syncFrameRef.current)
				syncFrameRef.current = null
			}
			setDomInputStyle(null)
			if (shouldRestorePosition) {
				canvasParent.style.position = ''
			}
		}
	}, [app])

	useEffect(() => {
		if (!app) return

		app.renderer.on('resize', scheduleDomInputSync)

		return () => {
			app.renderer.off('resize', scheduleDomInputSync)
		}
	}, [app, scheduleDomInputSync])

	useEffect(() => {
		scheduleDomInputSync()
	}, [scheduleDomInputSync])

	useEffect(() => {
		overlayRootRef.current?.render(
			<DomInputOverlay
				style={domInputStyle}
				placeholder={placeholder}
				value={value}
				maxLength={maxLength}
				secure={secure}
				onChange={onChange}
				onEnter={onEnter}
				onFocus={() => setActive(true)}
				onBlur={() => setActive(false)}
			/>,
		)
	}, [domInputStyle, maxLength, onChange, onEnter, placeholder, secure, value])

	const rootLayout = {
		...(width != null ? { width } : { width: '100%' }),
		height,
		minHeight: height,
		minWidth: width ?? 200,
		position: 'relative' as const,
		...layout,
	} as unknown as Omit<LayoutOptions, 'target'>

	return (
		<layoutContainer
			ref={inputRefCallback}
			eventMode='static'
			cursor='text'
			layout={rootLayout}
		>
			<pixiNineSliceSprite
				ref={backgroundNodeRef}
				texture={inputTexture}
				leftWidth={10}
				topHeight={10}
				rightWidth={10}
				bottomHeight={10}
				tint={active ? 0xffffff : 0xcccccc}
				layout={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					applySizeDirectly: true,
				}}
			/>
		</layoutContainer>
	)
}
