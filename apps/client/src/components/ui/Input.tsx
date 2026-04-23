import { useApplication } from '@pixi/react'
import type { Container, NineSliceSprite } from 'pixi.js'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

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

const DOM_INPUT_CLASS = 'ao-pixi-input-overlay'
const DOM_INPUT_STYLE_ID = 'ao-pixi-input-overlay-styles'

const toCssColor = (value: number) => `#${value.toString(16).padStart(6, '0')}`

const ensureDomInputStyles = () => {
	if (document.getElementById(DOM_INPUT_STYLE_ID)) return

	const style = document.createElement('style')
	style.id = DOM_INPUT_STYLE_ID
	style.textContent = `
		.${DOM_INPUT_CLASS}::placeholder {
			color: var(--input-placeholder-color, #888888);
			opacity: 1;
		}

		.${DOM_INPUT_CLASS}::selection {
			background: rgba(255, 214, 102, 0.35);
			color: inherit;
		}
	`
	document.head.appendChild(style)
}

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
	const domInputRef = useRef<HTMLInputElement | null>(null)
	const syncFrameRef = useRef<number | null>(null)
	const onChangeRef = useRef(onChange)
	const onEnterRef = useRef(onEnter)
	const [active, setActive] = useState(false)

	const fontConfig = FONTS.input
	const inputTexture = useUITexture('input-field')

	onChangeRef.current = onChange
	onEnterRef.current = onEnter

	const syncDomInputPosition = useCallback(() => {
		if (!app?.canvas) return
		const domInput = domInputRef.current
		const backgroundNode = backgroundNodeRef.current
		if (!domInput || !backgroundNode) return

		const canvasRect = app.canvas.getBoundingClientRect()
		const parentRect = domInput.parentElement?.getBoundingClientRect()
		if (!parentRect) return

		const bounds = backgroundNode.getBounds()
		const left = canvasRect.left - parentRect.left + bounds.x
		const top = canvasRect.top - parentRect.top + bounds.y
		const width = bounds.width
		const renderedHeight = bounds.height
		const domScale = height > 0 ? renderedHeight / height : 1
		const paddingInline = Math.max(8, 12 * domScale)
		const fontSize = Math.max(12, fontConfig.fontSize * domScale)
		const lineHeight = Math.max(1, renderedHeight - 2)
		const borderRadius = Math.max(6, 6 * domScale)

		domInput.style.left = `${left}px`
		domInput.style.top = `${top}px`
		domInput.style.width = `${width}px`
		domInput.style.height = `${renderedHeight}px`
		domInput.style.paddingLeft = `${paddingInline}px`
		domInput.style.paddingRight = `${paddingInline}px`
		domInput.style.fontSize = `${fontSize}px`
		domInput.style.lineHeight = `${lineHeight}px`
		domInput.style.borderRadius = `${borderRadius}px`
	}, [app, height])

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
		ensureDomInputStyles()

		const canvas = app.canvas as HTMLCanvasElement
		const canvasParent = canvas.parentElement
		if (!canvasParent) return

		const parentStyle = window.getComputedStyle(canvasParent)
		if (parentStyle.position === 'static') {
			canvasParent.style.position = 'relative'
		}

		const domInput = document.createElement('input')
		domInput.className = DOM_INPUT_CLASS
		domInput.type = secure ? 'password' : 'text'
		if (maxLength != null) domInput.maxLength = maxLength
		domInput.autocomplete = 'off'
		domInput.spellcheck = false

		Object.assign(domInput.style, {
			position: 'absolute',
			opacity: '1',
			pointerEvents: 'auto',
			width: '1px',
			height: `${height}px`,
			boxSizing: 'border-box',
			top: '0',
			left: '0',
			border: 'none',
			borderRadius: '6px',
			padding: '0 12px',
			margin: '0',
			background: 'transparent',
			color: toCssColor(textColor),
			caretColor: toCssColor(textColor),
			textAlign: align,
			fontSize: `${fontConfig.fontSize}px`,
			fontFamily: fontConfig.domFontFamily,
			lineHeight: `${height}px`,
			appearance: 'none',
			outline: 'none',
			zIndex: '999',
		} satisfies Partial<CSSStyleDeclaration>)

		canvasParent.appendChild(domInput)
		domInputRef.current = domInput
		scheduleDomInputSync()

		const handleInput = () => {
			const next = domInput.value
			onChangeRef.current?.(next)
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				onEnterRef.current?.(domInput.value)
				domInput.blur()
			}
			if (e.key === 'Escape') {
				domInput.blur()
			}
		}

		const handleBlur = () => setActive(false)
		const handleFocus = () => setActive(true)

		domInput.addEventListener('input', handleInput)
		domInput.addEventListener('keydown', handleKeyDown)
		domInput.addEventListener('blur', handleBlur)
		domInput.addEventListener('focus', handleFocus)

		app.renderer.on('resize', scheduleDomInputSync)

		return () => {
			domInput.removeEventListener('input', handleInput)
			domInput.removeEventListener('keydown', handleKeyDown)
			domInput.removeEventListener('blur', handleBlur)
			domInput.removeEventListener('focus', handleFocus)
			app.renderer.off('resize', scheduleDomInputSync)
			if (syncFrameRef.current != null) {
				cancelAnimationFrame(syncFrameRef.current)
				syncFrameRef.current = null
			}
			domInput.remove()
			domInputRef.current = null
		}
	}, [align, app, height, maxLength, scheduleDomInputSync, secure, textColor])

	useEffect(() => {
		if (domInputRef.current) {
			domInputRef.current.value = value
		}
	}, [value])

	useEffect(() => {
		const domInput = domInputRef.current
		if (!domInput) return

		domInput.style.color = toCssColor(textColor)
		domInput.style.caretColor = toCssColor(textColor)
		domInput.style.textAlign = align
		domInput.style.setProperty('--input-placeholder-color', '#888888')
		domInput.placeholder = placeholder
		domInput.style.fontFamily = fontConfig.domFontFamily
		scheduleDomInputSync()
	}, [align, placeholder, scheduleDomInputSync, textColor])

	const rootLayout = {
		...(width != null ? { width } : { width: '100%' }),
		height,
		minHeight: height,
		minWidth: width ?? 200,
		position: 'relative',
		...layout,
	}

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
