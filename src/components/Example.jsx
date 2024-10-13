import {extend} from '@pixi/react'
import {Container, Sprite} from 'pixi.js'

import {useAppDispatch, useAppSelector} from '../store/hooks'
import {addUser, userSelector} from '../store/slices/userSlice'
import {useTexture} from "../hooks/useTexture.ts";


extend({Container, Sprite})

export const Example = () => {

    const users = useAppSelector(userSelector)
    const dispatch = useAppDispatch()
    const tex1 = useTexture("689")
    const tex2 = useTexture("386")

    const handleAddUser = () => {
        console.log('clicking!!')
        const newUser = {
            id: 'abc', name: 'John', email: 'john@email.com',
        }

        dispatch(addUser(newUser))
    }

    return (<container>
        {tex1 && tex2 && <sprite
            eventMode='static' onPointerDown={handleAddUser}
            texture={users.length % 2 === 0 ? tex1 : tex2}
        />}

    </container>)
}
