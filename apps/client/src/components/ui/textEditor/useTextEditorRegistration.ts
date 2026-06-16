import { useCallback, useEffect } from 'react'
import { useTextEditorContext } from './textEditorContext'
import type {
	ActiveEditorSelection,
	TextEditorActivationOptions,
	TextEditorRegistration,
} from './types'

export function useTextEditorRegistration(
	registration: TextEditorRegistration,
) {
	const {
		activeEditorId,
		activateEditor,
		blurEditor,
		refreshActiveEditor,
		registerEditor,
		unregisterEditor,
		setSelection,
	} = useTextEditorContext()

	useEffect(() => {
		registerEditor(registration)
	}, [registerEditor, registration])

	useEffect(
		() => () => {
			unregisterEditor(registration.id)
		},
		[registration.id, unregisterEditor],
	)

	useEffect(() => {
		refreshActiveEditor(registration.id)
	}, [refreshActiveEditor, registration])

	const activate = useCallback(
		(options?: TextEditorActivationOptions) => {
			activateEditor(registration.id, options)
		},
		[activateEditor, registration.id],
	)

	const blur = useCallback(() => {
		blurEditor(registration.id)
	}, [blurEditor, registration.id])

	const updateSelection = useCallback(
		(selection: ActiveEditorSelection) => {
			setSelection(registration.id, selection)
		},
		[registration.id, setSelection],
	)

	return {
		activate,
		blur,
		updateSelection,
		isActive: activeEditorId === registration.id,
	}
}
