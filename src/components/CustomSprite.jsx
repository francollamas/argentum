import { useSprite } from '../hooks/useSprite.ts'
import { extend } from '@pixi/react'
import { Sprite, AnimatedSprite, TextStyle } from 'pixi.js'
import { useEffect, useRef, useState } from 'react'

extend({ Sprite, AnimatedSprite })

const styly = new TextStyle({
	fontFamily: 'Arial',
	fontSize: 36,
	fill: '#ffffff', // Color del texto
	stroke: '#000000', // Color del borde
	align: 'center', // Alineación
})

export const CustomSprite = () => {
	const [num, setNum] = useState('145')
	const { textures } = useSprite(num)
	const animatedSpriteRef = useRef(null)
	const [refValue, setRefValue] = useState(null)

	useEffect(() => {
		if (animatedSpriteRef.current !== refValue) {
			setRefValue(animatedSpriteRef.current)
		}
	}, [refValue, animatedSpriteRef.current])

	useEffect(() => {
		if (refValue) {
			animatedSpriteRef.current.play()
		}
	}, [refValue])

	if (!textures.length) {
		return <></>
	}

	if (textures.length === 1) {
		return <sprite texture={textures[0]} eventMode='static' />
	}

	return (
		<pixiAnimatedSprite
			textures={textures}
			eventMode='static'
			animationSpeed={1}
			ref={animatedSpriteRef}
		/>
	)
}
