import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { usePressableState } from '../../hooks/usePressableState'
import { useUITexture } from '../../hooks/useUITexture'

type ArrowDirection = 'up' | 'down' | 'left' | 'right'

type ArrowButtonProps = {
	direction: ArrowDirection
	size?: number
	onPress?: () => void
	onPressStart?: () => void
	onPressEnd?: () => void
	disabled?: boolean
	layout?: Record<string, unknown>
}

const DEFAULT_SIZE = 36

export const ArrowButton: FC<ArrowButtonProps> = ({
	direction,
	size = DEFAULT_SIZE,
	onPress,
	onPressStart,
	onPressEnd,
	disabled = false,
	layout,
}) => {
	const { isHovered, isPressed, ...pressableProps } = usePressableState({
		disabled,
		onPress,
		onPressStart,
		onPressEnd,
	})

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
			alpha={disabled ? 0.5 : 1}
			{...pressableProps}
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
