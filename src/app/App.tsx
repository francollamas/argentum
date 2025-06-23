import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
import { Example } from '../components/Example'
import { useResources } from '../hooks/useResources.ts'

extend({ Container })

const App: FC = () => {
	const resourcesLoaded = useResources()

	if (!resourcesLoaded) {
		return <></>
	}

	return (
		<pixiContainer x={150} y={150}>
			<Example />
		</pixiContainer>
	)
}

export default App
