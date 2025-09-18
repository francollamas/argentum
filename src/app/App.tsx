import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
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
			<MapNavigator mapNumber={1} />
		</pixiContainer>
	)
}

export default App
