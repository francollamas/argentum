import type { FC } from 'react'
import { useFPS } from '../../hooks/useFPS'
import { useViewportStore } from '../../store/viewportStore'
import { Text } from '../common/Text'

export const FPSCounter: FC = () => {
	const fps = useFPS()
	const screenWidth = useViewportStore((state) => state.screenWidth)

	return <Text text={`FPS: ${fps}`} x={screenWidth - 70} y={5} bold border />
}
