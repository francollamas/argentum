import type { FC } from 'react'
import { FPSCounter } from '../../common/FPSCounter'
import { GameView } from '../../game/GameView'
import { MapHud } from '../../game/MapHud'
import { UIScreen } from '../../layout'

type GameMapDemoScreenProps = {
	onBack: () => void
}

const DEMO_MAP_NUMBER = 2

export const GameMapDemoScreen: FC<GameMapDemoScreenProps> = ({ onBack }) => {
	return (
		<>
			<GameView mapNumber={DEMO_MAP_NUMBER} />
			<UIScreen>
				<MapHud onBack={onBack} />
				<FPSCounter />
			</UIScreen>
		</>
	)
}
