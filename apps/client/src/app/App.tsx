import { initDevtools } from '@pixi/devtools'
import { useApplication } from '@pixi/react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { LayoutResizer } from '../components/layout'
import { DemoHubScreen } from '../components/screens/DemoHubScreen'
import { usePixelDensitySync } from '../hooks/usePixelDensitySync'
import { useResources } from '../hooks/useResources'
import '@pixi/layout/devtools'

const App: FC = () => {
	const { app } = useApplication()
	const resourcesLoaded = useResources()
	usePixelDensitySync()

	useEffect(() => {
		if (!app) return
		initDevtools({ app })
	}, [app])

	if (!resourcesLoaded) {
		return null
	}

	return (
		<LayoutResizer>
			<DemoHubScreen />
		</LayoutResizer>
	)
}

export default App
