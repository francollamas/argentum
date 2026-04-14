import type { FC, ReactNode } from 'react'
import { useScreenMetrics } from '../../store/viewportStore'

type UIScreenProps = {
	children: ReactNode
	layoutStyle?: Record<string, unknown>
}

export const UIScreen: FC<UIScreenProps> = ({ children, layoutStyle }) => {
	const { screenWidth, screenHeight } = useScreenMetrics()

	return (
		<layoutContainer
			layout={{
				width: screenWidth,
				height: screenHeight,
				...layoutStyle,
			}}
		>
			{children}
		</layoutContainer>
	)
}
