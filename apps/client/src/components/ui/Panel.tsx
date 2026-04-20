import { tw } from '@pixi/layout/tailwind'
import type { FC, ReactNode } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

const OUTER_LAYOUT_KEYS = new Set([
	'width',
	'height',
	'minWidth',
	'minHeight',
	'maxWidth',
	'maxHeight',
	'flex',
	'flexGrow',
	'flexShrink',
	'flexBasis',
	'alignSelf',
	'margin',
	'marginTop',
	'marginRight',
	'marginBottom',
	'marginLeft',
	'position',
	'top',
	'right',
	'bottom',
	'left',
])

type PanelProps = {
	children?: ReactNode
	layout?: Record<string, unknown>
	sliceSize?: number
}

export const Panel: FC<PanelProps> = ({ children, layout, sliceSize = 42 }) => {
	const panelTexture = useUITexture('panel')
	const minimumPanelSize = sliceSize * 2 + 1
	const outerLayout: Record<string, unknown> = {}
	const innerLayout: Record<string, unknown> = {}

	for (const [key, value] of Object.entries(layout ?? {})) {
		if (OUTER_LAYOUT_KEYS.has(key)) {
			outerLayout[key] = value
			continue
		}

		innerLayout[key] = value
	}

	const minWidth =
		typeof outerLayout.minWidth === 'number'
			? Math.max(outerLayout.minWidth, minimumPanelSize)
			: (outerLayout.minWidth ?? minimumPanelSize)
	const minHeight =
		typeof outerLayout.minHeight === 'number'
			? Math.max(outerLayout.minHeight, minimumPanelSize)
			: (outerLayout.minHeight ?? minimumPanelSize)

	return (
		<layoutContainer
			layout={{
				...outerLayout,
				minWidth,
				minHeight,
			}}
		>
			<pixiNineSliceSprite
				texture={panelTexture}
				leftWidth={sliceSize}
				topHeight={sliceSize}
				rightWidth={sliceSize}
				bottomHeight={sliceSize}
				layout={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					applySizeDirectly: true,
				}}
			/>
			<layoutContainer
				layout={{
					...tw`flex-col`,
					...(outerLayout.width != null ? { width: '100%' } : {}),
					...(outerLayout.height != null ? { height: '100%' } : {}),
					padding: 16,
					gap: 8,
					...innerLayout,
				}}
			>
				{children}
			</layoutContainer>
		</layoutContainer>
	)
}
