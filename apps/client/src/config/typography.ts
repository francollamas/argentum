export type FontType =
	| 'titleLg'
	| 'title'
	| 'titleSm'
	| 'body'
	| 'bodySm'
	| 'input'
	| 'label'
	| 'labelSm'
	| 'button'
	| 'buttonSm'

type FontConfig = {
	fontFamily: string
	domFontFamily: string
	fontSize: number
}

export const FONTS: Record<FontType, FontConfig> = {
	titleLg: {
		fontFamily: 'spacegrotesk-regular',
		domFontFamily: 'spacegrotesk-regular-dom',
		fontSize: 48,
	},
	title: {
		fontFamily: 'spacegrotesk-regular',
		domFontFamily: 'spacegrotesk-regular-dom',
		fontSize: 36,
	},
	titleSm: {
		fontFamily: 'spacegrotesk-regular',
		domFontFamily: 'spacegrotesk-regular-dom',
		fontSize: 24,
	},
	body: {
		fontFamily: 'inter',
		domFontFamily: 'inter-dom',
		fontSize: 18,
	},
	bodySm: {
		fontFamily: 'inter',
		domFontFamily: 'inter-dom',
		fontSize: 14,
	},
	input: {
		fontFamily: 'inter',
		domFontFamily: 'inter-dom',
		fontSize: 16,
	},
	label: {
		fontFamily: 'inter',
		domFontFamily: 'inter-dom',
		fontSize: 16,
	},
	labelSm: {
		fontFamily: 'inter',
		domFontFamily: 'inter-dom',
		fontSize: 12,
	},
	button: {
		fontFamily: 'spacegrotesk-regular',
		domFontFamily: 'spacegrotesk-regular-dom',
		fontSize: 18,
	},
	buttonSm: {
		fontFamily: 'spacegrotesk-regular',
		domFontFamily: 'spacegrotesk-regular-dom',
		fontSize: 14,
	},
}
