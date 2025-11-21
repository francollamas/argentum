export type FontType = 'button' | 'title' | 'general'

type FontConfig = {
	fontFamily: string
	fontSize: number
}

export const FONTS: Record<FontType, FontConfig> = {
	button: {
		fontFamily: 'medievalsharp-regular',
		fontSize: 36,
	},
	title: {
		fontFamily: 'opensans-regular',
		fontSize: 48,
	},
	general: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 24,
	},
}
