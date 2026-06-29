import { describe, expect, it, vi } from 'vitest'
import {
	createTooltipLayerController,
	type TooltipLayerRequest,
} from './tooltipLayerController'

const createRequest = (id: string): TooltipLayerRequest => ({
	id,
	content: id,
	placement: 'top',
	triggerBounds: {
		x: 10,
		y: 20,
		width: 30,
		height: 40,
	},
})

describe('createTooltipLayerController', () => {
	it('keeps the latest tooltip request active until the same owner hides it', () => {
		const setActive = vi.fn()
		const controller = createTooltipLayerController(setActive)
		const first = createRequest('first')
		const second = createRequest('second')

		controller.show(first)
		controller.show(second)
		controller.hide('first')

		expect(setActive.mock.calls).toEqual([[first], [second]])

		controller.hide('second')

		expect(setActive.mock.calls).toEqual([[first], [second], [null]])
	})

	it('clears the active tooltip when its owner hides it directly', () => {
		const setActive = vi.fn()
		const controller = createTooltipLayerController(setActive)
		const request = createRequest('tooltip')

		controller.show(request)
		controller.hide('tooltip')

		expect(setActive).toHaveBeenCalledWith(null)
	})
})
