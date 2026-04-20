import { tw } from '@pixi/layout/tailwind'
import type { FC, ReactNode } from 'react'
import { useUITexture } from '../../hooks/useUITexture'

type PanelProps = {
	children?: ReactNode
	width?: number | string
	height?: number | string
	padding?: number
	gap?: number
	flexDirection?: 'column' | 'row'
	alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
	justifyContent?:
		| 'flex-start'
		| 'center'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
	layoutStyle?: Record<string, unknown>
	sliceSize?: number
}

export const Panel: FC<PanelProps> = ({
	children,
	width,
	height,
	padding = 16,
	gap = 8,
	flexDirection = 'column',
	alignItems = 'flex-start',
	justifyContent = 'flex-start',
	layoutStyle,
	sliceSize = 42,
}) => {
	const panelTexture = useUITexture('panel')
	const minimumPanelSize = sliceSize * 2 + 1

	return (
		<layoutContainer
			layout={{
				...(width != null ? { width } : {}),
				...(height != null ? { height } : {}),
				...layoutStyle,
				minWidth: minimumPanelSize,
				minHeight: minimumPanelSize,
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
					...(width != null ? { width: '100%' } : {}),
					...(height != null ? { height: '100%' } : {}),
					paddingTop: padding,
					paddingRight: padding,
					paddingBottom: padding,
					paddingLeft: padding,
					gap,
					flexDirection,
					alignItems,
					justifyContent,
				}}
			>
				{children}
			</layoutContainer>
		</layoutContainer>
	)
}
