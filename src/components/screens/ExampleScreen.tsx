import '@pixi/layout'
import '@pixi/layout/react'
import { LayoutContainer } from '@pixi/layout/components'
import { extend } from '@pixi/react'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setScreen } from '../../store/slices/screenSlice'
import { UIButton } from '../common/UIButton'
import { UIInput } from '../common/UIInput'
import { UISelect } from '../common/UISelect'
import { UIText } from '../common/UIText'

extend({ LayoutContainer })

export const ExampleScreen = () => {
	const dispatch = useDispatch()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [selectedOption, setSelectedOption] = useState('Opción 1')

	const handleBackClick = useCallback(() => {
		dispatch(setScreen('login'))
	}, [dispatch])

	const handleButton1Click = useCallback(() => {
		console.log('Botón Primario presionado')
	}, [])

	const handleButton2Click = useCallback(() => {
		console.log('Botón Secundario presionado')
	}, [])

	return (
		<layoutContainer
			layout={{
				width: '100%',
				height: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: 20,
				backgroundColor: 0x2a2a2a,
				padding: 30,
			}}
		>
			<UIText text='UI Demo' size='title' />

			<layoutContainer
				layout={{
					width: 'auto',
					height: 'auto',
					flexDirection: 'row',
					flexWrap: 'nowrap',
					gap: 20,
				}}
			>
				<layoutContainer
					layout={{
						width: 200,
						height: 'auto',
						flexDirection: 'column',
						gap: 12,
						padding: 18,
						backgroundColor: 0x4a4a4a,
						borderRadius: 8,
					}}
				>
					<UIText text='Botones' size='large' />

					<UIButton
						text='Botón Primario'
						onClick={handleButton1Click}
						width={160}
						height={36}
					/>

					<UIButton
						text='Botón Secundario'
						onClick={handleButton2Click}
						width={160}
						height={36}
					/>

					<UIButton
						text='Deshabilitado'
						onClick={() => {}}
						width={160}
						height={36}
						disabled
					/>
				</layoutContainer>

				<layoutContainer
					layout={{
						width: 200,
						height: 'auto',
						flexDirection: 'column',
						gap: 12,
						padding: 18,
						backgroundColor: 0x3a3a3a,
						borderRadius: 8,
					}}
				>
					<UIText text='Inputs' size='large' />

					<UIInput
						placeholder='Username...'
						value={username}
						onChange={setUsername}
						width={160}
					/>

					<UIInput
						placeholder='Password...'
						value={password}
						onChange={setPassword}
						password
						width={160}
					/>
				</layoutContainer>

				<layoutContainer
					layout={{
						width: 200,
						height: 'auto',
						flexDirection: 'column',
						gap: 12,
						padding: 18,
						backgroundColor: 0x3a3a3a,
						borderRadius: 8,
					}}
				>
					<UIText text='Select' size='large' />

					<UISelect
						options={['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4']}
						value={selectedOption}
						onChange={setSelectedOption}
						width={160}
					/>
				</layoutContainer>
			</layoutContainer>

			<UIButton
				text='Volver al Login'
				onClick={handleBackClick}
				width={160}
				height={38}
			/>
		</layoutContainer>
	)
}
