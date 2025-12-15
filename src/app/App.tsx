import { LayoutContainer } from '@pixi/layout/components'
import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import type { FC } from 'react'
// import { GameView } from '../components/game/GameView'
import { LayoutResizer } from '../components/layout'
// import { MainScreen } from '../components/screens/MainScreen'
import { LayoutDemoScreen } from '../components/screens/LayoutDemoScreen'
import { useResources } from '../hooks/useResources'
import { useApplication } from '@pixi/react'
import { initDevtools } from '@pixi/devtools'
import '@pixi/layout/devtools';
import { useEffect } from 'react'

extend({ Container, LayoutContainer })

const App: FC = () => {
	const { app } = useApplication()
	const resourcesLoaded = useResources()

	useEffect(() => {
		if (!app) return
		initDevtools({ app })
	}, [app])

	if (!resourcesLoaded) {
		return null
	}

	return (
		<LayoutResizer>
			{/* <GameView mapNumber={60} /> */}
			{/* <MainScreen /> */}
			<LayoutDemoScreen />
		</LayoutResizer>
	)
}

export default App
