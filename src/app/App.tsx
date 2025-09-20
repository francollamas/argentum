import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { FPSCounter } from '../components/common/FPSCounter'
import { MapNavigator } from '../components/game/MapNavigator'
import { useResources } from '../hooks/useResources'

extend({ Container })

const App: FC = () => {
	const resourcesLoaded = useResources()

	if (!resourcesLoaded) {
		return null
	}

	return (
		<pixiContainer>
			<MapNavigator mapNumber={60} />
			<FPSCounter />
		</pixiContainer>
	)
}

export default App
