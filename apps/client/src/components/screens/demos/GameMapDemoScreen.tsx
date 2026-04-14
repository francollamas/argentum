import type { FC } from 'react'
import { FPSCounter } from '../../common/FPSCounter'
import { GameView } from '../../game/GameView'
import { MapHud } from '../../game/MapHud'
import { UIScreen } from '../../layout'

type GameMapDemoScreenProps = {
	onBack: () => void
}

const DEMO_MAP_NUMBER = 1

export const GameMapDemoScreen: FC<GameMapDemoScreenProps> = ({ onBack }) => {
	return (
		<>
			<GameView mapNumber={DEMO_MAP_NUMBER} />
			<UIScreen>
				<layoutContainer
					layout={{
						width: '100%',
						height: '100%',
						backgroundColor: 0x120c09,
					}}
				/>
				<MapHud onBack={onBack} />
				<FPSCounter />
			</UIScreen>
		</>
	)
}
