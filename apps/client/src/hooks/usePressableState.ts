import { useEffect, useState } from 'react'

type UsePressableStateOptions = {
	disabled?: boolean
	onPress?: () => void
}

export const usePressableState = ({
	disabled = false,
	onPress,
}: UsePressableStateOptions) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isPressed, setIsPressed] = useState(false)

	useEffect(() => {
		if (disabled) {
			setIsHovered(false)
			setIsPressed(false)
		}
	}, [disabled])

	return {
		isHovered,
		isPressed,
		eventMode: disabled ? 'none' : 'static',
		cursor: disabled ? 'default' : 'pointer',
		onPointerOver: () => setIsHovered(true),
		onPointerOut: () => {
			setIsHovered(false)
			setIsPressed(false)
		},
		onPointerDown: () => setIsPressed(true),
		onPointerUp: () => {
			setIsPressed(false)
			if (isHovered) {
				onPress?.()
			}
		},
		onPointerUpOutside: () => setIsPressed(false),
	}
}
