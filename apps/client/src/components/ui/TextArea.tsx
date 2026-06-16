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
	layoutMultilineText,
	TEXTAREA_FONT_SIZE,
	TEXTAREA_LINE_HEIGHT,
	TEXTAREA_PADDING_BOTTOM,
	TEXTAREA_PADDING_LEFT,
	TEXTAREA_PADDING_RIGHT,
	TEXTAREA_PADDING_TOP,
} from './textEditor/textMeasurement'
import {
	getMultilineCaretPosition,
	getMultilineIndexAtPoint,
	getMultilineSelectionRects,
} from './textEditor/textSelection'
import type { TextEditorRegistration } from './textEditor/types'
import { useActiveTextEditor } from './textEditor/useActiveTextEditor'
import { useEditorBounds } from './textEditor/useEditorBounds'
import { useTextEditorRegistration } from './textEditor/useTextEditorRegistration'

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

const SELECTION_COLOR = 0xffd666

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
		const id = useId().replace(/:/g, '_')
		const { app } = useApplication()
		const backgroundSpriteRef = useRef<NineSliceSprite | null>(null)
		const isDomOverlayOccluded = useIsDomOverlayOccluded()
		const inputTexture = useUITexture('input-field')
		const bounds = useEditorBounds(backgroundSpriteRef, width ?? 240, height)

		const registration = useMemo<TextEditorRegistration>(
			() => ({
				id,
				kind: 'textarea',
				getValue: () => value,
				setValue: (nextValue) => onChange?.(nextValue),
				onBlur,
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
				placeholder,
				value,
			],
		)

		const { activate, blur, updateSelection } =
			useTextEditorRegistration(registration)
		const activeEditor = useActiveTextEditor(id)
		const active = Boolean(activeEditor?.focused)
		const effectiveTextColor = disabled ? Colors.disabled : textColor
		const displayValue = activeEditor?.value ?? value
		const scrollLeft = activeEditor?.scroll.left ?? 0
		const scrollTop = activeEditor?.scroll.top ?? 0
		const viewportWidth = Math.max(
			1,
			bounds.width - TEXTAREA_PADDING_LEFT - TEXTAREA_PADDING_RIGHT,
		)
		const displayLines = useMemo(
			() => layoutMultilineText(displayValue, viewportWidth),
			[displayValue, viewportWidth],
		)
		const selectionRects = activeEditor
			? getMultilineSelectionRects({
					value: displayValue,
					selection: activeEditor.selection,
					viewportWidth,
					align,
					lineHeight: TEXTAREA_LINE_HEIGHT,
					scrollLeft,
					scrollTop,
				})
			: []
		const caretPosition = activeEditor
			? getMultilineCaretPosition({
					value: displayValue,
					index: activeEditor.selection.end,
					viewportWidth,
					align,
					lineHeight: TEXTAREA_LINE_HEIGHT,
					scrollLeft,
					scrollTop,
				})
			: null

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
			minWidth: width ?? 240,
			position: 'relative' as const,
			...layout,
		} as unknown as Omit<LayoutOptions, 'target'>

		const resolveSelectionIndex = useCallback(
			(globalX: number, globalY: number) => {
				const bounds = backgroundSpriteRef.current?.getBounds()
				if (!bounds) {
					return displayValue.length
				}

				return getMultilineIndexAtPoint({
					value: displayValue,
					viewportWidth: Math.max(
						1,
						bounds.width - TEXTAREA_PADDING_LEFT - TEXTAREA_PADDING_RIGHT,
					),
					align,
					lineHeight: TEXTAREA_LINE_HEIGHT,
					scrollLeft: activeEditor?.scroll.left ?? 0,
					scrollTop: activeEditor?.scroll.top ?? 0,
					point: {
						x: globalX - bounds.x - TEXTAREA_PADDING_LEFT,
						y: globalY - bounds.y - TEXTAREA_PADDING_TOP,
					},
				})
			},
			[
				activeEditor?.scroll.left,
				activeEditor?.scroll.top,
				align,
				displayValue,
			],
		)

		const handlePointerDown = useCallback(
			(event: FederatedPointerEvent) => {
				if (disabled || isDomOverlayOccluded) {
					return
				}

				const startIndex = resolveSelectionIndex(event.global.x, event.global.y)
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
						canvasRect
							? moveEvent.clientX - canvasRect.left
							: moveEvent.clientX,
						canvasRect ? moveEvent.clientY - canvasRect.top : moveEvent.clientY,
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
						left: TEXTAREA_PADDING_LEFT,
						right: TEXTAREA_PADDING_RIGHT,
						top: TEXTAREA_PADDING_TOP,
						bottom: TEXTAREA_PADDING_BOTTOM,
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
					{displayLines.length > 0 && displayValue ? (
						displayLines.map((line, index) => (
							<pixiBitmapText
								key={`${line.start}-${line.end}-${line.text}`}
								text={line.text}
								x={
									align === 'center'
										? (viewportWidth - line.width) / 2 - scrollLeft
										: align === 'right'
											? viewportWidth - line.width - scrollLeft
											: -scrollLeft
								}
								y={index * TEXTAREA_LINE_HEIGHT - scrollTop}
								style={{
									fontFamily: 'inter',
									fontSize: TEXTAREA_FONT_SIZE,
									fill: effectiveTextColor,
								}}
							/>
						))
					) : placeholder ? (
						<pixiBitmapText
							text={placeholder}
							x={0}
							y={0}
							style={{
								fontFamily: 'inter',
								fontSize: TEXTAREA_FONT_SIZE,
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
								TEXTAREA_LINE_HEIGHT,
							)
							graphics.fill(effectiveTextColor)
						}}
					/>
				</layoutContainer>
			</layoutContainer>
		)
	},
)
