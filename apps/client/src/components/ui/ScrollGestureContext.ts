import { createContext, useContext } from 'react'

type ScrollGestureContextValue = {
	shouldCancelTap: () => boolean
}

const defaultValue: ScrollGestureContextValue = {
	shouldCancelTap: () => false,
}

export const ScrollGestureContext =
	createContext<ScrollGestureContextValue>(defaultValue)

export const useScrollGestureContext = () => useContext(ScrollGestureContext)
