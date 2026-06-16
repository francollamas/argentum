export type Rect = {
	x: number
	y: number
	width: number
	height: number
}

const TEXT_NODE_TYPE = 3

function getTextNode(mirror: HTMLElement): Text | null {
	const node = mirror.firstChild
	if (node && node.nodeType === TEXT_NODE_TYPE) {
		return node as Text
	}
	return null
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value))
}

export function getCaretRect(
	mirror: HTMLElement,
	position: number,
	caretWidth: number,
): Rect | null {
	const textNode = getTextNode(mirror)
	if (!textNode) return null

	const textLength = textNode.textContent?.length ?? 0
	const safePos = clamp(position, 0, textLength)
	const range = document.createRange()
	range.setStart(textNode, safePos)
	range.setEnd(textNode, safePos)

	const rect = range.getBoundingClientRect()
	const mirrorRect = mirror.getBoundingClientRect()

	return {
		x: rect.left - mirrorRect.left,
		y: rect.top - mirrorRect.top,
		width: caretWidth,
		height: rect.height,
	}
}

export function getSelectionRects(
	mirror: HTMLElement,
	start: number,
	end: number,
): Rect[] {
	if (start === end) return []
	const textNode = getTextNode(mirror)
	if (!textNode) return []

	const textLength = textNode.textContent?.length ?? 0
	const safeStart = clamp(start, 0, textLength)
	const safeEnd = clamp(end, safeStart, textLength)
	if (safeStart === safeEnd) return []

	const range = document.createRange()
	range.setStart(textNode, safeStart)
	range.setEnd(textNode, safeEnd)

	const rects = range.getClientRects()
	const mirrorRect = mirror.getBoundingClientRect()
	const result: Rect[] = []
	for (let i = 0; i < rects.length; i++) {
		const r = rects[i]
		if (r.width === 0 && r.height === 0) continue
		result.push({
			x: r.left - mirrorRect.left,
			y: r.top - mirrorRect.top,
			width: r.width,
			height: r.height,
		})
	}
	return result
}
