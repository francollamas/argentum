import { extend } from '@pixi/react'
import { Container, NineSliceSprite } from 'pixi.js'
import type { FC, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Container })

type PanelProps = {
	children?: ReactNode
	x: number
	y: number
	width: number
	height: number
	sliceSize?: number
}

export const Panel: FC<PanelProps> = ({
	children,
	x,
	y,
	width,
	height,
	sliceSize = 12,
}) => {
	const containerRef = useRef<Container | null>(null)
	const contentRef = useRef<Container | null>(null)
	const panelTexture = useUITexture('panel')

	useEffect(() => {
		if (!containerRef.current || !contentRef.current) return

		const panelBackground = new NineSliceSprite({
			texture: panelTexture,
			leftWidth: sliceSize,
			topHeight: sliceSize,
			rightWidth: sliceSize,
			bottomHeight: sliceSize,
			width,
			height,
		})

		containerRef.current.addChildAt(panelBackground, 0)

		return () => {
			panelBackground.destroy()
		}
	}, [panelTexture, width, height, sliceSize])

	return (
		<pixiContainer ref={containerRef} x={x} y={y} eventMode='static'>
			<pixiContainer ref={contentRef}>{children}</pixiContainer>
		</pixiContainer>
	)
}
