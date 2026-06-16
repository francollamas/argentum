import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { EditorKind, EditorTextStyle } from './EditorContext'

export type EditorMirrorHandle = {
	element: HTMLDivElement
	setValue: (value: string) => void
	applyStyle: (style: CSSProperties) => void
}

export function createEditorMirror(
	mirrorStyle: CSSProperties,
	kind: EditorKind,
): EditorMirrorHandle {
	const mirror = document.createElement('div')
	mirror.className = 'dom-editor-mirror'
	mirror.setAttribute('aria-hidden', 'true')
	mirror.setAttribute('tabindex', '-1')

	const style = mirror.style
	style.position = mirrorStyle.position ?? 'absolute'
	style.top =
		typeof mirrorStyle.top === 'number'
			? `${mirrorStyle.top}px`
			: ((mirrorStyle.top as string) ?? '-9999px')
	style.left =
		typeof mirrorStyle.left === 'number'
			? `${mirrorStyle.left}px`
			: ((mirrorStyle.left as string) ?? '-9999px')
	style.width =
		typeof mirrorStyle.width === 'number'
			? `${mirrorStyle.width}px`
			: ((mirrorStyle.width as string) ?? '0')
	style.height =
		typeof mirrorStyle.height === 'number'
			? `${mirrorStyle.height}px`
			: ((mirrorStyle.height as string) ?? '0')
	style.paddingTop = `${mirrorStyle.paddingTop ?? 0}px`
	style.paddingRight = `${mirrorStyle.paddingRight ?? 0}px`
	style.paddingBottom = `${mirrorStyle.paddingBottom ?? 0}px`
	style.paddingLeft = `${mirrorStyle.paddingLeft ?? 0}px`
	style.margin = '0'
	style.boxSizing = 'border-box'
	style.border = 'none'
	style.fontSize = `${mirrorStyle.fontSize ?? 16}px`
	style.fontFamily = (mirrorStyle.fontFamily as string) ?? 'sans-serif'
	style.lineHeight = (mirrorStyle.lineHeight as string) ?? 'normal'
	style.textAlign = (mirrorStyle.textAlign as string) ?? 'left'
	style.color = 'transparent'
	style.caretColor = 'transparent'
	style.webkitTextFillColor = 'transparent'
	style.visibility = 'hidden'
	style.pointerEvents = 'none'
	style.overflow = 'hidden'
	style.wordBreak = 'break-word'
	style.overflowWrap = 'break-word'
	style.whiteSpace = kind === 'textarea' ? 'pre-wrap' : 'pre'

	document.body.appendChild(mirror)

	return {
		element: mirror,
		setValue: (value: string) => {
			if (mirror.textContent !== value) {
				mirror.textContent = value
			}
		},
		applyStyle: (next: CSSProperties) => {
			if (next.width != null) {
				style.width =
					typeof next.width === 'number'
						? `${next.width}px`
						: (next.width as string)
			}
			if (next.height != null) {
				style.height =
					typeof next.height === 'number'
						? `${next.height}px`
						: (next.height as string)
			}
			if (next.paddingTop != null) style.paddingTop = `${next.paddingTop}px`
			if (next.paddingRight != null)
				style.paddingRight = `${next.paddingRight}px`
			if (next.paddingBottom != null)
				style.paddingBottom = `${next.paddingBottom}px`
			if (next.paddingLeft != null) style.paddingLeft = `${next.paddingLeft}px`
			if (next.fontSize != null) style.fontSize = `${next.fontSize}px`
			if (next.lineHeight != null) style.lineHeight = next.lineHeight as string
			if (next.textAlign != null) style.textAlign = next.textAlign as string
		},
	}
}

export function useEditorMirror(
	mirrorStyle: CSSProperties | null,
	kind: EditorKind,
): EditorMirrorHandle | null {
	const [handle, setHandle] = useState<EditorMirrorHandle | null>(null)
	const lastStyleRef = useRef<CSSProperties | null>(null)

	useEffect(() => {
		if (!mirrorStyle) {
			setHandle(null)
			return
		}
		const mirror = createEditorMirror(mirrorStyle, kind)
		setHandle(mirror)
		lastStyleRef.current = mirrorStyle
		return () => {
			mirror.element.remove()
			setHandle(null)
			lastStyleRef.current = null
		}
	}, [kind, mirrorStyle])

	useEffect(() => {
		if (!handle || !mirrorStyle) return
		const last = lastStyleRef.current
		if (
			last &&
			last.width === mirrorStyle.width &&
			last.height === mirrorStyle.height &&
			last.paddingTop === mirrorStyle.paddingTop &&
			last.paddingRight === mirrorStyle.paddingRight &&
			last.paddingBottom === mirrorStyle.paddingBottom &&
			last.paddingLeft === mirrorStyle.paddingLeft &&
			last.fontSize === mirrorStyle.fontSize &&
			last.lineHeight === mirrorStyle.lineHeight &&
			last.textAlign === mirrorStyle.textAlign
		) {
			return
		}
		handle.applyStyle(mirrorStyle)
		lastStyleRef.current = mirrorStyle
	}, [handle, mirrorStyle])

	return handle
}

export function buildMirrorStyleFromTextStyle(
	_kind: EditorKind,
	textStyle: EditorTextStyle,
	box: { width: number; height: number },
): CSSProperties {
	return {
		position: 'absolute',
		top: -9999,
		left: -9999,
		width: box.width,
		height: box.height,
		paddingTop: textStyle.paddingTop,
		paddingRight: textStyle.paddingRight,
		paddingBottom: textStyle.paddingBottom,
		paddingLeft: textStyle.paddingLeft,
		fontSize: textStyle.fontSize,
		fontFamily: textStyle.domFontFamily,
		lineHeight: `${textStyle.lineHeight}px`,
		textAlign: textStyle.textAlign,
	}
}
