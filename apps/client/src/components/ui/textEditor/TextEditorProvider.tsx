import type { FC, ReactNode } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { TextEditorContext } from './textEditorContext'
import type {
	ActiveEditorSelection,
	ActiveEditorSnapshot,
	TextEditorActivationOptions,
	TextEditorRegistration,
	TextEditorSelectionRequest,
} from './types'

type TextEditorProviderProps = {
	children?: ReactNode
}

function createSnapshot(
	registration: TextEditorRegistration,
): ActiveEditorSnapshot {
	const config = registration.getConfig()
	const value = registration.getValue()

	return {
		id: registration.id,
		kind: registration.kind,
		value,
		placeholder: config.placeholder,
		disabled: registration.isDisabled(),
		selection: {
			start: value.length,
			end: value.length,
			direction: 'none',
		},
		scroll: {
			left: 0,
			top: 0,
		},
		composing: false,
		focused: false,
		secure: Boolean(config.secure),
		maxLength: config.maxLength,
		align: config.align,
	}
}

export const TextEditorProvider: FC<TextEditorProviderProps> = ({
	children,
}) => {
	const registryRef = useRef(new Map<string, TextEditorRegistration>())
	const activeEditorIdRef = useRef<string | null>(null)
	const selectionTokenRef = useRef(0)
	const [activeEditorId, setActiveEditorId] = useState<string | null>(null)
	const [activeSnapshot, setActiveSnapshot] =
		useState<ActiveEditorSnapshot | null>(null)
	const [selectionRequest, setSelectionRequest] =
		useState<TextEditorSelectionRequest | null>(null)

	const getRegistration = useCallback((id: string | null) => {
		if (!id) {
			return null
		}

		return registryRef.current.get(id) ?? null
	}, [])

	const registerEditor = useCallback((registration: TextEditorRegistration) => {
		registryRef.current.set(registration.id, registration)
	}, [])

	const unregisterEditor = useCallback((id: string) => {
		registryRef.current.delete(id)

		if (activeEditorIdRef.current === id) {
			activeEditorIdRef.current = null
			setActiveEditorId(null)
			setActiveSnapshot(null)
			setSelectionRequest(null)
		}
	}, [])

	const queueSelection = useCallback(
		(id: string, selection: ActiveEditorSelection) => {
			selectionTokenRef.current += 1
			setSelectionRequest({
				id,
				selection,
				token: selectionTokenRef.current,
			})
		},
		[],
	)

	const activateEditor = useCallback(
		(id: string, options?: TextEditorActivationOptions) => {
			const registration = registryRef.current.get(id)

			if (!registration || registration.isDisabled()) {
				return
			}

			const previousId = activeEditorIdRef.current

			if (previousId && previousId !== id) {
				registryRef.current.get(previousId)?.onBlur?.()
			}

			activeEditorIdRef.current = id
			setActiveEditorId(id)
			setActiveSnapshot((previousSnapshot) => {
				const nextSnapshot = createSnapshot(registration)

				if (previousSnapshot?.id === id) {
					nextSnapshot.selection = previousSnapshot.selection
					nextSnapshot.scroll = previousSnapshot.scroll
					nextSnapshot.focused = previousSnapshot.focused
					nextSnapshot.composing = previousSnapshot.composing
				}

				return nextSnapshot
			})

			if (options?.selection) {
				queueSelection(id, options.selection)
			}
		},
		[queueSelection],
	)

	const blurEditor = useCallback((id?: string) => {
		if (id && activeEditorIdRef.current !== id) {
			return
		}

		const currentId = activeEditorIdRef.current
		if (!currentId) {
			return
		}

		registryRef.current.get(currentId)?.onBlur?.()
		activeEditorIdRef.current = null
		setActiveEditorId(null)
		setActiveSnapshot(null)
		setSelectionRequest(null)
	}, [])

	const setSelection = useCallback(
		(id: string, selection: ActiveEditorSelection) => {
			if (activeEditorIdRef.current !== id) {
				return
			}

			setActiveSnapshot((current) => {
				if (!current || current.id !== id) {
					return current
				}

				return {
					...current,
					selection,
				}
			})

			queueSelection(id, selection)
		},
		[queueSelection],
	)

	const refreshActiveEditor = useCallback((id: string) => {
		if (activeEditorIdRef.current !== id) {
			return
		}

		const registration = registryRef.current.get(id)
		if (!registration) {
			return
		}

		setActiveSnapshot((current) => {
			if (!current || current.id !== id) {
				return current
			}

			const config = registration.getConfig()

			return {
				...current,
				value: registration.getValue(),
				placeholder: config.placeholder,
				disabled: registration.isDisabled(),
				secure: Boolean(config.secure),
				maxLength: config.maxLength,
				align: config.align,
			}
		})
	}, [])

	const handleDomFocus = useCallback((id: string) => {
		if (activeEditorIdRef.current !== id) {
			return
		}

		setActiveSnapshot((current) => {
			if (!current || current.id !== id) {
				return current
			}

			return {
				...current,
				focused: true,
			}
		})
	}, [])

	const handleDomBlur = useCallback((id: string) => {
		if (activeEditorIdRef.current !== id) {
			return
		}

		registryRef.current.get(id)?.onBlur?.()
		activeEditorIdRef.current = null
		setActiveEditorId(null)
		setActiveSnapshot(null)
		setSelectionRequest(null)
	}, [])

	const syncFromDom = useCallback(
		(id: string, partial: Partial<ActiveEditorSnapshot>) => {
			if (activeEditorIdRef.current !== id) {
				return
			}

			setActiveSnapshot((current) => {
				if (!current || current.id !== id) {
					return current
				}

				return {
					...current,
					...partial,
					selection: partial.selection ?? current.selection,
					scroll: partial.scroll ?? current.scroll,
				}
			})
		},
		[],
	)

	const getTabOrder = useCallback(() => {
		const entries = Array.from(registryRef.current.values())
		const withIndex = entries.filter((r) => r.tabIndex != null)
		const withoutIndex = entries.filter((r) => r.tabIndex == null)

		withIndex.sort((a, b) => (a.tabIndex ?? 0) - (b.tabIndex ?? 0))

		return [...withIndex, ...withoutIndex].map((r) => r.id)
	}, [])

	const activateNextEditor = useCallback(
		(currentId: string) => {
			const order = getTabOrder()
			const index = order.indexOf(currentId)
			if (index === -1) return
			const nextIndex = index + 1
			if (nextIndex < order.length) {
				activateEditor(order[nextIndex]!)
			}
		},
		[getTabOrder, activateEditor],
	)

	const activatePreviousEditor = useCallback(
		(currentId: string) => {
			const order = getTabOrder()
			const index = order.indexOf(currentId)
			if (index === -1) return
			const prevIndex = index - 1
			if (prevIndex >= 0) {
				activateEditor(order[prevIndex]!)
			}
		},
		[getTabOrder, activateEditor],
	)

	const value = useMemo(
		() => ({
			activeEditorId,
			activeSnapshot,
			selectionRequest,
			registerEditor,
			unregisterEditor,
			activateEditor,
			blurEditor,
			setSelection,
			refreshActiveEditor,
			getRegistration,
			handleDomFocus,
			handleDomBlur,
			syncFromDom,
			activateNextEditor,
			activatePreviousEditor,
		}),
		[
			activeEditorId,
			activeSnapshot,
			selectionRequest,
			registerEditor,
			unregisterEditor,
			activateEditor,
			blurEditor,
			setSelection,
			refreshActiveEditor,
			getRegistration,
			handleDomFocus,
			handleDomBlur,
			syncFromDom,
			activateNextEditor,
			activatePreviousEditor,
		],
	)

	return (
		<TextEditorContext.Provider value={value}>
			{children}
		</TextEditorContext.Provider>
	)
}
