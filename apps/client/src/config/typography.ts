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
		fontFamily: 'opensans-regular',
		fontSize: 48,
	},
	title: {
		fontFamily: 'opensans-regular',
		fontSize: 36,
	},
	titleSm: {
		fontFamily: 'opensans-regular',
		fontSize: 24,
	},
	body: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 18,
	},
	bodySm: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 14,
	},
	label: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 16,
	},
	labelSm: {
		fontFamily: 'crimsomtext-regular',
		fontSize: 12,
	},
	button: {
		fontFamily: 'medievalsharp-regular',
		fontSize: 18,
	},
	buttonSm: {
		fontFamily: 'medievalsharp-regular',
		fontSize: 14,
	},
}
