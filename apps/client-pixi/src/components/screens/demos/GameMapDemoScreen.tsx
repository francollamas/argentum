import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { usePlayerStore } from '../../../store'
import { GameView } from '../../game/GameView'
import { MapHud } from '../../game/MapHud'
import { UIScreen } from '../../layout'

type GameMapDemoScreenProps = {
	onBack: () => void
}

export const GameMapDemoScreen: FC<GameMapDemoScreenProps> = ({ onBack }) => {
	const [mapNumber, setMapNumber] = useState(1)
	const setPlayerPosition = usePlayerStore((state) => state.setPosition)

	const handleMapNumberChange = useCallback(
		(nextMapNumber: number) => {
			setMapNumber(nextMapNumber)
			setPlayerPosition({ tileX: 50, tileY: 50 })
		},
		[setPlayerPosition],
	)

	return (
		<>
			<GameView mapNumber={mapNumber} />
			<UIScreen>
				<MapHud
					onBack={onBack}
					mapNumber={mapNumber}
					onMapNumberChange={handleMapNumberChange}
				/>
			</UIScreen>
		</>
	)
}
