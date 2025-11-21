import { Assets } from 'pixi.js'

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
}
