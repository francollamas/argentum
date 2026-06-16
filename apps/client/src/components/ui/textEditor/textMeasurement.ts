import { FONTS } from '../../../config/typography'
import type { TextEditorAlign } from './types'

export const INPUT_FONT_FAMILY = FONTS.input.domFontFamily
export const INPUT_FONT_SIZE = FONTS.input.fontSize
export const INPUT_PADDING_X = 12
export const INPUT_HEIGHT = 40
export const INPUT_CARET_HEIGHT = 18

export const TEXTAREA_FONT_FAMILY = FONTS.body.domFontFamily
export const TEXTAREA_FONT_SIZE = FONTS.body.fontSize
export const TEXTAREA_LINE_HEIGHT = 28
export const TEXTAREA_PADDING_TOP = 12
export const TEXTAREA_PADDING_RIGHT = 12
export const TEXTAREA_PADDING_BOTTOM = 14
export const TEXTAREA_PADDING_LEFT = 12

type TextMeasureStyle = {
	fontFamily: string
	fontSize: number
}

export type MultilineTextLine = {
	text: string
	start: number
	end: number
	width: number
}

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

function getMeasureContext() {
	if (!context) {
		throw new Error('Unable to create text measurement context')
	}

	return context
}

function setMeasureFont(style: TextMeasureStyle) {
	getMeasureContext().font = `${style.fontSize}px ${style.fontFamily}`
}

export function maskTextValue(value: string, secure: boolean) {
	return secure ? '*'.repeat(value.length) : value
}

export function measureTextWidth(text: string, style: TextMeasureStyle) {
	setMeasureFont(style)
	return getMeasureContext().measureText(text).width
}

export function getInputTextStyle() {
	return {
		fontFamily: INPUT_FONT_FAMILY,
		fontSize: INPUT_FONT_SIZE,
	}
}

export function getTextAreaTextStyle() {
	return {
		fontFamily: TEXTAREA_FONT_FAMILY,
		fontSize: TEXTAREA_FONT_SIZE,
	}
}

export function getAlignedTextOffset(
	textWidth: number,
	viewportWidth: number,
	align: TextEditorAlign,
) {
	if (textWidth >= viewportWidth) {
		return 0
	}

	if (align === 'center') {
		return (viewportWidth - textWidth) / 2
	}

	if (align === 'right') {
		return viewportWidth - textWidth
	}

	return 0
}

function wrapRawLine(rawLine: string, startOffset: number, maxWidth: number) {
	const lines: MultilineTextLine[] = []
	const style = getTextAreaTextStyle()

	if (rawLine.length === 0) {
		lines.push({ text: '', start: startOffset, end: startOffset, width: 0 })
		return lines
	}

	let lineStart = 0

	while (lineStart < rawLine.length) {
		let currentEnd = lineStart
		let lastBreak = -1
		let lineText = ''

		while (currentEnd < rawLine.length) {
			const nextText = rawLine.slice(lineStart, currentEnd + 1)
			const nextWidth = measureTextWidth(nextText, style)

			if (nextWidth > maxWidth && currentEnd > lineStart) {
				break
			}

			lineText = nextText

			if (/\s/.test(rawLine[currentEnd] ?? '')) {
				lastBreak = currentEnd
			}

			currentEnd += 1

			if (nextWidth > maxWidth) {
				break
			}
		}

		let nextLineEnd = currentEnd

		if (
			currentEnd < rawLine.length &&
			lastBreak >= lineStart &&
			measureTextWidth(lineText, style) > maxWidth
		) {
			nextLineEnd = lastBreak + 1
			lineText = rawLine.slice(lineStart, nextLineEnd)
		} else if (
			currentEnd < rawLine.length &&
			lastBreak >= lineStart &&
			measureTextWidth(rawLine.slice(lineStart, currentEnd), style) > maxWidth
		) {
			nextLineEnd = lastBreak + 1
			lineText = rawLine.slice(lineStart, nextLineEnd)
		} else if (lineText.length === 0) {
			lineText = rawLine[lineStart] ?? ''
			nextLineEnd = lineStart + 1
		}

		while (
			nextLineEnd > lineStart &&
			lineText.endsWith(' ') &&
			nextLineEnd < rawLine.length
		) {
			nextLineEnd -= 1
			lineText = rawLine.slice(lineStart, nextLineEnd)
		}

		lines.push({
			text: lineText,
			start: startOffset + lineStart,
			end: startOffset + nextLineEnd,
			width: measureTextWidth(lineText, style),
		})

		lineStart = Math.max(nextLineEnd, lineStart + 1)
	}

	return lines
}

export function layoutMultilineText(value: string, maxWidth: number) {
	const normalizedWidth = Math.max(1, maxWidth)
	const rawLines = value.split('\n')
	const lines: MultilineTextLine[] = []
	let offset = 0

	for (let index = 0; index < rawLines.length; index += 1) {
		const rawLine = rawLines[index] ?? ''
		lines.push(...wrapRawLine(rawLine, offset, normalizedWidth))
		offset += rawLine.length

		if (index < rawLines.length - 1) {
			offset += 1
		}
	}

	if (lines.length === 0) {
		lines.push({ text: '', start: 0, end: 0, width: 0 })
	}

	return lines
}
