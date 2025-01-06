import { extend } from '@pixi/react'
import { Container, Sprite } from 'pixi.js'

import { useTexture } from '../hooks/useTexture.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addUser, userSelector } from '../store/slices/userSlice'
import { CustomSprite } from './CustomSprite.jsx'

extend({ Container, Sprite })

export const Example = () => {
	const users = useAppSelector(userSelector)
	const dispatch = useAppDispatch()
	const tex1 = useTexture('13013')
	const tex2 = useTexture('335')

	const handleAddUser = () => {
		console.log('clicking!!')
		const newUser = {
			id: 'abc',
			name: 'John',
			email: 'john@email.com',
		}

		dispatch(addUser(newUser))
	}

	return (
		<container>
			{/*			{tex1 && tex2 && (
				<sprite
					eventMode='static'
					onPointerDown={handleAddUser}
					texture={users.length % 2 === 0 ? tex1 : tex2}
				/>
			)}*/}
			<CustomSprite id={'145'} />
		</container>
	)
}
