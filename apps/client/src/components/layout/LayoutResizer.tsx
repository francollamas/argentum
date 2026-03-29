import { useApplication } from '@pixi/react'
import type { Container } from 'pixi.js'
import type { FC, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

interface LayoutResizerProps {
	children: ReactNode
}

export const LayoutResizer: FC<LayoutResizerProps> = ({ children }) => {
	const layoutRef = useRef<Container>(null)
	const { app } = useApplication()

	useEffect(() => {
		const updateLayout = () => {
			if (layoutRef.current) {
				layoutRef.current.layout = {
					width: app.screen.width,
					height: app.screen.height,
				}
			}
		}

		updateLayout()

		app.renderer.on('resize', updateLayout)

		return () => {
			app.renderer.off('resize', updateLayout)
		}
	}, [app])

	return (
		<pixiContainer ref={layoutRef} layout={{}}>
			{children}
		</pixiContainer>
	)
}
