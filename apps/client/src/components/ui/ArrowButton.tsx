import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useState } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

type ArrowDirection = 'up' | 'down' | 'left' | 'right'

type ArrowButtonProps = {
	direction: ArrowDirection
	size?: number
	onPress?: () => void
	disabled?: boolean
	layout?: Record<string, unknown>
}

const DEFAULT_SIZE = 36

export const ArrowButton: FC<ArrowButtonProps> = ({
	direction,
	size = DEFAULT_SIZE,
	onPress,
	disabled = false,
	layout,
}) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isPressed, setIsPressed] = useState(false)

	const defaultTexture = useUITexture(`arrow-${direction}`)
	const hoverTexture = useUITexture(`arrow-${direction}-hover`)
	const pressedTexture = useUITexture(`arrow-${direction}-pressed`)

	const currentTexture = isPressed
		? pressedTexture
		: isHovered
			? hoverTexture
			: defaultTexture

	return (
		<layoutContainer
			layout={{
				...tw`items-center justify-center`,
				width: size,
				height: size,
				minWidth: size,
				minHeight: size,
				flexShrink: 0,
				...layout,
			}}
			eventMode={disabled ? 'none' : 'static'}
			cursor={disabled ? 'default' : 'pointer'}
			alpha={disabled ? 0.5 : 1}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => {
				setIsHovered(false)
				setIsPressed(false)
			}}
			onPointerDown={() => setIsPressed(true)}
			onPointerUp={() => {
				setIsPressed(false)
				if (isHovered) {
					onPress?.()
				}
			}}
			onPointerUpOutside={() => setIsPressed(false)}
		>
			<pixiSprite
				texture={currentTexture}
				width={size}
				height={size}
				layout={{
					width: size,
					height: size,
					flexShrink: 0,
				}}
			/>
		</layoutContainer>
	)
}
