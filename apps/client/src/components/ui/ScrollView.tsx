import type { LayoutOptions } from '@pixi/layout'
import { tw } from '@pixi/layout/tailwind'
import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

type ScrollViewProps = {
	width?: number
	height?: number
	children?: ReactNode
	layout?: Record<string, unknown>
	contentLayout?: Record<string, unknown>
	maxSpeed?: number
}

const DEFAULT_MAX_SPEED = 400

export const ScrollView: FC<ScrollViewProps> = ({
	width,
	height,
	children,
	layout,
	contentLayout,
	maxSpeed = DEFAULT_MAX_SPEED,
}) => {
	const viewportLayout = {
		...(width != null ? { width } : { width: '100%' }),
		...(height != null ? { height, minHeight: height } : {}),
		...tw`flex-col`,
		alignSelf: 'stretch',
		minWidth: 0,
		minHeight: 0,
		overflow: 'scroll' as const,
		...layout,
	} as unknown as Omit<LayoutOptions, 'target'>

	const trackpadOptions = useMemo(
		() => ({
			maxSpeed,
			constrain: true,
			xConstrainPercent: -1,
			yConstrainPercent: 0,
		}),
		[maxSpeed],
	)

	const innerContentLayout = {
		...tw`w-full flex-col`,
		alignSelf: 'stretch',
		minWidth: 0,
		flexShrink: 0,
		...contentLayout,
	} as unknown as Omit<LayoutOptions, 'target'>

	return (
		<layoutContainer
			key={JSON.stringify(trackpadOptions)}
			eventMode='static'
			layout={viewportLayout}
			trackpad={trackpadOptions}
		>
			<layoutContainer layout={innerContentLayout}>{children}</layoutContainer>
		</layoutContainer>
	)
}
