import { useCallback, useEffect, useMemo } from 'react'
import { useAppSelector } from '../store/hooks'
import type { InputAction } from '../types/input'

export const useInput = (
	handlers: Partial<Record<InputAction, () => void>>,
) => {
	const keybinds = useAppSelector((state) => state.input.keybinds)

	const keyToActionMap = useMemo(() => {
		const map = new Map<string, InputAction>()
		for (const [action, keys] of Object.entries(keybinds)) {
			for (const key of keys) {
				map.set(key, action as InputAction)
			}
		}
		return map
	}, [keybinds])

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const action = keyToActionMap.get(event.key)
			if (action && handlers[action]) {
				event.preventDefault()
				handlers[action]?.()
			}
		},
		[keyToActionMap, handlers],
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [handleKeyDown])

	return { keybinds }
}

export const useInputAction = (action: InputAction): string[] => {
	return useAppSelector((state) => state.input.keybinds[action])
}
