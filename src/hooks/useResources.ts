import { extensions } from 'pixi.js'
import { useEffect, useState } from 'react'
import {
	characterPartsParser,
	loadBodies,
	loadHeads,
	loadHelmets,
	loadShields,
	loadWeapons,
} from '../loaders/characterPartsLoader'
import { loadFonts } from '../loaders/fontsLoader'
import { mapsParser } from '../loaders/mapLoader'
import {
	loadSpecialEffects,
	specialEffectsParser,
} from '../loaders/specialEffectsLoader'
import { loadSprites, spritesParser } from '../loaders/spriteLoader'

const loadParsers = () => {
	const parsers = [
		spritesParser,
		characterPartsParser,
		specialEffectsParser,
		mapsParser,
	]

	for (const parser of parsers) {
		extensions.add(parser)
	}
}

const loadResources = async () => {
	await loadFonts()
	await loadSprites()
	await loadBodies()
	await loadHeads()
	await loadHelmets()
	await loadShields()
	await loadWeapons()
	await loadSpecialEffects()
}

export const useResources = () => {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		;(async () => {
			loadParsers()
			await loadResources()

			setLoaded(true)
		})()
	}, [])

	return loaded
}
