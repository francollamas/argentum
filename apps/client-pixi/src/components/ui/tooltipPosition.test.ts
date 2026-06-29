import { describe, expect, it } from 'vitest'
import { resolvePlacement } from './tooltipPosition'

const triggerBounds = {
	x: 100,
	y: 50,
	width: 80,
	height: 24,
}

const tooltipBounds = {
	width: 120,
	height: 40,
}

describe('resolvePlacement', () => {
	it('positions tooltips above and below the trigger', () => {
		expect(resolvePlacement('top', triggerBounds, tooltipBounds, 8)).toEqual({
			x: 80,
			y: 2,
		})

		expect(resolvePlacement('bottom', triggerBounds, tooltipBounds, 8)).toEqual(
			{
				x: 80,
				y: 82,
			},
		)
	})

	it('positions tooltips on the left and right of the trigger', () => {
		expect(resolvePlacement('left', triggerBounds, tooltipBounds, 8)).toEqual({
			x: -28,
			y: 42,
		})

		expect(resolvePlacement('right', triggerBounds, tooltipBounds, 8)).toEqual({
			x: 188,
			y: 42,
		})
	})
})
