import {extend} from '@pixi/react'
import {Container, Text, TextStyle} from 'pixi.js'
import {Example} from '../components/Example'
import type {FC} from 'react'
import {useTextures} from "../hooks/useTextures.ts";

extend({Container, Text})

const styly: TextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fill: '#ffffff', // Color del texto
    stroke: '#000000', // Color del borde
    align: 'center', // Alineación
});

const App: FC = () => {
    const {isLoaded, getTexture} = useTextures()

    return (
        <container x={150} y={150}>
            <pixiText text={"Texto de prueba!"} style={styly}/>
            {isLoaded && <Example getTexture={getTexture}/>}
        </container>
    )
}

export default App
