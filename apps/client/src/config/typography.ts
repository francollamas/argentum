export type FontType =
	| 'button'
	| 'buttonSmall'
	| 'title'
	| 'general'
	| 'checkbox'

type FontConfig = {
	fontFamily: string
	fontSize: number
}

export const FONTS: Record<FontType, FontConfig> = {
	button: {
		fontFamily: 'medievalsharp-regular',
		fontSize: 36,
	},
	buttonSmall: {
		fontFamily: 'medievalsharp-regular',
		fontSize: 30,
	},
	title: {
		fontFamily: 'opensans-regular',
		fontSize: 48,
	},
	general: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 36,
	},
	checkbox: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 36,
	},
}
