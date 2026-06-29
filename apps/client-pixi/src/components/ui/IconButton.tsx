import { tw } from '@pixi/layout/tailwind'
import { Circle, Rectangle, Texture } from 'pixi.js'
import type { FC } from 'react'
import { useMemo } from 'react'
import { usePressableState } from '../../hooks/usePressableState'
import { useSprite } from '../../hooks/useSprite'
import { useUITexture } from '../../hooks/useUITexture'

type IconButtonShape = 'square' | 'circle'
type IconButtonSource = 'ui' | 'game'

type IconButtonProps = {
	icon: string
	iconSource?: IconButtonSource
	shape?: IconButtonShape
	size?: number
	onPress?: () => void
	disabled?: boolean
	layout?: Record<string, unknown>
}

const DEFAULT_SIZE = 64
const ICON_BOX_SCALE_BY_SHAPE: Record<IconButtonShape, number> = {
	square: 0.48,
	circle: 0.42,
}

const fitTextureSize = (
	texture: Texture,
	maxSize: number,
	allowUpscale: boolean,
) => {
	const sourceWidth = texture.width || maxSize
	const sourceHeight = texture.height || maxSize
	const containScale = Math.min(maxSize / sourceWidth, maxSize / sourceHeight)
	const scale = allowUpscale ? containScale : Math.min(containScale, 1)

	return {
		width: Math.max(1, Math.round(sourceWidth * scale)),
		height: Math.max(1, Math.round(sourceHeight * scale)),
	}
}

const getBackgroundTextureName = (shape: IconButtonShape, mode: string) =>
	shape === 'circle' ? `button-circle-${mode}` : `button-${mode}`

export const IconButton: FC<IconButtonProps> = ({
	icon,
	iconSource = 'ui',
	shape = 'square',
	size = DEFAULT_SIZE,
	onPress,
	disabled = false,
	layout,
}) => {
	const { isHovered, isPressed, ...pressableProps } = usePressableState({
		disabled,
		onPress,
	})

	const defaultTexture = useUITexture(getBackgroundTextureName(shape, 'normal'))
	const hoverTexture = useUITexture(getBackgroundTextureName(shape, 'hover'))
	const pressedTexture = useUITexture(
		getBackgroundTextureName(shape, 'pressed'),
	)
	const uiIconTexture = useUITexture(
		iconSource === 'ui' ? icon : 'button-normal',
	)
	const { textures: gameTextures } = useSprite(
		iconSource === 'game' ? icon : '',
	)
	const iconTexture =
		iconSource === 'game' ? (gameTextures[0] ?? Texture.EMPTY) : uiIconTexture
	const iconBoxSize = Math.max(
		1,
		Math.round(size * ICON_BOX_SCALE_BY_SHAPE[shape]),
	)
	const allowUpscale = iconSource === 'ui'
	const iconFrame = useMemo(
		() => fitTextureSize(iconTexture, iconBoxSize, allowUpscale),
		[allowUpscale, iconBoxSize, iconTexture],
	)

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
		>
			<pixiSprite
				texture={currentTexture}
				width={size}
				height={size}
				hitArea={
					shape === 'circle'
						? new Circle(
								currentTexture.width / 2,
								currentTexture.height / 2,
								Math.min(currentTexture.width, currentTexture.height) / 2,
							)
						: new Rectangle(0, 0, currentTexture.width, currentTexture.height)
				}
				layout={{
					position: 'absolute',
					width: size,
					height: size,
					flexShrink: 0,
				}}
				{...pressableProps}
			/>
			<layoutContainer
				eventMode='none'
				layout={{
					...tw`items-center justify-center`,
					width: iconBoxSize,
					height: iconBoxSize,
					minWidth: iconBoxSize,
					minHeight: iconBoxSize,
					flexShrink: 0,
				}}
			>
				<pixiSprite
					texture={iconTexture}
					width={iconFrame.width}
					height={iconFrame.height}
					eventMode='none'
					roundPixels
					layout={{
						width: iconFrame.width,
						height: iconFrame.height,
						flexShrink: 0,
					}}
				/>
			</layoutContainer>
		</layoutContainer>
	)
}
