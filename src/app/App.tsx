import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { FPSCounter } from '../components/common/FPSCounter'
import { MapNavigator } from '../components/game/MapNavigator'
import { useResources } from '../hooks/useResources'
import { Text } from '../components/common/Text'
import { useApplication } from '@pixi/react'

extend({ Container })

const App: FC = () => {
	const app = useApplication()
	const resourcesLoaded = useResources()

	if (!resourcesLoaded) {
		return null
	}

	return (
		<pixiContainer>
			<MapNavigator mapNumber={60} />
			<FPSCounter />
			<Text
				text={`Renderer: ${app.app.renderer.type}`}
				x={10}
				y={50}
			/>
		</pixiContainer>
	)
}

export default App
