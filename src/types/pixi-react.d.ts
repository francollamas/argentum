import type { FancyButton } from '@pixi/ui'
import type { PixiReactElementProps } from '@pixi/react'

declare module '@pixi/react' {
	interface PixiElements {
		pixiFancyButton: PixiReactElementProps<typeof FancyButton>
	}
}
