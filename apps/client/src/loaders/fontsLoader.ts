import { Assets } from 'pixi.js'
import { FONTS } from '../config/typography'

const DOM_FONT_SIZE = 16

const loadDomFonts = async () => {
	if (typeof document === 'undefined' || !('fonts' in document)) {
		return
	}

	const fontFamilies = [
		...new Set(Object.values(FONTS).map((font) => font.domFontFamily)),
	]

	await Promise.all(
		fontFamilies.map((fontFamily) =>
			document.fonts.load(`${DOM_FONT_SIZE}px "${fontFamily}"`),
		),
	)
}

export const loadFonts = async () => {
	const response = await fetch('/fonts/fonts.json')
	if (!response.ok) {
		throw new Error('Unable to load fonts manifest')
	}

	const aliases = (await response.json()) as string[]
	if (!Array.isArray(aliases)) {
		throw new Error('Fonts manifest is not an array')
	}

	await Promise.all(
		aliases.map((alias) =>
			Assets.load({
				alias,
				src: `/fonts/${alias}.fnt`,
			}),
		),
	)

	await loadDomFonts()
}
