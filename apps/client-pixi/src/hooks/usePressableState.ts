import type { EventMode } from 'pixi.js'
import { useEffect, useState } from 'react'
import { useScrollGestureContext } from '../components/ui/ScrollGestureContext'

type UsePressableStateOptions = {
	disabled?: boolean
	onPress?: () => void
	onPressStart?: () => void
	onPressEnd?: () => void
}

export const usePressableState = ({
	disabled = false,
	onPress,
	onPressStart,
	onPressEnd,
}: UsePressableStateOptions) => {
	const { shouldCancelTap } = useScrollGestureContext()
	const [isHovered, setIsHovered] = useState(false)
	const [isPressed, setIsPressed] = useState(false)
	const eventMode: EventMode = disabled ? 'none' : 'static'

	useEffect(() => {
		if (disabled) {
			setIsHovered(false)
			setIsPressed(false)
		}
	}, [disabled])

	return {
		isHovered,
		isPressed,
		eventMode,
		cursor: disabled ? 'default' : 'pointer',
		onPointerOver: () => setIsHovered(true),
		onPointerOut: () => {
			setIsHovered(false)
			setIsPressed(false)
			onPressEnd?.()
		},
		onPointerDown: () => {
			setIsPressed(true)
			onPressStart?.()
		},
		onPointerUp: () => {
			setIsPressed(false)
			onPressEnd?.()
		},
		onPointerTap: () => {
			if (!shouldCancelTap()) {
				onPress?.()
			}
		},
		onPointerUpOutside: () => {
			setIsPressed(false)
			onPressEnd?.()
		},
	}
}
