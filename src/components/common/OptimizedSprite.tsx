import { extend } from '@pixi/react'
import { AnimatedSprite, Sprite } from 'pixi.js'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { useSprite } from '../../hooks/useSprite'

extend({ Sprite, AnimatedSprite })

interface OptimizedSpriteProps {
	id: string
	x: number
	y: number
	centered?: boolean
}

// Componente memoizado para evitar re-renders innecesarios
export const OptimizedSprite: FC<OptimizedSpriteProps> = memo(
	({ id, x, y, centered = false }) => {
		const { textures, speed } = useSprite(id)

		// Calcular propiedades del sprite una sola vez
		const spriteProps = useMemo(() => {
			if (!textures.length) return null

			const baseProps = { x, y }

			// Si es centrado, usar anchor nativo de PixiJS
			if (centered) {
				return {
					...baseProps,
					anchor: { x: 0.5, y: 1 }, // Centrado horizontalmente, anclado abajo
					x: x + 16, // TILE_SIZE / 2
					y: y + 32, // TILE_SIZE
				}
			}

			return baseProps
		}, [x, y, centered, textures.length])

		if (!spriteProps || !textures.length) {
			return null
		}

		// Sprite animado si tiene múltiples texturas
		if (textures.length > 1) {
			return (
				<pixiAnimatedSprite
					textures={textures}
					animationSpeed={speed}
					autoPlay={true}
					{...spriteProps}
				/>
			)
		}

		// Sprite simple
		return <pixiSprite texture={textures[0]} {...spriteProps} />
	},
)

OptimizedSprite.displayName = 'OptimizedSprite'
