import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { EditorKind, EditorSnapshot } from './EditorContext'
import { initialEditorSnapshot } from './EditorContext'

type EditorElement = HTMLInputElement | HTMLTextAreaElement

function readSnapshot(
	el: EditorElement,
	kind: EditorKind,
	composing: boolean,
): EditorSnapshot {
	const isTextarea = kind === 'textarea'
	const start = el.selectionStart ?? 0
	const end = el.selectionEnd ?? 0
	const direction = el.selectionDirection ?? 'none'
	const scrollLeft = el.scrollLeft ?? 0
	const scrollTop = isTextarea
		? ((el as HTMLTextAreaElement).scrollTop ?? 0)
		: 0
	return {
		value: el.value,
		selection: { start, end, direction },
		scroll: { left: scrollLeft, top: scrollTop },
		composing,
		focused: document.activeElement === el,
		caretMoved: null,
	}
}

export function useDomEditorEvents<T extends EditorElement>(
	ref: RefObject<T | null>,
	kind: EditorKind,
): EditorSnapshot {
	const [snapshot, setSnapshot] = useState<EditorSnapshot>(
		initialEditorSnapshot,
	)
	const composingRef = useRef(false)
	const rafRef = useRef<number | null>(null)
	const subscribedRef = useRef<T | null>(null)

	const flush = () => {
		rafRef.current = null
		const el = ref.current
		if (!el) return
		setSnapshot(readSnapshot(el, kind, composingRef.current))
	}

	const scheduleFlush = () => {
		if (rafRef.current != null) return
		rafRef.current = requestAnimationFrame(flush)
	}

	useEffect(() => {
		return () => {
			if (rafRef.current != null) {
				cancelAnimationFrame(rafRef.current)
				rafRef.current = null
			}
		}
	}, [])

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (subscribedRef.current === el) return

		const onChange = () => scheduleFlush()
		const onCompositionStart = () => {
			composingRef.current = true
			scheduleFlush()
		}
		const onCompositionEnd = () => {
			composingRef.current = false
			scheduleFlush()
		}
		const onSelectionChange = () => {
			if (document.activeElement === el) scheduleFlush()
		}

		const events = [
			'input',
			'select',
			'scroll',
			'focus',
			'blur',
			'click',
			'keydown',
		] as const
		for (const event of events) {
			el.addEventListener(event, onChange)
		}
		el.addEventListener('compositionstart', onCompositionStart)
		el.addEventListener('compositionend', onCompositionEnd)
		document.addEventListener('selectionchange', onSelectionChange)

		subscribedRef.current = el

		return () => {
			for (const event of events) {
				el.removeEventListener(event, onChange)
			}
			el.removeEventListener('compositionstart', onCompositionStart)
			el.removeEventListener('compositionend', onCompositionEnd)
			document.removeEventListener('selectionchange', onSelectionChange)
			if (subscribedRef.current === el) {
				subscribedRef.current = null
			}
		}
	})

	return snapshot
}
