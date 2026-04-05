export type FontType =
	| 'button'
	| 'buttonSmall'
	| 'title'
	| 'general'
	| 'checkbox'

type FontConfig = {
	fontFamily: string
	fontSize: number
	/** Visual cap height of the glyph in pixels (used for vertical centering calculations). */
	capHeight: number
}

export const FONTS: Record<FontType, FontConfig> = {
	button: {
		fontFamily: 'medievalsharp-regular',
		fontSize: 36,
		capHeight: 26,
	},
	buttonSmall: {
		fontFamily: 'medievalsharp-regular',
		fontSize: 30,
		capHeight: 22,
	},
	title: {
		fontFamily: 'opensans-regular',
		fontSize: 48,
		capHeight: 35,
	},
	general: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 36,
		capHeight: 26,
	},
	checkbox: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 36,
		capHeight: 26,
	},
}
