import { extend } from '@pixi/react'
import { Container } from 'pixi.js'
import { Application } from './Application'
import { Example } from './Example'

extend({ Container })

const App = () => {
	return (
		<Application attachToDevtools backgroundColor={0x000000}>
			<container x={150} y={150}>
				<Example />
			</container>
		</Application>
	)
}

export default App
