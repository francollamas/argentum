import type { FancyButton, Input, Select } from '@pixi/ui'
import type { PixiReactElementProps } from '@pixi/react'

declare module '@pixi/react' {
	interface PixiElements {
		fancyButton: PixiReactElementProps<typeof FancyButton>
		pixiInput: PixiReactElementProps<typeof Input>
		pixiSelect: PixiReactElementProps<typeof Select>
	}
}
