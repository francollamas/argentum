import { createContext, useContext } from 'react'
import type {
	ActiveEditorSelection,
	ActiveEditorSnapshot,
	TextEditorActivationOptions,
	TextEditorRegistration,
	TextEditorSelectionRequest,
} from './types'

export type TextEditorContextValue = {
	activeEditorId: string | null
	activeSnapshot: ActiveEditorSnapshot | null
	selectionRequest: TextEditorSelectionRequest | null
	registerEditor: (registration: TextEditorRegistration) => void
	unregisterEditor: (id: string) => void
	activateEditor: (id: string, options?: TextEditorActivationOptions) => void
	blurEditor: (id?: string) => void
	setSelection: (id: string, selection: ActiveEditorSelection) => void
	refreshActiveEditor: (id: string) => void
	getRegistration: (id: string | null) => TextEditorRegistration | null
	handleDomFocus: (id: string) => void
	handleDomBlur: (id: string) => void
	syncFromDom: (id: string, partial: Partial<ActiveEditorSnapshot>) => void
	activateNextEditor: (currentId: string) => void
	activatePreviousEditor: (currentId: string) => void
}

export const TextEditorContext = createContext<TextEditorContextValue | null>(
	null,
)

export function useTextEditorContext() {
	const context = useContext(TextEditorContext)

	if (!context) {
		throw new Error('Text editor context is not available')
	}

	return context
}
