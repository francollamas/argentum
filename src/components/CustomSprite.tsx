import { extend } from '@pixi/react'
import { AnimatedSprite, Sprite } from 'pixi.js'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { useSprite } from '../hooks/useSprite.ts'

extend({ Sprite, AnimatedSprite })

interface CustomSpriteProps {
	id: string
	[key: string]: any
}

export const CustomSprite: FC<CustomSpriteProps> = ({ id, ...props }) => {
	const { textures, speed } = useSprite(id)
	const animatedSpriteRef = useRef<AnimatedSprite | null>(null)

	useEffect(() => {
		if (textures.length > 1 && animatedSpriteRef.current) {
			animatedSpriteRef.current.play()
		}
	}, [textures])

	if (!textures.length) {
		return <></>
	}

	if (textures.length === 1) {
		return <pixiSprite texture={textures[0]} {...props} />
	}

	return (
		<pixiAnimatedSprite
			textures={textures}
			animationSpeed={speed}
			ref={animatedSpriteRef}
			{...props}
		/>
	)
}
