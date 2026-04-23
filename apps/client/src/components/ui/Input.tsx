import type { LayoutOptions } from '@pixi/layout'
import { useApplication } from '@pixi/react'
import type { Bounds, Container, NineSliceSprite } from 'pixi.js'
import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FONTS } from '../../config/typography'
import { useDomOverlayHost } from '../../hooks/useDomOverlayHost'
import { useOverlayPositionSync } from '../../hooks/useOverlayPositionSync'
import { usePixiLayoutListener } from '../../hooks/usePixiLayoutListener'
import { useUITexture } from '../../hooks/useUITexture'
import { DomInputOverlay } from './DomInputOverlay'

type InputProps = {
	width?: number
	height?: number
	placeholder?: string
	value?: string
	maxLength?: number
	secure?: boolean
	align?: 'left' | 'center' | 'right'
	textColor?: number
	onChange?: (value: string) => void
	onEnter?: (value: string) => void
	layout?: Record<string, unknown>
}

const toCssColor = (value: number) => `#${value.toString(16).padStart(6, '0')}`

type DomInputStyle = CSSProperties & {
	'--input-placeholder-color': string
}

const INPUT_DOM_FONT_FAMILY = FONTS.input.domFontFamily
const INPUT_FONT_SIZE = FONTS.input.fontSize

export const Input: FC<InputProps> = ({
	width,
	height = 40,
	placeholder = '',
	value = '',
	maxLength,
	secure = false,
	align = 'left',
	textColor = 0xffffff,
	onChange,
	onEnter,
	layout,
}) => {
	const { app } = useApplication()
	const backgroundSpriteRef = useRef<NineSliceSprite | null>(null)
	const [active, setActive] = useState(false)

	const inputTexture = useUITexture('input-field')
	const { hostElement, overlayRoot } = useDomOverlayHost(app)

	const computeOverlayStyle = useCallback(
		({
			bounds,
			canvasRect,
			containerRect,
		}: {
			bounds: Bounds
			canvasRect: DOMRect
			containerRect: DOMRect
		}): DomInputStyle => {
			const left = canvasRect.left - containerRect.left + bounds.x
			const top = canvasRect.top - containerRect.top + bounds.y
			const renderedHeight = bounds.height
			const domScale = height > 0 ? renderedHeight / height : 1
			const paddingInline = Math.max(8, 12 * domScale)
			const fontSize = Math.max(12, INPUT_FONT_SIZE * domScale)
			const lineHeight = Math.max(1, renderedHeight - 2)
			const borderRadius = Math.max(6, 6 * domScale)

			return {
				position: 'absolute',
				top,
				left,
				width: bounds.width,
				height: renderedHeight,
				padding: `0 ${paddingInline}px`,
				margin: 0,
				boxSizing: 'border-box',
				border: 'none',
				borderRadius,
				background: 'transparent',
				color: toCssColor(textColor),
				caretColor: toCssColor(textColor),
				textAlign: align,
				fontSize,
				fontFamily: INPUT_DOM_FONT_FAMILY,
				lineHeight: `${lineHeight}px`,
				appearance: 'none',
				outline: 'none',
				pointerEvents: 'auto',
				zIndex: 999,
				'--input-placeholder-color': '#888888',
			}
		},
		[align, height, textColor],
	)

	const { style: domInputStyle, scheduleSync: scheduleOverlaySync } =
		useOverlayPositionSync({
			app,
			hostElement,
			targetRef: backgroundSpriteRef,
			computeStyle: computeOverlayStyle,
		})

	const { refCallback: inputContainerRef } =
		usePixiLayoutListener<Container>(scheduleOverlaySync)

	useEffect(() => {
		overlayRoot?.render(
			<DomInputOverlay
				style={domInputStyle}
				placeholder={placeholder}
				value={value}
				maxLength={maxLength}
				secure={secure}
				onChange={onChange}
				onEnter={onEnter}
				onFocus={() => setActive(true)}
				onBlur={() => setActive(false)}
			/>,
		)
	}, [
		domInputStyle,
		maxLength,
		onChange,
		onEnter,
		overlayRoot,
		placeholder,
		secure,
		value,
	])

	const rootLayout = {
		...(width != null ? { width } : { width: '100%' }),
		height,
		minHeight: height,
		minWidth: width ?? 200,
		position: 'relative' as const,
		...layout,
	} as unknown as Omit<LayoutOptions, 'target'>

	return (
		<layoutContainer
			ref={inputContainerRef}
			eventMode='static'
			cursor='text'
			layout={rootLayout}
		>
			<pixiNineSliceSprite
				ref={backgroundSpriteRef}
				texture={inputTexture}
				leftWidth={10}
				topHeight={10}
				rightWidth={10}
				bottomHeight={10}
				tint={active ? 0xffffff : 0xcccccc}
				layout={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					applySizeDirectly: true,
				}}
			/>
		</layoutContainer>
	)
}
