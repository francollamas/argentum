import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { GameView } from '../components/game/GameView'
import { MainScreen } from '../components/screens/MainScreen'
import { useResources } from '../hooks/useResources'

extend({ Container })

const App: FC = () => {
	const resourcesLoaded = useResources()

	if (!resourcesLoaded) {
		return null
	}

	return (
		<pixiContainer>
			<GameView mapNumber={60} />
			<MainScreen />
		</pixiContainer>
	)
}

export default App
