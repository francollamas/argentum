import { useApplication } from '@pixi/react'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { useViewportStore } from '../../store/viewportStore'

type ScreenRootProps = {
	children: ReactNode
}

export const ScreenRoot: FC<ScreenRootProps> = ({ children }) => {
	const { app } = useApplication()
	const screenWidth = useViewportStore((state) => state.screenWidth)
	const screenHeight = useViewportStore((state) => state.screenHeight)
	const setScreenSize = useViewportStore((state) => state.setScreenSize)

	useEffect(() => {
		const syncScreenSize = () => {
			setScreenSize(app.screen.width, app.screen.height)
		}

		syncScreenSize()
		app.renderer.on('resize', syncScreenSize)

		return () => {
			app.renderer.off('resize', syncScreenSize)
		}
	}, [app, setScreenSize])

	return (
		<layoutContainer
			layout={{
				width: screenWidth,
				height: screenHeight,
			}}
		>
			{children}
		</layoutContainer>
	)
}
