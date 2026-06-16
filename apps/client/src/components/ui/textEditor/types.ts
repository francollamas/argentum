export type ActiveEditorKind = 'input' | 'textarea'

export type ActiveEditorSelectionDirection = 'forward' | 'backward' | 'none'

export type ActiveEditorSelection = {
	start: number
	end: number
	direction?: ActiveEditorSelectionDirection
}

export type ActiveEditorScroll = {
	left: number
	top: number
}

export type TextEditorAlign = 'left' | 'center' | 'right'

export type TextEditorConfig = {
	placeholder: string
	secure?: boolean
	maxLength?: number
	align: TextEditorAlign
}

export type TextEditorRegistration = {
	id: string
	kind: ActiveEditorKind
	getValue: () => string
	setValue: (value: string) => void
	onBlur?: () => void
	onEnter?: (value: string) => void
	isDisabled: () => boolean
	getVisibleRect: () => DOMRect | null
	getConfig: () => TextEditorConfig
	tabIndex?: number
}

export type ActiveEditorSnapshot = {
	id: string
	kind: ActiveEditorKind
	value: string
	placeholder: string
	disabled: boolean
	selection: ActiveEditorSelection
	scroll: ActiveEditorScroll
	composing: boolean
	focused: boolean
	secure: boolean
	maxLength?: number
	align: TextEditorAlign
}

export type TextEditorActivationOptions = {
	selection?: ActiveEditorSelection
}

export type TextEditorSelectionRequest = {
	id: string
	selection: ActiveEditorSelection
	token: number
}
