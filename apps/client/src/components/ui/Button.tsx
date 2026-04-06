import { tw } from '@pixi/layout/tailwind'
import type { Container } from 'pixi.js'
import { NineSliceSprite } from 'pixi.js'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

type ButtonVariant = 'normal' | 'small'

type ButtonProps = {
	text: string
	width?: number
	height?: number
	onPress?: () => void
	textColor?: number
	variant?: ButtonVariant
	disabled?: boolean
	layoutStyle?: Record<string, unknown>
}

type ButtonStyleConfig = {
	sliceSize: number
	fontType: 'button' | 'buttonSm'
	paddingH: number
	paddingV: number
	minHeight: number
}

const BUTTON_STYLES: Record<ButtonVariant, ButtonStyleConfig> = {
	normal: {
		sliceSize: 14,
		fontType: 'button',
		paddingH: 14,
		paddingV: 11,
		minHeight: 45,
	},
	small: {
		sliceSize: 14,
		fontType: 'buttonSm',
		paddingH: 8,
		paddingV: 6,
		minHeight: 30,
	},
}

export const Button: FC<ButtonProps> = ({
	text,
	width,
	height,
	onPress,
	textColor = 0xffffff,
	variant = 'normal',
	disabled = false,
	layoutStyle,
}) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isPressed, setIsPressed] = useState(false)
	const containerRef = useRef<Container>(null)

	const defaultTexture = useUITexture('button-main-normal')
	const hoverTexture = useUITexture('button-main-hover')
	const pressedTexture = useUITexture('button-main-pressed')

	const style = BUTTON_STYLES[variant]
	const fontConfig = FONTS[style.fontType]

	const currentTexture =
		disabled || isPressed
			? pressedTexture
			: isHovered
				? hoverTexture
				: defaultTexture

	const bgSprite = useMemo(
		() =>
			new NineSliceSprite({
				texture: defaultTexture,
				leftWidth: style.sliceSize,
				topHeight: style.sliceSize,
				rightWidth: style.sliceSize,
				bottomHeight: style.sliceSize,
			}),
		[defaultTexture, style.sliceSize],
	)

	useEffect(() => {
		bgSprite.texture = currentTexture
	}, [bgSprite, currentTexture])

	const containerRefCallback = useCallback(
		(node: Container | null) => {
			const prev = containerRef.current

			if (prev) {
				prev.off('layout', onLayout)
				if (bgSprite.parent === prev) {
					prev.removeChild(bgSprite)
				}
			}

			containerRef.current = node

			if (node) {
				node.addChildAt(bgSprite, 0)
				node.on('layout', onLayout)
			}

			function onLayout() {
				if (!node?.layout) return
				const { width: cw, height: ch } = node.layout.computedLayout
				const textureLogicalH = defaultTexture.height
				const uniformScale = ch / textureLogicalH
				bgSprite.width = cw / uniformScale
				bgSprite.height = textureLogicalH
				bgSprite.scale.set(uniformScale)
			}
		},
		[bgSprite, defaultTexture],
	)

	return (
		<layoutContainer
			ref={containerRefCallback}
			layout={{
				...tw`items-center justify-center`,
				...(width != null ? { width } : {}),
				...(height != null ? { height } : {}),
				minHeight: style.minHeight,
				paddingLeft: style.paddingH,
				paddingRight: style.paddingH,
				paddingTop: style.paddingV,
				paddingBottom: style.paddingV,
				...layoutStyle,
			}}
			eventMode={disabled ? 'none' : 'static'}
			cursor={disabled ? 'default' : 'pointer'}
			alpha={disabled ? 0.5 : 1}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => {
				setIsHovered(false)
				setIsPressed(false)
			}}
			onPointerDown={() => setIsPressed(true)}
			onPointerUp={() => {
				setIsPressed(false)
				if (isHovered && onPress) {
					onPress()
				}
			}}
		>
			<pixiBitmapText
				text={text}
				style={{
					fontFamily: fontConfig.fontFamily,
					fontSize: fontConfig.fontSize,
					fill: textColor,
				}}
				layout={{
					width: 'intrinsic',
					height: 'intrinsic',
					flexShrink: 0,
				}}
				roundPixels
			/>
		</layoutContainer>
	)
}
