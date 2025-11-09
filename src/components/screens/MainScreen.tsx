import { Text } from '../common/Text'
import type { FC } from 'react'

/**
 * Main screen component that serves as the initial view of the application
 */
export const MainScreen: FC = () => {
  return (
    <Text
      text="Welcome to the Game"
      x={10}
      y={10}
      bold
    />
  )
}
