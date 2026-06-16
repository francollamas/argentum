import { initDevtools } from '@pixi/devtools'
import { useApplication } from '@pixi/react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { ScreenRoot } from '../components/layout'
import { DemoHubScreen } from '../components/screens/DemoHubScreen'
import { TooltipLayerProvider } from '../components/ui/TooltipLayer'
import { ActiveDomTextEditor } from '../components/ui/textEditor/ActiveDomTextEditor'
import { TextEditorProvider } from '../components/ui/textEditor/TextEditorProvider'
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
		<TextEditorProvider>
			<ScreenRoot>
				<TooltipLayerProvider>
					<DemoHubScreen />
				</TooltipLayerProvider>
			</ScreenRoot>
			<ActiveDomTextEditor />
		</TextEditorProvider>
	)
}

export default App
