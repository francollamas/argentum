import { createContext, useContext } from 'react'

type ScrollGestureContextValue = {
	shouldCancelTap: () => boolean
	claimGesture: (pointerId: number) => void
	releaseGesture: (pointerId: number) => void
	isGestureClaimed: (pointerId: number) => boolean
}

const defaultValue: ScrollGestureContextValue = {
	shouldCancelTap: () => false,
	claimGesture: () => {},
	releaseGesture: () => {},
	isGestureClaimed: () => false,
}

export const ScrollGestureContext =
	createContext<ScrollGestureContextValue>(defaultValue)

export const useScrollGestureContext = () => useContext(ScrollGestureContext)
