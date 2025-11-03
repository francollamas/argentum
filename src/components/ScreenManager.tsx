import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { GameView } from './game/GameView'
import { ExampleScreen } from './screens/ExampleScreen'
import { LoginScreen } from './screens/LoginScreen'

/**
 * ScreenManager component
 * Manages which screen is currently displayed based on Redux state
 */
export const ScreenManager = () => {
	const currentScreen = useSelector(
		(state: RootState) => state.screen.currentScreen,
	)

	switch (currentScreen) {
		case 'login':
			return <LoginScreen />
		case 'game':
			return <GameView mapNumber={60} />
		case 'example':
			return <ExampleScreen />
		default:
			return <LoginScreen />
	}
}
