import { Assets } from 'pixi.js'
import tahoma13Fnt from '../assets/fonts/tahoma13.fnt'
import tahoma13BoldFnt from '../assets/fonts/tahoma13bold.fnt'
import tahoma13BoldBorderFnt from '../assets/fonts/tahoma13boldborder.fnt'

export const loadFonts = async () => {
	await Assets.load([
		{
			alias: 'tahoma13',
			src: tahoma13Fnt,
		},
		{
			alias: 'tahoma13-bold',
			src: tahoma13BoldFnt,
		},
		{
			alias: 'tahoma13-bold-border',
			src: tahoma13BoldBorderFnt,
		},
	])
}