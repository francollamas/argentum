import type { LayoutOptions } from '@pixi/layout'
import { useApplication } from '@pixi/react'
import type { FederatedPointerEvent, NineSliceSprite } from 'pixi.js'
import {
	forwardRef,
	useCallback,
	useEffect,
	useId,
	useImperativeHandle,
	useMemo,
	useRef,
} from 'react'
import { useIsDomOverlayOccluded } from '../../hooks/useOverlayLayer'
import { useUITexture } from '../../hooks/useUITexture'
import { Colors } from './colors'
import {
	INPUT_CARET_HEIGHT,
	INPUT_FONT_SIZE,
	INPUT_HEIGHT,
	INPUT_PADDING_X,
	maskTextValue,
} from './textEditor/textMeasurement'
import {
	getSingleLineCaretPosition,
	getSingleLineIndexAtX,
	getSingleLineSelectionRects,
} from './textEditor/textSelection'
import type { TextEditorRegistration } from './textEditor/types'
import { useActiveTextEditor } from './textEditor/useActiveTextEditor'
import { useEditorBounds } from './textEditor/useEditorBounds'
import { useTextEditorRegistration } from './textEditor/useTextEditorRegistration'

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
	tabIndex?: number
	layout?: Record<string, unknown>
}

const SELECTION_COLOR = 0xffd666

export const Input = forwardRef<InputHandle, InputProps>(function Input(
	{
		width,
		height = INPUT_HEIGHT,
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
		tabIndex,
		layout,
	},
	ref,
) {
	const id = useId().replace(/:/g, '_')
	const { app } = useApplication()
	const backgroundSpriteRef = useRef<NineSliceSprite | null>(null)
	const isDomOverlayOccluded = useIsDomOverlayOccluded()
	const inputTexture = useUITexture('input-field')
	const bounds = useEditorBounds(backgroundSpriteRef, width ?? 200, height)

	const registration = useMemo<TextEditorRegistration>(
		() => ({
			id,
			kind: 'input',
			getValue: () => value,
			setValue: (nextValue) => onChange?.(nextValue),
			onBlur,
			onEnter,
			isDisabled: () => disabled || isDomOverlayOccluded,
			getVisibleRect: () => {
				const bounds = backgroundSpriteRef.current?.getBounds()
				if (!bounds || !app?.canvas) {
					return null
				}

				const canvasRect = app.canvas.getBoundingClientRect()
				return new DOMRect(
					canvasRect.left + bounds.x,
					canvasRect.top + bounds.y,
					bounds.width,
					bounds.height,
				)
			},
			getConfig: () => ({
				placeholder,
				secure,
				maxLength,
				align,
			}),
		}),
		[
			align,
			app,
			disabled,
			id,
			isDomOverlayOccluded,
			maxLength,
			onBlur,
			onChange,
			onEnter,
			placeholder,
			secure,
			value,
		],
	)

	const { activate, blur, updateSelection } =
		useTextEditorRegistration(registration)
	const activeEditor = useActiveTextEditor(id)
	const active = Boolean(activeEditor?.focused)
	const effectiveTextColor = disabled ? Colors.disabled : textColor
	const displayValue = activeEditor?.value ?? value
	const displayText = maskTextValue(displayValue, secure)
	const scrollLeft = activeEditor?.scroll.left ?? 0
	const viewportWidth = Math.max(0, bounds.width - INPUT_PADDING_X * 2)
	const caretPosition = activeEditor
		? getSingleLineCaretPosition({
				value: displayValue,
				secure,
				index: activeEditor.selection.end,
				viewportWidth,
				align,
				scrollLeft,
				caretHeight: INPUT_CARET_HEIGHT,
				contentHeight: height,
			})
		: null
	const selectionRects = activeEditor
		? getSingleLineSelectionRects({
				value: displayValue,
				secure,
				selection: activeEditor.selection,
				viewportWidth,
				align,
				scrollLeft,
				height,
			})
		: []

	useImperativeHandle(
		ref,
		() => ({
			focus: () => activate(),
			blur,
		}),
		[activate, blur],
	)

	useEffect(() => {
		if (disabled || isDomOverlayOccluded) {
			blur()
		}
	}, [blur, disabled, isDomOverlayOccluded])

	const rootLayout = {
		...(width != null ? { width } : { width: '100%' }),
		height,
		minHeight: height,
		minWidth: width ?? 200,
		position: 'relative' as const,
		...layout,
	} as unknown as Omit<LayoutOptions, 'target'>

	const resolveSelectionIndex = useCallback(
		(globalX: number) => {
			const bounds = backgroundSpriteRef.current?.getBounds()
			if (!bounds) {
				return displayValue.length
			}

			const localX = globalX - bounds.x - INPUT_PADDING_X
			return getSingleLineIndexAtX({
				value: displayValue,
				secure,
				viewportWidth: Math.max(1, bounds.width - INPUT_PADDING_X * 2),
				align,
				scrollLeft: activeEditor?.scroll.left ?? 0,
				x: localX,
			})
		},
		[activeEditor?.scroll.left, align, displayValue, secure],
	)

	const handlePointerDown = useCallback(
		(event: FederatedPointerEvent) => {
			if (disabled || isDomOverlayOccluded) {
				return
			}

			const startIndex = resolveSelectionIndex(event.global.x)
			activate({
				selection: {
					start: startIndex,
					end: startIndex,
					direction: 'none',
				},
			})

			const handlePointerMove = (moveEvent: PointerEvent) => {
				const canvasRect = app?.canvas?.getBoundingClientRect()
				const nextIndex = resolveSelectionIndex(
					canvasRect ? moveEvent.clientX - canvasRect.left : moveEvent.clientX,
				)
				updateSelection({
					start: startIndex,
					end: nextIndex,
					direction: nextIndex >= startIndex ? 'forward' : 'backward',
				})
			}

			const handlePointerUp = () => {
				window.removeEventListener('pointermove', handlePointerMove)
				window.removeEventListener('pointerup', handlePointerUp)
			}

			window.addEventListener('pointermove', handlePointerMove)
			window.addEventListener('pointerup', handlePointerUp)
		},
		[
			activate,
			app,
			disabled,
			isDomOverlayOccluded,
			resolveSelectionIndex,
			updateSelection,
		],
	)

	return (
		<layoutContainer
			eventMode='static'
			cursor={disabled ? 'default' : 'text'}
			onPointerDown={handlePointerDown}
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
			<layoutContainer
				layout={{
					position: 'absolute',
					left: INPUT_PADDING_X,
					right: INPUT_PADDING_X,
					top: 0,
					bottom: 0,
					overflow: 'hidden',
				}}
			>
				<pixiGraphics
					draw={(graphics) => {
						graphics.clear()

						for (const rect of selectionRects) {
							graphics.rect(rect.x, rect.y, rect.width, rect.height)
							graphics.fill({ color: SELECTION_COLOR, alpha: 0.35 })
						}
					}}
				/>
				{displayText ? (
					<pixiBitmapText
						text={displayText}
						x={
							activeEditor
								? getSingleLineCaretPosition({
										value: displayValue,
										secure,
										index: 0,
										viewportWidth,
										align,
										scrollLeft,
										caretHeight: INPUT_CARET_HEIGHT,
										contentHeight: height,
									}).x
								: 0
						}
						y={Math.max(0, (height - INPUT_FONT_SIZE) / 2 - 1)}
						style={{
							fontFamily: 'inter',
							fontSize: INPUT_FONT_SIZE,
							fill: effectiveTextColor,
						}}
					/>
				) : placeholder ? (
					<pixiBitmapText
						text={placeholder}
						x={0}
						y={Math.max(0, (height - INPUT_FONT_SIZE) / 2 - 1)}
						style={{
							fontFamily: 'inter',
							fontSize: INPUT_FONT_SIZE,
							fill: Colors.disabled,
						}}
					/>
				) : null}
				<pixiGraphics
					draw={(graphics) => {
						graphics.clear()

						if (
							!activeEditor ||
							activeEditor.selection.start !== activeEditor.selection.end ||
							!caretPosition
						) {
							return
						}

						graphics.rect(
							caretPosition.x,
							caretPosition.y,
							1,
							INPUT_CARET_HEIGHT,
						)
						graphics.fill(effectiveTextColor)
					}}
				/>
			</layoutContainer>
		</layoutContainer>
	)
})
