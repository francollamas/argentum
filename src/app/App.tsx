import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { useEffect } from 'react'
import { FPSCounter } from '../components/common/FPSCounter'
import { MapNavigator } from '../components/game/MapNavigator'
import { useResources } from '../hooks/useResources'
import { useAppDispatch } from '../store/hooks'
import { setPlayerPosition } from '../store/slices/playerSlice'

extend({ Container })

const App: FC = () => {
	const resourcesLoaded = useResources()
	const dispatch = useAppDispatch()

	// Initialize player position in Redux
	useEffect(() => {
		dispatch(setPlayerPosition({ tileX: 50, tileY: 50 }))
	}, [dispatch])

	if (!resourcesLoaded) {
		return null
	}

	return (
		<pixiContainer>
			<MapNavigator mapNumber={1} />
			<FPSCounter />
		</pixiContainer>
	)
}

export default App
