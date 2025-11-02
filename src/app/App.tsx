import { extend, useApplication } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { FPSCounter } from '../components/common/FPSCounter'
import { Text } from '../components/common/Text'
import { GameView } from '../components/game/GameView'
import { useResources } from '../hooks/useResources'

extend({ Container })

const App: FC = () => {
	const app = useApplication()
	const resourcesLoaded = useResources()

	if (!resourcesLoaded) {
		return null
	}

	return (
		<pixiContainer>
			<GameView mapNumber={60} />
			<FPSCounter />
			<Text
				text={`Renderer: ${app.app.renderer.type}`}
				x={10}
				y={50}
				bold
				border
			/>
		</pixiContainer>
	)
}

export default App
