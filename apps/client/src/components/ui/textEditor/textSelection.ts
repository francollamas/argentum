import {
	getAlignedTextOffset,
	getInputTextStyle,
	getTextAreaTextStyle,
	layoutMultilineText,
	type MultilineTextLine,
	maskTextValue,
	measureTextWidth,
} from './textMeasurement'
import type { ActiveEditorSelection, TextEditorAlign } from './types'

type Rect = {
	x: number
	y: number
	width: number
	height: number
}

type Point = {
	x: number
	y: number
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function getIndexWidth(text: string, index: number) {
	return measureTextWidth(
		text.slice(0, clamp(index, 0, text.length)),
		getInputTextStyle(),
	)
}

export function getInputTextX(
	value: string,
	secure: boolean,
	viewportWidth: number,
	align: TextEditorAlign,
	scrollLeft: number,
) {
	const text = maskTextValue(value, secure)
	const textWidth = measureTextWidth(text, getInputTextStyle())
	return getAlignedTextOffset(textWidth, viewportWidth, align) - scrollLeft
}

export function getSingleLineCaretPosition(options: {
	value: string
	secure: boolean
	index: number
	viewportWidth: number
	align: TextEditorAlign
	scrollLeft: number
	caretHeight: number
	contentHeight: number
}) {
	const text = maskTextValue(options.value, options.secure)
	const x =
		getInputTextX(
			options.value,
			options.secure,
			options.viewportWidth,
			options.align,
			options.scrollLeft,
		) + getIndexWidth(text, options.index)

	return {
		x,
		y: Math.max(0, (options.contentHeight - options.caretHeight) / 2),
	}
}

export function getSingleLineSelectionRects(options: {
	value: string
	secure: boolean
	selection: ActiveEditorSelection
	viewportWidth: number
	align: TextEditorAlign
	scrollLeft: number
	height: number
}) {
	const text = maskTextValue(options.value, options.secure)
	const start = Math.min(options.selection.start, options.selection.end)
	const end = Math.max(options.selection.start, options.selection.end)

	if (start === end) {
		return [] as Rect[]
	}

	const baseX = getInputTextX(
		options.value,
		options.secure,
		options.viewportWidth,
		options.align,
		options.scrollLeft,
	)

	const startX = baseX + getIndexWidth(text, start)
	const endX = baseX + getIndexWidth(text, end)

	return [
		{
			x: startX,
			y: 0,
			width: Math.max(0, endX - startX),
			height: options.height,
		},
	]
}

function getLineOffset(
	line: MultilineTextLine,
	viewportWidth: number,
	align: TextEditorAlign,
) {
	return getAlignedTextOffset(line.width, viewportWidth, align)
}

export function getMultilineCaretPosition(options: {
	value: string
	index: number
	viewportWidth: number
	align: TextEditorAlign
	lineHeight: number
	scrollLeft: number
	scrollTop: number
}) {
	const lines = layoutMultilineText(options.value, options.viewportWidth)
	const text = options.value

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex] as MultilineTextLine
		const isLastLine = lineIndex === lines.length - 1
		const lineEnd = isLastLine ? line.end : line.end + 1

		if (options.index <= lineEnd) {
			const localIndex = clamp(options.index - line.start, 0, line.text.length)
			const x =
				getLineOffset(line, options.viewportWidth, options.align) +
				measureTextWidth(
					text.slice(line.start, line.start + localIndex),
					getTextAreaTextStyle(),
				) -
				options.scrollLeft

			return {
				x,
				y: lineIndex * options.lineHeight - options.scrollTop,
			}
		}
	}

	const lastLine = lines[lines.length - 1] as MultilineTextLine
	return {
		x:
			getLineOffset(lastLine, options.viewportWidth, options.align) +
			lastLine.width -
			options.scrollLeft,
		y: (lines.length - 1) * options.lineHeight - options.scrollTop,
	}
}

export function getMultilineSelectionRects(options: {
	value: string
	selection: ActiveEditorSelection
	viewportWidth: number
	align: TextEditorAlign
	lineHeight: number
	scrollLeft: number
	scrollTop: number
}) {
	const lines = layoutMultilineText(options.value, options.viewportWidth)
	const start = Math.min(options.selection.start, options.selection.end)
	const end = Math.max(options.selection.start, options.selection.end)

	if (start === end) {
		return [] as Rect[]
	}

	const rects: Rect[] = []

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex] as MultilineTextLine
		const lineSelectionStart = clamp(start, line.start, line.end)
		const lineSelectionEnd = clamp(end, line.start, line.end)

		if (lineSelectionStart === lineSelectionEnd) {
			continue
		}

		const offsetX = getLineOffset(line, options.viewportWidth, options.align)
		const startX =
			offsetX +
			measureTextWidth(
				options.value.slice(line.start, lineSelectionStart),
				getTextAreaTextStyle(),
			) -
			options.scrollLeft
		const endX =
			offsetX +
			measureTextWidth(
				options.value.slice(line.start, lineSelectionEnd),
				getTextAreaTextStyle(),
			) -
			options.scrollLeft

		rects.push({
			x: startX,
			y: lineIndex * options.lineHeight - options.scrollTop,
			width: Math.max(0, endX - startX),
			height: options.lineHeight,
		})
	}

	return rects
}

export function getSingleLineIndexAtX(options: {
	value: string
	secure: boolean
	viewportWidth: number
	align: TextEditorAlign
	scrollLeft: number
	x: number
}) {
	const text = maskTextValue(options.value, options.secure)
	const originX = getInputTextX(
		options.value,
		options.secure,
		options.viewportWidth,
		options.align,
		options.scrollLeft,
	)
	const targetX = options.x - originX

	for (let index = 0; index <= text.length; index += 1) {
		const currentWidth = getIndexWidth(text, index)
		const nextWidth = getIndexWidth(text, index + 1)

		if (targetX <= currentWidth) {
			return index
		}

		if (targetX >= currentWidth && targetX <= nextWidth) {
			return targetX - currentWidth <= nextWidth - targetX ? index : index + 1
		}
	}

	return text.length
}

export function getMultilineIndexAtPoint(options: {
	value: string
	viewportWidth: number
	align: TextEditorAlign
	lineHeight: number
	scrollLeft: number
	scrollTop: number
	point: Point
}) {
	const lines = layoutMultilineText(options.value, options.viewportWidth)
	const y = options.point.y + options.scrollTop
	const lineIndex = clamp(
		Math.floor(y / options.lineHeight),
		0,
		Math.max(0, lines.length - 1),
	)
	const line = lines[lineIndex] as MultilineTextLine
	const targetX =
		options.point.x +
		options.scrollLeft -
		getLineOffset(line, options.viewportWidth, options.align)

	for (let index = 0; index <= line.text.length; index += 1) {
		const currentWidth = measureTextWidth(
			line.text.slice(0, index),
			getTextAreaTextStyle(),
		)
		const nextWidth = measureTextWidth(
			line.text.slice(0, index + 1),
			getTextAreaTextStyle(),
		)

		if (targetX <= currentWidth) {
			return line.start + index
		}

		if (targetX >= currentWidth && targetX <= nextWidth) {
			return targetX - currentWidth <= nextWidth - targetX
				? line.start + index
				: line.start + index + 1
		}
	}

	return line.end
}
