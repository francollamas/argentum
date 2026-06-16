import { useMemo } from 'react'
import { useTextEditorContext } from './textEditorContext'

export function useActiveTextEditor(id: string) {
	const { activeEditorId, activeSnapshot } = useTextEditorContext()

	return useMemo(() => {
		if (activeEditorId !== id) {
			return null
		}

		return activeSnapshot
	}, [activeEditorId, activeSnapshot, id])
}
