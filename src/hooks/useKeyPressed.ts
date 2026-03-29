import { useCallback, useEffect, useRef } from 'react'
import { useInputStore } from '../store/inputStore'
import type { InputAction } from '../types/input'

export const useKeyPressed = () => {
	const keybinds = useInputStore((state) => state.keybinds)
	const pressedKeys = useRef<Set<string>>(new Set())

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		pressedKeys.current.add(event.key)
	}, [])

	const handleKeyUp = useCallback((event: KeyboardEvent) => {
		pressedKeys.current.delete(event.key)
	}, [])

	const isActionPressed = useCallback(
		(action: InputAction): boolean => {
			const keys = keybinds[action]
			return keys.some((key) => pressedKeys.current.has(key))
		},
		[keybinds],
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [handleKeyDown, handleKeyUp])

	return { isActionPressed }
}
