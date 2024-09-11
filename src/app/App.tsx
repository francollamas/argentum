import {extend} from '@pixi/react'
import {Container} from 'pixi.js'
import {Example} from '../components/Example'
import type {FC} from 'react'
import {useTextures} from "../hooks/useTextures.ts";

extend({Container})

const App: FC = () => {
    const {isLoaded, getTexture} = useTextures()

    return (
        <container x={150} y={150}>
            {isLoaded && <Example getTexture={getTexture}/>}
        </container>
    )
}

export default App
