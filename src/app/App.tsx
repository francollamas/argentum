import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { ScreenManager } from '../components/ScreenManager'
import { useResources } from '../hooks/useResources'

extend({ Container })

const App: FC = () => {
	const resourcesLoaded = useResources()

	if (!resourcesLoaded) {
		return null
	}

	return (
		<pixiContainer>
			<ScreenManager />
		</pixiContainer>
	)
}

export default App
