export type EditorKind = 'input' | 'textarea'

export type EditorSelectionDirection = 'forward' | 'backward' | 'none'

export type EditorSelection = {
	start: number
	end: number
	direction: EditorSelectionDirection
}

export type EditorScroll = {
	left: number
	top: number
}

export type CaretMovement = 'left' | 'right' | 'up' | 'down' | null

export type EditorSnapshot = {
	value: string
	selection: EditorSelection
	scroll: EditorScroll
	composing: boolean
	focused: boolean
	caretMoved: CaretMovement
}

export const initialEditorSnapshot: EditorSnapshot = {
	value: '',
	selection: { start: 0, end: 0, direction: 'none' },
	scroll: { left: 0, top: 0 },
	composing: false,
	focused: false,
	caretMoved: null,
}

export type TextAlign = 'left' | 'center' | 'right'

export type EditorTextStyle = {
	fontFamily: string
	domFontFamily: string
	fontSize: number
	lineHeight: number
	paddingTop: number
	paddingRight: number
	paddingBottom: number
	paddingLeft: number
	textAlign: TextAlign
	textColor: number
	placeholderColor: number
	selectionColor: number
	selectionAlpha: number
	caretColor: number
	caretWidth: number
	disabled: boolean
}

export type EditorBoxMetrics = {
	x: number
	y: number
	width: number
	height: number
}

export type EditorPositionContext = {
	bounds: EditorBoxMetrics
	canvasRect: DOMRect
	containerRect: DOMRect
	zIndex: number
	disabled: boolean
}
