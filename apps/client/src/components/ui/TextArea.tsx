import type { LayoutOptions } from '@pixi/layout'
import { useApplication } from '@pixi/react'
import type { Bounds, Container, NineSliceSprite } from 'pixi.js'
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react'
import { FONTS } from '../../config/typography'
import { useDomOverlayHost } from '../../hooks/useDomOverlayHost'
import { useIsDomOverlayOccluded } from '../../hooks/useOverlayLayer'
import { useOverlayPositionSync } from '../../hooks/useOverlayPositionSync'
import { usePixiLayoutListener } from '../../hooks/usePixiLayoutListener'
import { useUITexture } from '../../hooks/useUITexture'
import { Colors } from './colors'
import { DomEditor } from './editor/DomEditor'
import { EditorVisuals } from './editor/EditorVisuals'
import { buildEditorStyleBundle, buildTextStyle } from './editor/editorStyles'
import { useDomEditorEvents } from './editor/useDomEditorEvents'

export type TextAreaHandle = {
	focus: () => void
	blur: () => void
}

type TextAreaProps = {
	width?: number
	height?: number
	placeholder?: string
	value?: string
	maxLength?: number
	align?: 'left' | 'center' | 'right'
	textColor?: number
	disabled?: boolean
	invalid?: boolean
	onChange?: (value: string) => void
	onBlur?: () => void
	layout?: Record<string, unknown>
}

const TEXTAREA_FONT_SIZE = FONTS.body.fontSize
const TEXTAREA_FONT_FAMILY = FONTS.body.fontFamily
const TEXTAREA_DOM_FONT_FAMILY = FONTS.body.domFontFamily

export const TextArea = forwardRef<TextAreaHandle, TextAreaProps>(
	function TextArea(
		{
			width,
			height = 120,
			placeholder = '',
			value = '',
			maxLength,
			align = 'left',
			textColor = 0xffffff,
			disabled = false,
			invalid = false,
			onChange,
			onBlur,
			layout,
		},
		ref,
	) {
		const { app } = useApplication()
		const backgroundSpriteRef = useRef<NineSliceSprite | null>(null)
		const domTextAreaRef = useRef<HTMLTextAreaElement | null>(null)
		const [focused, setFocused] = useState(false)
		const isDomOverlayOccluded = useIsDomOverlayOccluded()

		const inputTexture = useUITexture('input-field')
		const { hostElement, overlayRoot } = useDomOverlayHost(app)
		const snapshot = useDomEditorEvents(domTextAreaRef, 'textarea')

		useImperativeHandle(
			ref,
			() => ({
				focus: () => domTextAreaRef.current?.focus(),
				blur: () => domTextAreaRef.current?.blur(),
			}),
			[],
		)

		useEffect(() => {
			if (disabled || isDomOverlayOccluded) {
				domTextAreaRef.current?.blur()
				setFocused(false)
			}
		}, [disabled, isDomOverlayOccluded])

		const textStyle = useMemo(
			() =>
				buildTextStyle({
					fontFamily: TEXTAREA_FONT_FAMILY,
					domFontFamily: TEXTAREA_DOM_FONT_FAMILY,
					fontSize: TEXTAREA_FONT_SIZE,
					renderedHeight: height,
					align,
					textColor,
					disabled,
					kind: 'textarea',
				}),
			[align, disabled, height, textColor],
		)

		const computeOverlayStyle = useCallback(
			({
				bounds,
				canvasRect,
				containerRect,
			}: {
				bounds: Bounds
				canvasRect: DOMRect
				containerRect: DOMRect
			}) => {
				return buildEditorStyleBundle(
					{
						bounds: {
							x: bounds.x,
							y: bounds.y,
							width: bounds.width,
							height: bounds.height,
						},
						canvasRect,
						containerRect,
						zIndex: 999,
						disabled,
					},
					textStyle,
				).boxStyle
			},
			[disabled, textStyle],
		)

		const { style: domTextAreaStyle, scheduleSync: scheduleOverlaySync } =
			useOverlayPositionSync({
				app,
				hostElement,
				targetRef: backgroundSpriteRef,
				computeStyle: computeOverlayStyle,
			})

		const { refCallback: textAreaContainerRef } =
			usePixiLayoutListener<Container>(scheduleOverlaySync)

		const box = useMemo(() => ({ width: width ?? 0, height }), [width, height])

		useEffect(() => {
			overlayRoot?.render(
				isDomOverlayOccluded ? null : (
					<DomEditor
						kind='textarea'
						style={domTextAreaStyle}
						value={value}
						textareaRef={domTextAreaRef}
						maxLength={maxLength}
						disabled={disabled}
						onChange={onChange}
						onFocus={() => setFocused(true)}
						onBlur={() => {
							setFocused(false)
							onBlur?.()
						}}
					/>
				),
			)
		}, [
			disabled,
			domTextAreaStyle,
			isDomOverlayOccluded,
			maxLength,
			onBlur,
			onChange,
			overlayRoot,
			value,
		])

		const rootLayout = {
			...(width != null ? { width } : { width: '100%' }),
			height,
			minHeight: height,
			minWidth: width ?? 240,
			position: 'relative' as const,
			...layout,
		} as unknown as Omit<LayoutOptions, 'target'>

		return (
			<layoutContainer
				ref={textAreaContainerRef}
				eventMode='static'
				cursor={disabled ? 'default' : 'text'}
				onPointerDown={() => {
					if (!disabled && !isDomOverlayOccluded) {
						domTextAreaRef.current?.focus()
					}
				}}
				layout={rootLayout}
				alpha={disabled ? 0.7 : 1}
			>
				<pixiNineSliceSprite
					ref={backgroundSpriteRef}
					texture={inputTexture}
					leftWidth={10}
					topHeight={10}
					rightWidth={10}
					bottomHeight={10}
					tint={
						disabled
							? Colors.disabled
							: invalid
								? Colors.statusError
								: focused
									? 0xffffff
									: 0xcccccc
					}
					layout={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						applySizeDirectly: true,
					}}
				/>
				<EditorVisuals
					kind='textarea'
					snapshot={snapshot}
					propValue={value}
					placeholder={placeholder}
					textStyle={textStyle}
					box={box}
				/>
			</layoutContainer>
		)
	},
)
