import { LayoutContainer } from '@pixi/layout/components'
import { extend } from '@pixi/react'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setScreen } from '../../store/slices/screenSlice'
import { UIButton } from '../common/UIButton'
import { UIText } from '../common/UIText'

extend({ LayoutContainer })

export const LoginScreen = () => {
	const dispatch = useDispatch()

	const handleGameClick = useCallback(() => {
		dispatch(setScreen('game'))
	}, [dispatch])

	const handleExampleClick = useCallback(() => {
		dispatch(setScreen('example'))
	}, [dispatch])

	return (
		<layoutContainer
			layout={{
				width: '100%',
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: 16,
				backgroundColor: 0x2a2a2a,
			}}
		>
			<UIText text='Argentum Online' size='title' />

			<UIButton text='Ir al Juego' onClick={handleGameClick} />

			<UIButton text='Ver UI Demo' onClick={handleExampleClick} />
		</layoutContainer>
	)
}
