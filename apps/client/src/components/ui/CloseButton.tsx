import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { usePressableState } from '../../hooks/usePressableState'
import { useUITexture } from '../../hooks/useUITexture'

type CloseButtonProps = {
	size?: number
	onPress?: () => void
	disabled?: boolean
	layout?: Record<string, unknown>
}

const DEFAULT_SIZE = 48

export const CloseButton: FC<CloseButtonProps> = ({
	size = DEFAULT_SIZE,
	onPress,
	disabled = false,
	layout,
}) => {
	const { isHovered, isPressed, ...pressableProps } = usePressableState({
		disabled,
		onPress,
	})

	const defaultTexture = useUITexture('window-close-normal')
	const hoverTexture = useUITexture('window-close-hover')
	const pressedTexture = useUITexture('window-close-pressed')

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
				position: 'relative',
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
