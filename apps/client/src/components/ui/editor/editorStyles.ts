import type { CSSProperties } from 'react'
import { Colors } from '../colors'
import type {
	EditorKind,
	EditorPositionContext,
	EditorTextStyle,
} from './EditorContext'

const DEFAULT_PLACEHOLDER_COLOR = 0x888888
const DEFAULT_SELECTION_COLOR = 0xffd666
const DEFAULT_SELECTION_ALPHA = 0.35
const DEFAULT_CARET_WIDTH = 2
const MIN_PADDING_INLINE = 8
const MIN_PADDING_VERTICAL = 10
const MIN_FONT_SIZE = 12
const MIN_BORDER_RADIUS = 6
const BASE_PADDING_INLINE = 12
const BASE_PADDING_TOP = 12
const BASE_PADDING_BOTTOM = 14
const TEXTAREA_LINE_HEIGHT_RATIO = 1.6

export type EditorStyleBundle = {
	boxStyle: CSSProperties
	mirrorStyle: CSSProperties
}

export function buildTextStyle(options: {
	fontFamily: string
	domFontFamily: string
	fontSize: number
	renderedHeight: number
	align: 'left' | 'center' | 'right'
	textColor: number
	disabled: boolean
	kind: EditorKind
}): EditorTextStyle {
	const domScale =
		options.renderedHeight > 0 && options.fontSize > 0
			? options.renderedHeight / Math.max(options.fontSize + 16, 1)
			: 1

	const paddingInline = Math.max(
		MIN_PADDING_INLINE,
		BASE_PADDING_INLINE * domScale,
	)
	const paddingTop =
		options.kind === 'textarea'
			? Math.max(MIN_PADDING_VERTICAL, BASE_PADDING_TOP * domScale)
			: 0
	const paddingBottom =
		options.kind === 'textarea'
			? Math.max(MIN_PADDING_VERTICAL + 2, BASE_PADDING_BOTTOM * domScale)
			: 0

	const fontSize = Math.max(MIN_FONT_SIZE, options.fontSize * domScale)
	const lineHeight =
		options.kind === 'textarea'
			? Math.max(fontSize * TEXTAREA_LINE_HEIGHT_RATIO, fontSize + 10)
			: Math.max(1, options.renderedHeight - 2)

	const textColor = options.disabled ? Colors.disabled : options.textColor

	return {
		fontFamily: options.fontFamily,
		domFontFamily: options.domFontFamily,
		fontSize,
		lineHeight,
		paddingTop,
		paddingRight: paddingInline,
		paddingBottom,
		paddingLeft: paddingInline,
		textAlign: options.align,
		textColor,
		placeholderColor: DEFAULT_PLACEHOLDER_COLOR,
		selectionColor: DEFAULT_SELECTION_COLOR,
		selectionAlpha: DEFAULT_SELECTION_ALPHA,
		caretColor: textColor,
		caretWidth: DEFAULT_CARET_WIDTH,
		disabled: options.disabled,
	}
}

export function computeBorderRadius(textStyle: EditorTextStyle): number {
	return Math.max(MIN_BORDER_RADIUS, textStyle.fontSize * 0.375)
}

export function buildEditorStyleBundle(
	ctx: EditorPositionContext,
	textStyle: EditorTextStyle,
): EditorStyleBundle {
	const left = ctx.canvasRect.left - ctx.containerRect.left + ctx.bounds.x
	const top = ctx.canvasRect.top - ctx.containerRect.top + ctx.bounds.y
	const renderedHeight = ctx.bounds.height

	const boxStyle: CSSProperties = {
		position: 'absolute',
		top,
		left,
		width: ctx.bounds.width,
		height: renderedHeight,
		margin: 0,
		boxSizing: 'border-box',
		border: 'none',
		borderRadius: computeBorderRadius(textStyle),
		background: 'transparent',
		color: 'transparent',
		caretColor: 'transparent',
		WebkitTextFillColor: 'transparent',
		fontSize: textStyle.fontSize,
		fontFamily: textStyle.domFontFamily,
		lineHeight: `${textStyle.lineHeight}px`,
		appearance: 'none',
		outline: 'none',
		pointerEvents: ctx.disabled ? 'none' : 'auto',
		opacity: ctx.disabled ? 0.7 : 1,
		zIndex: ctx.zIndex,
		resize: 'none',
		overflowX: 'hidden',
		overflowY: 'auto',
	}

	if (ctx.disabled) {
		boxStyle.padding = 0
	} else {
		boxStyle.paddingTop = textStyle.paddingTop
		boxStyle.paddingRight = textStyle.paddingRight
		boxStyle.paddingBottom = textStyle.paddingBottom
		boxStyle.paddingLeft = textStyle.paddingLeft
	}

	const mirrorStyle: CSSProperties = {
		position: 'absolute',
		top: '-9999px',
		left: '-9999px',
		width: ctx.bounds.width,
		height: renderedHeight,
		paddingTop: textStyle.paddingTop,
		paddingRight: textStyle.paddingRight,
		paddingBottom: textStyle.paddingBottom,
		paddingLeft: textStyle.paddingLeft,
		margin: 0,
		boxSizing: 'border-box',
		border: 'none',
		fontSize: textStyle.fontSize,
		fontFamily: textStyle.domFontFamily,
		lineHeight: `${textStyle.lineHeight}px`,
		textAlign: textStyle.textAlign,
		color: 'transparent',
		WebkitTextFillColor: 'transparent',
		caretColor: 'transparent',
		visibility: 'hidden',
		pointerEvents: 'none',
		overflow: 'hidden',
		wordBreak: 'break-word',
		overflowWrap: 'break-word',
		whiteSpace: 'pre',
	}

	return { boxStyle, mirrorStyle }
}
