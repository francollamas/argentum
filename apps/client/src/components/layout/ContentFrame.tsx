import type { FC, ReactNode } from 'react'
import { useContentFrameMetrics } from '../../store/viewportStore'

type ContentFrameProps = {
	children: ReactNode
	layoutStyle?: Record<string, unknown>
}

export const ContentFrame: FC<ContentFrameProps> = ({
	children,
	layoutStyle,
}) => {
	const {
		contentFrameDesignHeight,
		contentFrameDesignWidth,
		contentFrameScale,
		contentFrameX,
		contentFrameY,
	} = useContentFrameMetrics()

	return (
		<pixiContainer
			x={contentFrameX}
			y={contentFrameY}
			scale={contentFrameScale}
		>
			<layoutContainer
				layout={{
					width: contentFrameDesignWidth,
					height: contentFrameDesignHeight,
					...layoutStyle,
				}}
			>
				{children}
			</layoutContainer>
		</pixiContainer>
	)
}
