import { Children, createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	assertSingleTriggerChild,
	createTooltipVisibilityController,
	DEFAULT_TOOLTIP_DELAY_MS,
} from './Tooltip'

describe('createTooltipVisibilityController', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('requests tooltip visibility only after the hover delay', () => {
		vi.useFakeTimers()
		const events: string[] = []
		const controller = createTooltipVisibilityController({
			delayMs: DEFAULT_TOOLTIP_DELAY_MS,
			onShow: () => events.push('show'),
			onHide: () => events.push('hide'),
		})

		controller.handlePointerOver()
		vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY_MS - 1)

		expect(events).toEqual([])

		vi.advanceTimersByTime(1)

		expect(events).toEqual(['show'])
	})

	it('cancels pending show and hides immediately on pointer out', () => {
		vi.useFakeTimers()
		const events: string[] = []
		const controller = createTooltipVisibilityController({
			delayMs: DEFAULT_TOOLTIP_DELAY_MS,
			onShow: () => events.push('show'),
			onHide: () => events.push('hide'),
		})

		controller.handlePointerOver()
		vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY_MS / 2)
		controller.handlePointerOut()

		expect(events).toEqual(['hide'])

		vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY_MS)

		expect(events).toEqual(['hide'])

		controller.handlePointerOver()
		vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY_MS)
		controller.handlePointerOut()

		expect(events).toEqual(['hide', 'show', 'hide'])
	})
})

describe('assertSingleTriggerChild', () => {
	it('returns the single child unchanged', () => {
		const child = createElement('mock-trigger')

		expect(assertSingleTriggerChild(child)).toBe(child)
	})

	it('rejects zero or multiple children', () => {
		expect(() => assertSingleTriggerChild(undefined)).toThrow(
			/exactly one trigger child/i,
		)

		expect(() =>
			assertSingleTriggerChild([
				createElement('mock-trigger', { key: 'a' }),
				createElement('mock-trigger', { key: 'b' }),
			]),
		).toThrow(/exactly one trigger child/i)

		expect(
			Children.count(assertSingleTriggerChild(createElement('mock-trigger'))),
		).toBe(1)
	})
})
