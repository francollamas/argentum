import type { LayoutOptions } from '@pixi/layout'
import { useApplication } from '@pixi/react'
import type { Bounds, Container, NineSliceSprite } from 'pixi.js'
import type { CSSProperties } from 'react'
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import { FONTS } from '../../config/typography'
import { useDomOverlayHost } from '../../hooks/useDomOverlayHost'
import { useIsDomOverlayOccluded } from '../../hooks/useOverlayLayer'
import { useOverlayPositionSync } from '../../hooks/useOverlayPositionSync'
import { usePixiLayoutListener } from '../../hooks/usePixiLayoutListener'
import { useUITexture } from '../../hooks/useUITexture'
import { Colors } from './colors'
import { DomInputOverlay } from './DomInputOverlay'
import { useScrollGestureContext } from './ScrollGestureContext'

export type InputHandle = {
	focus: () => void
	blur: () => void
}

type InputProps = {
	width?: number
	height?: number
	placeholder?: string
	value?: string
	maxLength?: number
	secure?: boolean
	align?: 'left' | 'center' | 'right'
	textColor?: number
	disabled?: boolean
	invalid?: boolean
	onChange?: (value: string) => void
	onBlur?: () => void
	onEnter?: (value: string) => void
	layout?: Record<string, unknown>
}

const toCssColor = (value: number) => `#${value.toString(16).padStart(6, '0')}`

type DomInputStyle = CSSProperties & {
	'--input-placeholder-color': string
}

const INPUT_DOM_FONT_FAMILY = FONTS.input.domFontFamily
const INPUT_FONT_SIZE = FONTS.input.fontSize

export const Input = forwardRef<InputHandle, InputProps>(function Input(
	{
		width,
		height = 40,
		placeholder = '',
		value = '',
		maxLength,
		secure = false,
		align = 'left',
		textColor = 0xffffff,
		disabled = false,
		invalid = false,
		onChange,
		onBlur,
		onEnter,
		layout,
	},
	ref,
) {
	const { app } = useApplication()
	const { shouldCancelTap } = useScrollGestureContext()
	const backgroundSpriteRef = useRef<NineSliceSprite | null>(null)
	const domInputRef = useRef<HTMLInputElement | null>(null)
	const [active, setActive] = useState(false)
	const isDomOverlayOccluded = useIsDomOverlayOccluded()

	const inputTexture = useUITexture('input-field')
	const { hostElement, overlayRoot } = useDomOverlayHost(app)

	useImperativeHandle(
		ref,
		() => ({
			focus: () => domInputRef.current?.focus(),
			blur: () => domInputRef.current?.blur(),
		}),
		[],
	)

	useEffect(() => {
		if (disabled || isDomOverlayOccluded) {
			domInputRef.current?.blur()
			setActive(false)
		}
	}, [disabled, isDomOverlayOccluded])

	const computeOverlayStyle = useCallback(
		({
			bounds,
			canvasRect,
			containerRect,
		}: {
			bounds: Bounds
			canvasRect: DOMRect
			containerRect: DOMRect
		}): DomInputStyle => {
			const left = canvasRect.left - containerRect.left + bounds.x
			const top = canvasRect.top - containerRect.top + bounds.y
			const renderedHeight = bounds.height
			const domScale = height > 0 ? renderedHeight / height : 1
			const paddingInline = Math.max(8, 12 * domScale)
			const fontSize = Math.max(12, INPUT_FONT_SIZE * domScale)
			const lineHeight = Math.max(1, renderedHeight - 2)
			const borderRadius = Math.max(6, 6 * domScale)
			const effectiveTextColor = disabled ? Colors.disabled : textColor

			return {
				position: 'absolute',
				top,
				left,
				width: bounds.width,
				height: renderedHeight,
				padding: `0 ${paddingInline}px`,
				margin: 0,
				boxSizing: 'border-box',
				border: 'none',
				borderRadius,
				background: 'transparent',
				color: toCssColor(effectiveTextColor),
				caretColor: toCssColor(effectiveTextColor),
				textAlign: align,
				fontSize,
				fontFamily: INPUT_DOM_FONT_FAMILY,
				lineHeight: `${lineHeight}px`,
				appearance: 'none',
				outline: 'none',
				pointerEvents: disabled ? 'none' : 'auto',
				opacity: disabled ? 0.7 : 1,
				zIndex: 999,
				'--input-placeholder-color': '#888888',
			}
		},
		[align, disabled, height, textColor],
	)

	const { style: domInputStyle, scheduleSync: scheduleOverlaySync } =
		useOverlayPositionSync({
			app,
			hostElement,
			targetRef: backgroundSpriteRef,
			computeStyle: computeOverlayStyle,
		})

	const { refCallback: inputContainerRef } =
		usePixiLayoutListener<Container>(scheduleOverlaySync)

	useEffect(() => {
		overlayRoot?.render(
			isDomOverlayOccluded ? null : (
				<DomInputOverlay
					style={domInputStyle}
					interactive={active}
					placeholder={placeholder}
					value={value}
					inputRef={domInputRef}
					maxLength={maxLength}
					secure={secure}
					disabled={disabled}
					onChange={onChange}
					onEnter={onEnter}
					onFocus={() => setActive(true)}
					onBlur={() => {
						setActive(false)
						onBlur?.()
					}}
				/>
			),
		)
	}, [
		active,
		disabled,
		domInputStyle,
		isDomOverlayOccluded,
		maxLength,
		onChange,
		onBlur,
		onEnter,
		overlayRoot,
		placeholder,
		secure,
		value,
	])

	const rootLayout = {
		...(width != null ? { width } : { width: '100%' }),
		height,
		minHeight: height,
		minWidth: width ?? 200,
		position: 'relative' as const,
		...layout,
	} as unknown as Omit<LayoutOptions, 'target'>

	const handleFocus = () => {
		if (!disabled && !isDomOverlayOccluded && !shouldCancelTap()) {
			domInputRef.current?.focus()
		}
	}

	return (
		<layoutContainer
			ref={inputContainerRef}
			eventMode='static'
			cursor={disabled ? 'default' : 'text'}
			onPointerTap={handleFocus}
			layout={rootLayout}
			alpha={disabled ? 0.7 : 1}
		>
			<pixiNineSliceSprite
				ref={backgroundSpriteRef}
				texture={inputTexture}
				leftWidth={10}
				topHeight={10}
				rightWidth={10}
				bottomHeight={10}
				tint={
					disabled
						? Colors.disabled
						: invalid
							? Colors.statusError
							: active
								? 0xffffff
								: 0xcccccc
				}
				layout={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					applySizeDirectly: true,
				}}
			/>
		</layoutContainer>
	)
})
