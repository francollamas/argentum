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
import { DomTextAreaOverlay } from './DomTextAreaOverlay'

export type TextAreaHandle = {
	focus: () => void
	blur: () => void
}

type TextAreaProps = {
	width?: number
	height?: number
	placeholder?: string
	value?: string
	maxLength?: number
	align?: 'left' | 'center' | 'right'
	textColor?: number
	disabled?: boolean
	invalid?: boolean
	onChange?: (value: string) => void
	onBlur?: () => void
	layout?: Record<string, unknown>
}

const toCssColor = (value: number) => `#${value.toString(16).padStart(6, '0')}`

type DomTextAreaStyle = CSSProperties & {
	'--input-placeholder-color': string
}

const TEXTAREA_DOM_FONT_FAMILY = FONTS.body.domFontFamily
const TEXTAREA_FONT_SIZE = FONTS.body.fontSize

export const TextArea = forwardRef<TextAreaHandle, TextAreaProps>(
	function TextArea(
		{
			width,
			height = 120,
			placeholder = '',
			value = '',
			maxLength,
			align = 'left',
			textColor = 0xffffff,
			disabled = false,
			invalid = false,
			onChange,
			onBlur,
			layout,
		},
		ref,
	) {
		const { app } = useApplication()
		const backgroundSpriteRef = useRef<NineSliceSprite | null>(null)
		const domTextAreaRef = useRef<HTMLTextAreaElement | null>(null)
		const [active, setActive] = useState(false)
		const isDomOverlayOccluded = useIsDomOverlayOccluded()

		const inputTexture = useUITexture('input-field')
		const { hostElement, overlayRoot } = useDomOverlayHost(app)

		useImperativeHandle(
			ref,
			() => ({
				focus: () => domTextAreaRef.current?.focus(),
				blur: () => domTextAreaRef.current?.blur(),
			}),
			[],
		)

		useEffect(() => {
			if (disabled || isDomOverlayOccluded) {
				domTextAreaRef.current?.blur()
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
			}): DomTextAreaStyle => {
				const left = canvasRect.left - containerRect.left + bounds.x
				const top = canvasRect.top - containerRect.top + bounds.y
				const renderedHeight = bounds.height
				const domScale = height > 0 ? renderedHeight / height : 1
				const paddingInline = Math.max(8, 12 * domScale)
				const paddingTop = Math.max(10, 12 * domScale)
				const paddingBottom = Math.max(12, 14 * domScale)
				const fontSize = Math.max(12, TEXTAREA_FONT_SIZE * domScale)
				const lineHeight = Math.max(fontSize * 1.6, fontSize + 10)
				const borderRadius = Math.max(6, 6 * domScale)
				const effectiveTextColor = disabled ? Colors.disabled : textColor

				return {
					position: 'absolute',
					top,
					left,
					width: bounds.width,
					height: renderedHeight,
					paddingTop,
					paddingRight: paddingInline,
					paddingBottom,
					paddingLeft: paddingInline,
					margin: 0,
					boxSizing: 'border-box',
					border: 'none',
					borderRadius,
					background: 'transparent',
					color: toCssColor(effectiveTextColor),
					caretColor: toCssColor(effectiveTextColor),
					textAlign: align,
					fontSize,
					fontFamily: TEXTAREA_DOM_FONT_FAMILY,
					lineHeight: `${lineHeight}px`,
					appearance: 'none',
					outline: 'none',
					pointerEvents: disabled ? 'none' : 'auto',
					opacity: disabled ? 0.7 : 1,
					resize: 'none',
					overflowX: 'hidden',
					overflowY: 'auto',
					zIndex: 999,
					'--input-placeholder-color': '#888888',
				}
			},
			[align, disabled, height, textColor],
		)

		const { style: domTextAreaStyle, scheduleSync: scheduleOverlaySync } =
			useOverlayPositionSync({
				app,
				hostElement,
				targetRef: backgroundSpriteRef,
				computeStyle: computeOverlayStyle,
			})

		const { refCallback: textAreaContainerRef } =
			usePixiLayoutListener<Container>(scheduleOverlaySync)

		useEffect(() => {
			overlayRoot?.render(
				isDomOverlayOccluded ? null : (
					<DomTextAreaOverlay
						style={domTextAreaStyle}
						placeholder={placeholder}
						value={value}
						textareaRef={domTextAreaRef}
						maxLength={maxLength}
						disabled={disabled}
						onChange={onChange}
						onFocus={() => setActive(true)}
						onBlur={() => {
							setActive(false)
							onBlur?.()
						}}
					/>
				),
			)
		}, [
			disabled,
			domTextAreaStyle,
			isDomOverlayOccluded,
			maxLength,
			onBlur,
			onChange,
			overlayRoot,
			placeholder,
			value,
		])

		const rootLayout = {
			...(width != null ? { width } : { width: '100%' }),
			height,
			minHeight: height,
			minWidth: width ?? 240,
			position: 'relative' as const,
			...layout,
		} as unknown as Omit<LayoutOptions, 'target'>

		return (
			<layoutContainer
				ref={textAreaContainerRef}
				eventMode='static'
				cursor={disabled ? 'default' : 'text'}
				onPointerDown={() => {
					if (!disabled && !isDomOverlayOccluded) {
						domTextAreaRef.current?.focus()
					}
				}}
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
	},
)
