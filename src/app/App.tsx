import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { MapNavigator } from '../components/game/MapNavigator'
import { useResources } from '../hooks/useResources.ts'

extend({ Container })

const App: FC = () => {
	const resourcesLoaded = useResources()

	if (!resourcesLoaded) {
		return null
	}

	return (
		<pixiContainer x={0} y={0}>
			<MapNavigator mapNumber={1} viewportWidth={800} viewportHeight={600} />
		</pixiContainer>
	)
}

export default App
