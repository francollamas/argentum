import { useApplication } from '@pixi/react'
import { useEffect } from 'react'

export const usePixelDensitySync = () => {
	const { app } = useApplication()

	useEffect(() => {
		if (!app || !window.visualViewport) return

		const updateResolution = () => {
			app.renderer.resolution = window.devicePixelRatio
			app.renderer.resize(window.innerWidth, window.innerHeight)
		}

		window.visualViewport.addEventListener('resize', updateResolution)

		return () => {
			window.visualViewport?.removeEventListener('resize', updateResolution)
		}
	}, [app])
}
