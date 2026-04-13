export type FontType =
	| 'titleLg'
	| 'title'
	| 'titleSm'
	| 'body'
	| 'bodySm'
	| 'label'
	| 'labelSm'
	| 'button'
	| 'buttonSm'

type FontConfig = {
	fontFamily: string
	fontSize: number
}

export const FONTS: Record<FontType, FontConfig> = {
	titleLg: {
		fontFamily: 'spacegrotesk-regular',
		fontSize: 48,
	},
	title: {
		fontFamily: 'spacegrotesk-regular',
		fontSize: 36,
	},
	titleSm: {
		fontFamily: 'spacegrotesk-regular',
		fontSize: 24,
	},
	body: {
		fontFamily: 'inter',
		fontSize: 18,
	},
	bodySm: {
		fontFamily: 'inter',
		fontSize: 14,
	},
	label: {
		fontFamily: 'inter',
		fontSize: 16,
	},
	labelSm: {
		fontFamily: 'inter',
		fontSize: 12,
	},
	button: {
		fontFamily: 'spacegrotesk-regular',
		fontSize: 18,
	},
	buttonSm: {
		fontFamily: 'spacegrotesk-regular',
		fontSize: 14,
	},
}
