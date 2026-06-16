import { extend } from '@pixi/react'
import { BitmapText, Container, Graphics } from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'
import type {
	EditorKind,
	EditorSnapshot,
	EditorTextStyle,
} from './EditorContext'
import { getCaretRect, getSelectionRects, type Rect } from './editorGeometry'
import { buildMirrorStyleFromTextStyle, useEditorMirror } from './editorMirror'

extend({ BitmapText, Container, Graphics })

const CARET_BLINK_INTERVAL = 500

const JUSTIFY_MAP = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
} as const

const ALIGN_ITEMS_MAP = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
} as const

type EditorVisualsProps = {
	kind: EditorKind
	snapshot: EditorSnapshot
	propValue: string
	placeholder: string
	textStyle: EditorTextStyle
	box: { width: number; height: number }
}

const drawSelection =
	(rect: Rect, color: number, alpha: number) => (g: Graphics) => {
		g.clear()
		if (rect.width <= 0 || rect.height <= 0) return
		g.setFillStyle({ color, alpha })
		g.rect(rect.x, rect.y, rect.width, rect.height)
		g.fill()
	}

const drawCaret = (rect: Rect, color: number) => (g: Graphics) => {
	g.clear()
	if (rect.height <= 0) return
	g.setFillStyle({ color })
	g.rect(rect.x, rect.y, rect.width, rect.height)
	g.fill()
}

export const EditorVisuals = ({
	kind,
	snapshot,
	propValue,
	placeholder,
	textStyle,
	box,
}: EditorVisualsProps) => {
	const value = snapshot.focused ? snapshot.value : propValue
	const isEmpty = value.length === 0
	const showPlaceholder = isEmpty && !snapshot.focused
	const isFocused = snapshot.focused

	const mirrorStyle = useMemo(
		() => buildMirrorStyleFromTextStyle(kind, textStyle, box),
		[
			kind,
			textStyle.fontFamily,
			textStyle.domFontFamily,
			textStyle.fontSize,
			textStyle.lineHeight,
			textStyle.paddingTop,
			textStyle.paddingRight,
			textStyle.paddingBottom,
			textStyle.paddingLeft,
			textStyle.textAlign,
			box.width,
			box.height,
			box,
			textStyle,
		],
	)
	const mirror = useEditorMirror(mirrorStyle, kind)

	useEffect(() => {
		if (!mirror) return
		mirror.setValue(value)
	}, [mirror, value])

	const [caretVisible, setCaretVisible] = useState(true)
	useEffect(() => {
		if (!isFocused || snapshot.composing) {
			setCaretVisible(false)
			return
		}
		setCaretVisible(true)
		const interval = setInterval(() => {
			setCaretVisible((v) => !v)
		}, CARET_BLINK_INTERVAL)
		return () => clearInterval(interval)
	}, [isFocused, snapshot.composing])

	const showCaret = isFocused && !snapshot.composing && caretVisible
	const showSelection =
		isFocused &&
		!snapshot.composing &&
		snapshot.selection.start !== snapshot.selection.end

	const caretRect: Rect | null = useMemo(() => {
		if (!showCaret || !mirror) return null
		return getCaretRect(
			mirror.element,
			snapshot.selection.start,
			textStyle.caretWidth,
		)
	}, [showCaret, mirror, snapshot.selection.start, textStyle.caretWidth])

	const selectionRects: Rect[] = useMemo(() => {
		if (!showSelection || !mirror) return []
		return getSelectionRects(
			mirror.element,
			snapshot.selection.start,
			snapshot.selection.end,
		)
	}, [showSelection, mirror, snapshot.selection.start, snapshot.selection.end])

	const scrollOffsetX = kind === 'input' ? -snapshot.scroll.left : 0
	const scrollOffsetY = kind === 'textarea' ? -snapshot.scroll.top : 0

	const caretDisplayRect = caretRect
		? {
				x: caretRect.x + scrollOffsetX,
				y: caretRect.y + scrollOffsetY,
				width: caretRect.width || textStyle.caretWidth,
				height: caretRect.height || textStyle.lineHeight,
			}
		: null

	const selectionDisplayRects = selectionRects.map((rect) => ({
		x: rect.x + scrollOffsetX,
		y: rect.y + scrollOffsetY,
		width: rect.width,
		height: rect.height,
	}))

	const textFlexDirection: 'row' | 'column' =
		kind === 'textarea' ? 'column' : 'row'
	const textAlignItems: 'flex-start' | 'center' | 'flex-end' =
		kind === 'textarea' ? ALIGN_ITEMS_MAP[textStyle.textAlign] : 'center'
	const textJustify: 'flex-start' | 'center' | 'flex-end' =
		kind === 'textarea' ? 'flex-start' : JUSTIFY_MAP[textStyle.textAlign]

	const displayText = showPlaceholder ? placeholder : value
	const textFill = showPlaceholder
		? textStyle.placeholderColor
		: textStyle.disabled
			? 0x8a8a8a
			: textStyle.textColor

	return (
		<layoutContainer
			eventMode='none'
			layout={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				overflow: 'hidden',
			}}
		>
			<layoutContainer
				layout={{
					position: 'absolute',
					top: textStyle.paddingTop,
					left: textStyle.paddingLeft,
					right: textStyle.paddingRight,
					bottom: textStyle.paddingBottom,
					flexDirection: textFlexDirection,
					justifyContent: textJustify,
					alignItems: textAlignItems,
					overflow: 'hidden',
				}}
			>
				<layoutContainer
					layout={{
						marginLeft: scrollOffsetX,
						marginTop: scrollOffsetY,
						flexShrink: 0,
						flexDirection: textFlexDirection,
					}}
				>
					{displayText.length > 0 ? (
						<pixiBitmapText
							text={displayText}
							layout={{ flexShrink: 0 }}
							style={{
								fontFamily: textStyle.fontFamily,
								fontSize: textStyle.fontSize,
								fill: textFill,
							}}
						/>
					) : null}
				</layoutContainer>
			</layoutContainer>

			{caretDisplayRect ? (
				<pixiGraphics
					draw={drawCaret(caretDisplayRect, textStyle.caretColor)}
				/>
			) : null}

			{selectionDisplayRects.map((rect) => (
				<pixiGraphics
					key={`${rect.x.toFixed(2)}-${rect.y.toFixed(2)}-${rect.width.toFixed(2)}-${rect.height.toFixed(2)}`}
					draw={drawSelection(
						rect,
						textStyle.selectionColor,
						textStyle.selectionAlpha,
					)}
				/>
			))}
		</layoutContainer>
	)
}
