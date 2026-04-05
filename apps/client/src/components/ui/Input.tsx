import { extend, useApplication } from '@pixi/react'
import { NineSliceSprite } from 'pixi.js'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ NineSliceSprite })

type InputProps = {
	x?: number
	y?: number
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
}

export const Input: FC<InputProps> = ({
	x = 0,
	y = 0,
	width = 200,
	height = 40,
	placeholder = '',
	value = '',
	maxLength,
	secure = false,
	align = 'left',
	textColor = 0xffffff,
	onChange,
	onEnter,
}) => {
	const { app } = useApplication()
	const domInputRef = useRef<HTMLInputElement | null>(null)
	const onChangeRef = useRef(onChange)
	const onEnterRef = useRef(onEnter)
	const [active, setActive] = useState(false)
	const [internalValue, setInternalValue] = useState(value)

	const inputTexture = useUITexture('input-field')
	const fontConfig = FONTS.general

	// Keep callback refs fresh without triggering DOM re-creation
	onChangeRef.current = onChange
	onEnterRef.current = onEnter

	// Sync controlled value into the DOM input and local state
	useEffect(() => {
		setInternalValue(value)
		if (domInputRef.current) {
			domInputRef.current.value = value
		}
	}, [value])

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

		Object.assign(domInput.style, {
			position: 'absolute',
			opacity: '0',
			pointerEvents: 'none',
			width: '1px',
			height: '1px',
			top: '0',
			left: '0',
			border: 'none',
			padding: '0',
			margin: '0',
			background: 'transparent',
			color: 'transparent',
			fontSize: '1px',
			outline: 'none',
		} as CSSStyleDeclaration)

		canvasParent.appendChild(domInput)
		domInputRef.current = domInput

		const handleInput = () => {
			const next = domInput.value
			setInternalValue(next)
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

		domInput.addEventListener('input', handleInput)
		domInput.addEventListener('keydown', handleKeyDown)
		domInput.addEventListener('blur', handleBlur)

		return () => {
			domInput.removeEventListener('input', handleInput)
			domInput.removeEventListener('keydown', handleKeyDown)
			domInput.removeEventListener('blur', handleBlur)
			domInput.remove()
			domInputRef.current = null
		}
	}, [app, secure, maxLength])

	const activate = useCallback(() => {
		if (!domInputRef.current) return
		setActive(true)
		domInputRef.current.focus()
	}, [])

	const displayText =
		active || internalValue
			? secure
				? '•'.repeat(internalValue.length)
				: internalValue
			: placeholder

	const isPlaceholder = !active && !internalValue
	const displayColor = isPlaceholder ? 0x888888 : textColor

	const textAnchorX = align === 'center' ? 0.5 : align === 'right' ? 1 : 0
	const textX =
		align === 'center' ? width / 2 : align === 'right' ? width - 12 : 12

	return (
		<pixiContainer
			x={x}
			y={y}
			eventMode='static'
			cursor='text'
			onPointerDown={activate}
			layout={{ width, height }}
		>
			<pixiNineSliceSprite
				texture={inputTexture}
				leftWidth={10}
				topHeight={10}
				rightWidth={10}
				bottomHeight={10}
				width={width}
				height={height}
				tint={active ? 0xffffff : 0xcccccc}
				eventMode='static'
				onPointerDown={activate}
			/>
			<pixiBitmapText
				x={textX}
				y={Math.round(height / 2)}
				text={displayText}
				anchor={{ x: textAnchorX, y: 0.5 }}
				style={{
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize * 0.5,
					fill: displayColor,
				}}
			/>
		</pixiContainer>
	)
}
