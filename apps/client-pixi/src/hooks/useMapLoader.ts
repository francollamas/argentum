import { useEffect, useState } from 'react'
import { loadMap } from '../loaders/mapLoader'
import type { GameMap } from '../types/map'
import { logger } from '../utils/logger'

export const useMapLoader = (mapNumber: number) => {
	const [map, setMap] = useState<GameMap | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false

		const loadMapData = async () => {
			try {
				setLoading(true)
				setError(null)
				setMap(null)
				const loadedMap = await loadMap(mapNumber)

				if (!cancelled) {
					setMap(loadedMap)
				}
			} catch (err) {
				logger.error('Failed to load map', { mapNumber, error: err })

				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Unknown error')
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		loadMapData()

		return () => {
			cancelled = true
		}
	}, [mapNumber])

	return { map, loading, error }
}
