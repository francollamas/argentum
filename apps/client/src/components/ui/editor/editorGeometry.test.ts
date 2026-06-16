import { describe, expect, it } from 'vitest'
import { getCaretRect, getSelectionRects } from './editorGeometry'

type FakeRect = { left: number; top: number; width: number; height: number }

type FakeRange = {
	setStart: (
		node: { nodeType: number; textContent?: string },
		offset: number,
	) => void
	setEnd: (
		node: { nodeType: number; textContent?: string },
		offset: number,
	) => void
	getBoundingClientRect: () => FakeRect
	getClientRects: () => FakeRect[]
}

function makeMirror(text: string) {
	const mirror: {
		firstChild: { nodeType: number; textContent?: string } | null
		getBoundingClientRect?: () => DOMRect
	} = {
		firstChild: { nodeType: 3, textContent: text },
	}
	let lastRange: FakeRange | null = null
	;(globalThis as { document: unknown }).document = {
		createRange: () => {
			const range: FakeRange = {
				setStart: () => {},
				setEnd: () => {},
				getBoundingClientRect: () => ({
					left: 0,
					top: 0,
					width: 0,
					height: 20,
				}),
				getClientRects: () => [],
			}
			lastRange = range
			return range
		},
	}
	mirror.getBoundingClientRect = () =>
		({ left: 0, top: 0, width: 200, height: 40 }) as DOMRect
	return { mirror, getRange: () => lastRange }
}

describe('editorGeometry', () => {
	it('returns null for caret when mirror has no text node', () => {
		const { mirror } = makeMirror('')
		mirror.firstChild = null
		expect(getCaretRect(mirror as unknown as HTMLDivElement, 0, 2)).toBeNull()
	})

	it('clamps caret position to text length', () => {
		const mirror = {
			firstChild: { nodeType: 3, textContent: 'hi' },
			getBoundingClientRect: () => ({
				left: 0,
				top: 0,
				width: 200,
				height: 40,
			}),
		} as unknown as HTMLDivElement
		const rect = getCaretRect(mirror, 999, 2)
		expect(rect).not.toBeNull()
		expect(rect?.width).toBe(2)
		expect(rect?.height).toBe(20)
	})

	it('returns empty array when selection has zero length', () => {
		const mirror = {
			firstChild: { nodeType: 3, textContent: 'hello' },
			getBoundingClientRect: () => ({
				left: 0,
				top: 0,
				width: 200,
				height: 40,
			}),
		} as unknown as HTMLDivElement
		expect(getSelectionRects(mirror, 2, 2)).toEqual([])
	})

	it('skips zero-area rects in selection', () => {
		const text = 'hello\nworld'
		const mirrorRect = { left: 0, top: 0, width: 200, height: 40 }
		const rangeRect: FakeRect = { left: 10, top: 5, width: 50, height: 20 }
		const range: FakeRange = {
			setStart: () => {},
			setEnd: () => {},
			getBoundingClientRect: () => rangeRect,
			getClientRects: () => [
				rangeRect,
				{ left: 0, top: 0, width: 0, height: 0 },
				{ left: 60, top: 5, width: 30, height: 20 },
			],
		}
		;(globalThis as { document: unknown }).document = {
			createRange: () => range,
		}
		const mirror = {
			firstChild: { nodeType: 3, textContent: text },
			getBoundingClientRect: () => mirrorRect,
		} as unknown as HTMLDivElement

		const rects = getSelectionRects(mirror, 0, text.length)
		expect(rects).toHaveLength(2)
		expect(rects[0]).toEqual({ x: 10, y: 5, width: 50, height: 20 })
		expect(rects[1]).toEqual({ x: 60, y: 5, width: 30, height: 20 })
	})
})
