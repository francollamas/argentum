import type { AnimatedSprite, Texture } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { GAME_CONSTANTS } from '../../constants/game'
import { useSprite } from '../../hooks/useSprite'

type CustomSpriteProps = {
	id: string
	centered?: boolean
	[key: string]: unknown
}

export const CustomSprite: FC<CustomSpriteProps> = ({
	id,
	centered = false,
	...props
}) => {
	const { textures, speed } = useSprite(id)
	const animatedSpriteRef = useRef<AnimatedSprite | null>(null)

	useEffect(() => {
		if (textures.length > 1 && animatedSpriteRef.current) {
			animatedSpriteRef.current.play()
		}
	}, [textures])

	if (!textures.length) {
		return null
	}

	const getCenteredPosition = (
		originalX: number,
		originalY: number,
		texture: Texture,
	) => {
		if (!centered || !texture) return { x: originalX, y: originalY }

		const spriteWidth = texture.width
		const spriteHeight = texture.height

		let adjustedX = originalX
		let adjustedY = originalY

		if (spriteWidth !== GAME_CONSTANTS.TILE_SIZE) {
			adjustedX = originalX - spriteWidth / 2 + GAME_CONSTANTS.TILE_SIZE / 2
		}

		if (spriteHeight !== GAME_CONSTANTS.TILE_SIZE) {
			adjustedY = originalY - spriteHeight + GAME_CONSTANTS.TILE_SIZE
		}

		return { x: adjustedX, y: adjustedY }
	}

	if (textures.length === 1) {
		const centeredPos = getCenteredPosition(
			Number(props.x) || 0,
			Number(props.y) || 0,
			textures[0],
		)
		return (
			<pixiSprite
				texture={textures[0]}
				{...props}
				x={centeredPos.x}
				y={centeredPos.y}
			/>
		)
	}

	const centeredPos = getCenteredPosition(
		Number(props.x) || 0,
		Number(props.y) || 0,
		textures[0],
	)
	return (
		<pixiAnimatedSprite
			textures={textures}
			animationSpeed={speed}
			ref={animatedSpriteRef}
			{...props}
			x={centeredPos.x}
			y={centeredPos.y}
		/>
	)
}
