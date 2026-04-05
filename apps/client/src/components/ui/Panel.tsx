import { extend } from '@pixi/react'
import { NineSliceSprite } from 'pixi.js'
import type { FC, ReactNode } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

extend({ NineSliceSprite })

type PanelProps = {
	children?: ReactNode
	x?: number
	y?: number
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
	const panelTexture = useUITexture('panel')

	return (
		<pixiContainer x={x} y={y} layout={{ width, height }}>
			<pixiNineSliceSprite
				texture={panelTexture}
				leftWidth={sliceSize}
				topHeight={sliceSize}
				rightWidth={sliceSize}
				bottomHeight={sliceSize}
				width={width}
				height={height}
			/>
			{children}
		</pixiContainer>
	)
}
