import { tw } from '@pixi/layout/tailwind'
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

const TEXT_ALIGNMENT = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
} as const

const DEBUG_DOM_INPUT = true

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
	const onChangeRef = useRef(onChange)
	const onEnterRef = useRef(onEnter)
	const valueRef = useRef(value)
	const placeholderRef = useRef(placeholder)
	const [active, setActive] = useState(false)
	const [internalValue, setInternalValue] = useState(value)

	const inputTexture = useUITexture('input-field')
	const fontConfig = FONTS.body

	// Keep callback refs fresh without triggering DOM re-creation
	onChangeRef.current = onChange
	onEnterRef.current = onEnter
	valueRef.current = value
	placeholderRef.current = placeholder

	// Sync controlled value into the DOM input and local state
	useEffect(() => {
		setInternalValue(value)
		if (domInputRef.current) {
			domInputRef.current.value = value
		}
	}, [value])

	const syncDomInputPosition = useCallback(() => {
		if (!DEBUG_DOM_INPUT || !app?.canvas) return
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
		const height = bounds.height

		domInput.style.left = `${left}px`
		domInput.style.top = `${top}px`
		domInput.style.width = `${width}px`
		domInput.style.height = `${height}px`

		if (DEBUG_DOM_INPUT) {
			console.log('[Input DOM] position', {
				boundsX: bounds.x,
				boundsY: bounds.y,
				boundsWidth: bounds.width,
				boundsHeight: bounds.height,
				left,
				top,
				width,
				height,
				canvasWidth: canvasRect.width,
				canvasHeight: canvasRect.height,
				screenWidth: app.screen.width,
				screenHeight: app.screen.height,
				resolution: app.renderer.resolution,
			})
		}
	}, [app])

	const inputRefCallback = useCallback(
		(node: Container | null) => {
			const previousNode = inputNodeRef.current
			if (previousNode) {
				previousNode.off('layout', syncDomInputPosition)
			}

			inputNodeRef.current = node

			if (node) {
				node.on('layout', syncDomInputPosition)
				syncDomInputPosition()
			}
		},
		[syncDomInputPosition],
	)

	// Create the invisible DOM input once; recreate only when structural props change
	useEffect(() => {
		if (!app?.canvas) return

		const canvas = app.canvas as HTMLCanvasElement
		const canvasParent = canvas.parentElement
		if (!canvasParent) return

		const parentStyle = window.getComputedStyle(canvasParent)
		if (parentStyle.position === 'static') {
			canvasParent.style.position = 'relative'
		}

		const domInput = document.createElement('input')
		domInput.type = secure ? 'password' : 'text'
		if (maxLength) domInput.maxLength = maxLength
		domInput.autocomplete = 'off'
		domInput.spellcheck = false
		domInput.placeholder = placeholderRef.current

		Object.assign(domInput.style, {
			position: 'absolute',
			opacity: DEBUG_DOM_INPUT ? '0.95' : '0',
			pointerEvents: DEBUG_DOM_INPUT ? 'auto' : 'none',
			width: DEBUG_DOM_INPUT ? '200px' : '1px',
			height: DEBUG_DOM_INPUT ? `${height}px` : '1px',
			boxSizing: 'border-box',
			top: '0',
			left: '0',
			border: DEBUG_DOM_INPUT ? '1px solid #ff4d4f' : 'none',
			borderRadius: '6px',
			padding: DEBUG_DOM_INPUT ? '0 12px' : '0',
			margin: '0',
			background: DEBUG_DOM_INPUT ? 'rgba(255, 244, 229, 0.12)' : 'transparent',
			color: DEBUG_DOM_INPUT ? '#ffffff' : 'transparent',
			fontSize: DEBUG_DOM_INPUT ? `${FONTS.body.fontSize}px` : '1px',
			fontFamily: FONTS.body.fontFamily,
			outline: 'none',
			zIndex: '999',
		} satisfies Partial<CSSStyleDeclaration>)

		domInput.value = valueRef.current

		canvasParent.appendChild(domInput)
		domInputRef.current = domInput
		syncDomInputPosition()

		const handleInput = () => {
			const next = domInput.value
			if (DEBUG_DOM_INPUT) {
				console.log('[Input DOM] input', {
					next,
					placeholder: placeholderRef.current,
				})
			}
			setInternalValue(next)
			onChangeRef.current?.(next)
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (DEBUG_DOM_INPUT) {
				console.log('[Input DOM] keydown', e.key)
			}
			if (e.key === 'Enter') {
				onEnterRef.current?.(domInput.value)
				domInput.blur()
			}
			if (e.key === 'Escape') {
				domInput.blur()
			}
		}

		const handleBlur = () => {
			if (DEBUG_DOM_INPUT) {
				console.log('[Input DOM] blur')
			}
			setActive(false)
		}
		const handleFocus = () => {
			if (DEBUG_DOM_INPUT) {
				console.log('[Input DOM] focus')
			}
			setActive(true)
		}

		domInput.addEventListener('input', handleInput)
		domInput.addEventListener('keydown', handleKeyDown)
		domInput.addEventListener('blur', handleBlur)
		domInput.addEventListener('focus', handleFocus)

		window.addEventListener('resize', syncDomInputPosition)

		return () => {
			domInput.removeEventListener('input', handleInput)
			domInput.removeEventListener('keydown', handleKeyDown)
			domInput.removeEventListener('blur', handleBlur)
			domInput.removeEventListener('focus', handleFocus)
			window.removeEventListener('resize', syncDomInputPosition)
			domInput.remove()
			domInputRef.current = null
		}
	}, [app, secure, maxLength, height, syncDomInputPosition])

	const activate = useCallback(() => {
		if (!domInputRef.current) return
		if (DEBUG_DOM_INPUT) {
			console.log('[Input Pixi] activate')
		}
		syncDomInputPosition()
		setActive(true)
		domInputRef.current.focus()
	}, [syncDomInputPosition])

	const displayText =
		active || internalValue
			? secure
				? '•'.repeat(internalValue.length)
				: internalValue
			: placeholder

	const isPlaceholder = !active && !internalValue
	const displayColor = isPlaceholder ? 0x888888 : textColor
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
			onPointerDown={activate}
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
			<layoutContainer
				layout={{
					...tw`w-full h-full`,
					paddingLeft: 12,
					paddingRight: 12,
					alignItems: 'center',
					justifyContent: TEXT_ALIGNMENT[align],
					overflow: 'hidden',
				}}
			>
				<pixiBitmapText
					text={displayText}
					style={{
						fontFamily: fontConfig.fontFamily,
						fontSize: fontConfig.fontSize,
						fill: displayColor,
					}}
					layout={{
						width: 'intrinsic',
						height: 'intrinsic',
						flexShrink: 0,
					}}
					roundPixels
				/>
			</layoutContainer>
		</layoutContainer>
	)
}
