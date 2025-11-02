import { useEffect, useState } from 'react'
import { loadMap } from '../loaders/mapLoader'
import type { GameMap } from '../types/map'

export const useMapLoader = (mapNumber: number) => {
	const [map, setMap] = useState<GameMap | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadMapData = async () => {
			try {
				setLoading(true)
				setError(null)
				const loadedMap = await loadMap(mapNumber)
				setMap(loadedMap)
			} catch (err) {
				console.error('Failed to load map:', err)
				setError(err instanceof Error ? err.message : 'Unknown error')
			} finally {
				setLoading(false)
			}
		}

		loadMapData()
	}, [mapNumber])

	return { map, loading, error }
}
