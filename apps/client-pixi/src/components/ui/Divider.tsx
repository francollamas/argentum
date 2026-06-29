import type { LayoutOptions } from '@pixi/layout'
import type { FC } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

type DividerDirection = 'horizontal' | 'vertical'

type DividerProps = {
	direction?: DividerDirection
	thickness?: number
	layout?: Record<string, unknown>
}

export const Divider: FC<DividerProps> = ({
	direction = 'horizontal',
	thickness = 2,
	layout,
}) => {
	const texture = useUITexture(
		direction === 'vertical' ? 'divider-vertical' : 'divider-horizontal',
	)

	const dividerLayout =
		direction === 'vertical'
			? {
					width: thickness,
					height: '100%',
					alignSelf: 'stretch',
					flexShrink: 0,
					...layout,
				}
			: {
					width: '100%',
					height: thickness,
					alignSelf: 'stretch',
					flexShrink: 0,
					...layout,
				}

	return (
		<pixiSprite
			texture={texture}
			layout={dividerLayout as unknown as Omit<LayoutOptions, 'target'>}
			roundPixels
		/>
	)
}
