import { useSprite } from '../hooks/useSprite.ts'
import { extend } from '@pixi/react'
import { Sprite, AnimatedSprite, TextStyle } from 'pixi.js'
import { useEffect, useRef, useState } from 'react'

extend({ Sprite, AnimatedSprite })

const styly = new TextStyle({
	fontFamily: 'Arial',
	fontSize: 36,
	fill: '#ffffff',
	stroke: '#000000',
	align: 'center',
})

export const CustomSprite = ({ id }) => {
	const { textures, speed } = useSprite(id)
	const animatedSpriteRef = useRef(null)

	useEffect(() => {
		if (textures.length > 1 && animatedSpriteRef.current) {
			animatedSpriteRef.current.play()
		}
	}, [animatedSpriteRef.current, textures])

	if (!textures.length) {
		return <></>
	}

	if (textures.length === 1) {
		return <sprite texture={textures[0]} eventMode='static' />
	}

	console.log(textures.length)

	return (
		<pixiAnimatedSprite
			textures={textures}
			eventMode='static'
			animationSpeed={speed}
			ref={animatedSpriteRef}
			onFrameChange={(currentFrame) => {
				console.log(currentFrame)
			}}
		/>
	)
}
