import { useCustomParsers } from './useCustomParsers.ts'
import { useEffect, useState } from 'react'
import { Assets } from 'pixi.js'

import spritesBin from '../../assets/inits/sprites.bin'

export const useResources = () => {
	const parsersDefined = useCustomParsers()
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		;(async () => {
			if (!parsersDefined) return

			await Assets.load({
				src: spritesBin,
				loadParser: 'loadSprites',
			})

			setLoaded(true)
		})()
	}, [parsersDefined])

	return loaded
}
