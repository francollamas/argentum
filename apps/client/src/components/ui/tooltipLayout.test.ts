import { describe, expect, it } from 'vitest'
import { getTooltipContentLayout, getTooltipInnerLayout } from './tooltipLayout'

describe('getTooltipContentLayout', () => {
	it('positions the tooltip shell at the measured coordinates', () => {
		expect(getTooltipContentLayout({ x: 32, y: 48 })).toMatchObject({
			left: 32,
			top: 48,
		})
	})

	it('keeps the tooltip anchored even before a measured position exists', () => {
		expect(getTooltipContentLayout(null)).toMatchObject({
			left: 0,
			top: 0,
			position: 'absolute',
		})
	})
})

describe('getTooltipInnerLayout', () => {
	it('adds roomier padding so content stays clear of the shell border', () => {
		expect(getTooltipInnerLayout()).toMatchObject({
			paddingLeft: 14,
			paddingRight: 14,
			paddingTop: 10,
			paddingBottom: 10,
			gap: 4,
		})
	})
})
