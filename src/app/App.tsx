import { extend } from '@pixi/react'
import { Container, Text, TextStyle } from 'pixi.js'
import type { FC } from 'react'
import { Example } from '../components/Example'

extend({ Container, Text })

const styly: TextStyle = new TextStyle({
	fontFamily: 'Arial',
	fontSize: 36,
	fill: '#ffffff', // Color del texto
	stroke: '#000000', // Color del borde
	align: 'center', // Alineación
})

const App: FC = () => {
	return (
		<container x={150} y={150}>
			<pixiText text={'Texto de prueba!'} style={styly} />
			<Example />
		</container>
	)
}

export default App
