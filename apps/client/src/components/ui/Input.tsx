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

export type InputHandle = {
	focus: () => void
	blur: () => void
}

type InputProps = {
	width?: number
	height?: number
	placeholder?: string
	value?: string
	maxLength?: number
	secure?: boolean
	align?: 'left' | 'center' | 'right'
	textColor?: number
	disabled?: boolean
	invalid?: boolean
	onChange?: (value: string) => void
	onBlur?: () => void
	onEnter?: (value: string) => void
	layout?: Record<string, unknown>
}

const INPUT_FONT_SIZE = FONTS.input.fontSize
const INPUT_FONT_FAMILY = FONTS.input.fontFamily
const INPUT_DOM_FONT_FAMILY = FONTS.input.domFontFamily

export const Input = forwardRef<InputHandle, InputProps>(function Input(
	{
		width,
		height = 40,
		placeholder = '',
		value = '',
		maxLength,
		secure = false,
		align = 'left',
		textColor = 0xffffff,
		disabled = false,
		invalid = false,
		onChange,
		onBlur,
		onEnter,
		layout,
	},
	ref,
) {
	const { app } = useApplication()
	const backgroundSpriteRef = useRef<NineSliceSprite | null>(null)
	const domInputRef = useRef<HTMLInputElement | null>(null)
	const [focused, setFocused] = useState(false)
	const isDomOverlayOccluded = useIsDomOverlayOccluded()

	const inputTexture = useUITexture('input-field')
	const { hostElement, overlayRoot } = useDomOverlayHost(app)
	const snapshot = useDomEditorEvents(domInputRef, 'input')

	useImperativeHandle(
		ref,
		() => ({
			focus: () => domInputRef.current?.focus(),
			blur: () => domInputRef.current?.blur(),
		}),
		[],
	)

	useEffect(() => {
		if (disabled || isDomOverlayOccluded) {
			domInputRef.current?.blur()
			setFocused(false)
		}
	}, [disabled, isDomOverlayOccluded])

	const textStyle = useMemo(
		() =>
			buildTextStyle({
				fontFamily: INPUT_FONT_FAMILY,
				domFontFamily: INPUT_DOM_FONT_FAMILY,
				fontSize: INPUT_FONT_SIZE,
				renderedHeight: height,
				align,
				textColor,
				disabled,
				kind: 'input',
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

	const { style: domInputStyle, scheduleSync: scheduleOverlaySync } =
		useOverlayPositionSync({
			app,
			hostElement,
			targetRef: backgroundSpriteRef,
			computeStyle: computeOverlayStyle,
		})

	const { refCallback: inputContainerRef } =
		usePixiLayoutListener<Container>(scheduleOverlaySync)

	const box = useMemo(() => ({ width: width ?? 0, height }), [width, height])

	useEffect(() => {
		overlayRoot?.render(
			isDomOverlayOccluded ? null : (
				<DomEditor
					kind='input'
					style={domInputStyle}
					value={value}
					inputRef={domInputRef}
					maxLength={maxLength}
					secure={secure}
					disabled={disabled}
					onChange={onChange}
					onEnter={onEnter}
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
		domInputStyle,
		isDomOverlayOccluded,
		maxLength,
		onChange,
		onBlur,
		onEnter,
		overlayRoot,
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
			cursor={disabled ? 'default' : 'text'}
			onPointerDown={() => {
				if (!disabled && !isDomOverlayOccluded) {
					domInputRef.current?.focus()
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
				kind='input'
				snapshot={snapshot}
				propValue={value}
				placeholder={placeholder}
				textStyle={textStyle}
				box={box}
			/>
		</layoutContainer>
	)
})
