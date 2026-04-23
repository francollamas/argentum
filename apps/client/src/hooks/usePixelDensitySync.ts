import { useApplication } from '@pixi/react'
import { useEffect } from 'react'

export const usePixelDensitySync = () => {
	const { app } = useApplication()

	useEffect(() => {
		if (!app) return

		const updateResolution = () => {
			if (!app.renderer) return
			app.renderer.resolution = window.devicePixelRatio
		}

		updateResolution()
		window.addEventListener('resize', updateResolution)

		return () => {
			window.removeEventListener('resize', updateResolution)
		}
	}, [app])
}
