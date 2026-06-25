import { initDevtools } from '@pixi/devtools'
import { useApplication } from '@pixi/react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { ScreenRoot } from '../components/layout'
import { DemoHubScreen } from '../components/screens/DemoHubScreen'
import { TooltipLayerProvider } from '../components/ui/TooltipLayer'
import { useGameSurfaceSelectionGuard } from '../hooks/useGameSurfaceSelectionGuard'
import { usePixelDensitySync } from '../hooks/usePixelDensitySync'
import { useResources } from '../hooks/useResources'
import '@pixi/layout/devtools'

const App: FC = () => {
	const { app } = useApplication()
	const resourcesLoaded = useResources()
	usePixelDensitySync()
	useGameSurfaceSelectionGuard()

	useEffect(() => {
		if (!app) return
		initDevtools({ app })
	}, [app])

	if (!resourcesLoaded) {
		return null
	}

	return (
		<ScreenRoot>
			<TooltipLayerProvider>
				<DemoHubScreen />
			</TooltipLayerProvider>
		</ScreenRoot>
	)
}

export default App
