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
import { uiManager } from '../managers/uiManager'

let parsersLoaded = false
let resourcesLoadPromise: Promise<void> | null = null

const loadParsers = () => {
	if (parsersLoaded) {
		return
	}

	const parsers = [
		spritesParser,
		characterPartsParser,
		specialEffectsParser,
		mapsParser,
	]

	for (const parser of parsers) {
		extensions.add(parser)
	}

	parsersLoaded = true
}

const loadResources = async () => {
	if (!resourcesLoadPromise) {
		resourcesLoadPromise = (async () => {
			await loadFonts()
			await uiManager.loadAll()
			await loadSprites()
			await loadBodies()
			await loadHeads()
			await loadHelmets()
			await loadShields()
			await loadWeapons()
			await loadSpecialEffects()
		})()
	}

	await resourcesLoadPromise
}

export const useResources = () => {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		let cancelled = false

		;(async () => {
			loadParsers()
			await loadResources()

			if (!cancelled) {
				setLoaded(true)
			}
		})()

		return () => {
			cancelled = true
		}
	}, [])

	return loaded
}
