import { useEffect, useRef, useState } from 'react'

export const useFPS = () => {
	const [fps, setFps] = useState(0)
	const frameCount = useRef(0)
	const lastTime = useRef(performance.now())
	const animationFrame = useRef<number>()

	useEffect(() => {
		const updateFPS = () => {
			const now = performance.now()
			frameCount.current++

			// Update FPS every second
			if (now - lastTime.current >= 1000) {
				setFps(
					Math.round((frameCount.current * 1000) / (now - lastTime.current)),
				)
				frameCount.current = 0
				lastTime.current = now
			}

			animationFrame.current = requestAnimationFrame(updateFPS)
		}

		animationFrame.current = requestAnimationFrame(updateFPS)

		return () => {
			if (animationFrame.current) {
				cancelAnimationFrame(animationFrame.current)
			}
		}
	}, [])

	return fps
}
