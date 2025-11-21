import { Assets } from 'pixi.js'

export const loadFonts = async () => {
	await Assets.load({
		alias: 'tahoma13',
		src: '/fonts/tahoma13.fnt',
	})
	await Assets.load({
		alias: 'tahoma13-bold',
		src: '/fonts/tahoma13bold.fnt',
	})
	await Assets.load({
		alias: 'tahoma13-bold-border',
		src: './fonts/tahoma13boldborder.fnt',
	})
	await Assets.load({
		alias: 'tahoma',
		src: './fonts/tahoma-regular.fnt',
	})
	await Assets.load({
		alias: 'tahoma-bold',
		src: './fonts/tahoma-bold.fnt',
	})
	await Assets.load({
		alias: 'crimsomtext',
		src: './fonts/crimsomtext.fnt',
	})
	await Assets.load({
		alias: 'opensans',
		src: './fonts/opensans.fnt',
	})
}
