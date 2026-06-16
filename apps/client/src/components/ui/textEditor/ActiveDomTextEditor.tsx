import { useApplication } from '@pixi/react'
import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useTextEditorContext } from './textEditorContext'
import {
	INPUT_FONT_FAMILY,
	INPUT_FONT_SIZE,
	INPUT_PADDING_X,
	TEXTAREA_FONT_FAMILY,
	TEXTAREA_FONT_SIZE,
	TEXTAREA_LINE_HEIGHT,
	TEXTAREA_PADDING_BOTTOM,
	TEXTAREA_PADDING_LEFT,
	TEXTAREA_PADDING_RIGHT,
	TEXTAREA_PADDING_TOP,
} from './textMeasurement'
import type { ActiveEditorSelection, ActiveEditorSnapshot } from './types'

type EditorElement = HTMLInputElement | HTMLTextAreaElement

function getSelectionFromElement(
	element: EditorElement,
): ActiveEditorSelection {
	return {
		start: element.selectionStart ?? 0,
		end: element.selectionEnd ?? 0,
		direction: (element.selectionDirection ??
			'none') as ActiveEditorSelection['direction'],
	}
}

function getSnapshotFromElement(
	element: EditorElement,
	snapshot: ActiveEditorSnapshot,
) {
	return {
		value: element.value,
		selection: getSelectionFromElement(element),
		scroll: {
			left: element.scrollLeft,
			top: element.scrollTop,
		},
		focused: document.activeElement === element,
		composing: snapshot.composing,
	}
}

export const ActiveDomTextEditor = () => {
	const { app } = useApplication()
	const {
		activeEditorId,
		activeSnapshot,
		selectionRequest,
		getRegistration,
		handleDomBlur,
		handleDomFocus,
		syncFromDom,
		activateNextEditor,
		activatePreviousEditor,
	} = useTextEditorContext()
	const editorRef = useRef<EditorElement | null>(null)
	const [hostElement, setHostElement] = useState<HTMLDivElement | null>(null)
	const [rect, setRect] = useState<DOMRect | null>(null)
	const rootRef = useRef<Root | null>(null)

	const registration = getRegistration(activeEditorId)

	useEffect(() => {
		if (!app?.canvas) {
			return
		}

		const container = app.canvas.parentElement ?? document.body
		const host = document.createElement('div')
		host.style.position = 'fixed'
		host.style.inset = '0'
		host.style.pointerEvents = 'none'
		host.style.zIndex = '9999'
		container.appendChild(host)
		rootRef.current = createRoot(host)
		setHostElement(host)

		return () => {
			rootRef.current?.unmount()
			rootRef.current = null
			host.remove()
			setHostElement(null)
		}
	}, [app])

	useEffect(() => {
		if (!registration) {
			setRect(null)
			return
		}

		let frame = 0

		const updateRect = () => {
			const nextRect = registration.getVisibleRect()
			setRect((currentRect) => {
				if (
					currentRect &&
					nextRect &&
					currentRect.x === nextRect.x &&
					currentRect.y === nextRect.y &&
					currentRect.width === nextRect.width &&
					currentRect.height === nextRect.height
				) {
					return currentRect
				}

				return nextRect
			})
			frame = requestAnimationFrame(updateRect)
		}

		updateRect()

		return () => {
			cancelAnimationFrame(frame)
		}
	}, [registration])

	useLayoutEffect(() => {
		const element = editorRef.current
		if (!element || !activeSnapshot) {
			return
		}

		element.focus()
	}, [activeSnapshot?.id, activeSnapshot])

	useEffect(() => {
		const element = editorRef.current
		if (!element || !activeSnapshot) {
			return
		}

		if (element.value !== activeSnapshot.value) {
			element.value = activeSnapshot.value
		}
	}, [activeSnapshot?.value, activeSnapshot])

	useEffect(() => {
		const element = editorRef.current

		if (
			!element ||
			!selectionRequest ||
			selectionRequest.id !== activeEditorId
		) {
			return
		}

		element.setSelectionRange(
			selectionRequest.selection.start,
			selectionRequest.selection.end,
			selectionRequest.selection.direction,
		)
	}, [activeEditorId, selectionRequest])

	useEffect(() => {
		const element = editorRef.current
		if (!element || !activeSnapshot) {
			return
		}

		element.scrollLeft = activeSnapshot.scroll.left
		element.scrollTop = activeSnapshot.scroll.top
	}, [activeSnapshot?.scroll.left, activeSnapshot?.scroll.top, activeSnapshot])

	const style = useMemo(() => {
		if (!activeSnapshot || !rect) {
			return null
		}

		const commonStyle: CSSProperties = {
			position: 'fixed',
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height,
			margin: 0,
			border: 'none',
			outline: 'none',
			background: 'transparent',
			color: 'transparent',
			caretColor: 'transparent',
			opacity: 0,
			pointerEvents: activeSnapshot.disabled ? 'none' : 'auto',
			boxSizing: 'border-box',
		}

		if (activeSnapshot.kind === 'input') {
			return {
				...commonStyle,
				padding: `0 ${INPUT_PADDING_X}px`,
				fontFamily: INPUT_FONT_FAMILY,
				fontSize: INPUT_FONT_SIZE,
				textAlign: activeSnapshot.align,
			} satisfies CSSProperties
		}

		return {
			...commonStyle,
			paddingTop: TEXTAREA_PADDING_TOP,
			paddingRight: TEXTAREA_PADDING_RIGHT,
			paddingBottom: TEXTAREA_PADDING_BOTTOM,
			paddingLeft: TEXTAREA_PADDING_LEFT,
			fontFamily: TEXTAREA_FONT_FAMILY,
			fontSize: TEXTAREA_FONT_SIZE,
			lineHeight: `${TEXTAREA_LINE_HEIGHT}px`,
			textAlign: activeSnapshot.align,
			resize: 'none',
			overflowX: 'auto',
			overflowY: 'auto',
		} satisfies CSSProperties
	}, [activeSnapshot, rect])

	const editorElement = useMemo(() => {
		if (!hostElement || !registration || !activeSnapshot || !style) {
			return null
		}

		const handleTab = (event: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
			if (event.key === 'Tab') {
				event.preventDefault()
				if (event.shiftKey) {
					activatePreviousEditor(activeSnapshot.id)
				} else {
					activateNextEditor(activeSnapshot.id)
				}
			}
		}

		const sharedProps = {
			ref: (element: EditorElement | null) => {
				editorRef.current = element
			},
			className:
				activeSnapshot.kind === 'input'
					? 'active-dom-text-editor active-dom-input'
					: 'active-dom-text-editor active-dom-textarea',
			autoComplete: 'off',
			spellCheck: false,
			disabled: activeSnapshot.disabled,
			maxLength: activeSnapshot.maxLength,
			defaultValue: activeSnapshot.value,
			placeholder: activeSnapshot.placeholder,
			style,
			onFocus: () => handleDomFocus(activeSnapshot.id),
			onBlur: () => handleDomBlur(activeSnapshot.id),
			onSelect: (event: { currentTarget: EditorElement }) => {
				syncFromDom(
					activeSnapshot.id,
					getSnapshotFromElement(event.currentTarget, activeSnapshot),
				)
			},
			onScroll: (event: { currentTarget: EditorElement }) => {
				syncFromDom(activeSnapshot.id, {
					scroll: {
						left: event.currentTarget.scrollLeft,
						top: event.currentTarget.scrollTop,
					},
				})
			},
			onCompositionStart: () => {
				syncFromDom(activeSnapshot.id, { composing: true })
			},
			onCompositionEnd: (event: { currentTarget: EditorElement }) => {
				registration.setValue(event.currentTarget.value)
				syncFromDom(activeSnapshot.id, {
					...getSnapshotFromElement(event.currentTarget, activeSnapshot),
					composing: false,
				})
			},
			onChange: (event: { currentTarget: EditorElement }) => {
				registration.setValue(event.currentTarget.value)
				syncFromDom(
					activeSnapshot.id,
					getSnapshotFromElement(event.currentTarget, activeSnapshot),
				)
			},
			onKeyUp: (event: { currentTarget: EditorElement }) => {
				syncFromDom(
					activeSnapshot.id,
					getSnapshotFromElement(event.currentTarget, activeSnapshot),
				)
			},
			onMouseUp: (event: { currentTarget: EditorElement }) => {
				syncFromDom(
					activeSnapshot.id,
					getSnapshotFromElement(event.currentTarget, activeSnapshot),
				)
			},
		} as const

		if (activeSnapshot.kind === 'input') {
			return (
				<input
					{...sharedProps}
					type={activeSnapshot.secure ? 'password' : 'text'}
					onKeyDown={(event) => {
						handleTab(event)
						if (event.key === 'Enter') {
							registration.onEnter?.(event.currentTarget.value)
							event.currentTarget.blur()
							return
						}

						if (event.key === 'Escape') {
							event.currentTarget.blur()
						}
					}}
				/>
			)
		}

		return (
			<textarea
				{...sharedProps}
				onKeyDown={(event) => {
					handleTab(event)
				}}
			/>
		)
	}, [
		activeSnapshot,
		activateNextEditor,
		activatePreviousEditor,
		handleDomBlur,
		handleDomFocus,
		hostElement,
		registration,
		syncFromDom,
		style,
	])

	useEffect(() => {
		if (!rootRef.current) {
			return
		}

		rootRef.current.render(editorElement)
	}, [editorElement])

	return null
}
