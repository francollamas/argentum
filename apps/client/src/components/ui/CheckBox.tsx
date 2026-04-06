import type { Graphics } from 'pixi.js'
import type { FC } from 'react'
import { useCallback } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

type CheckBoxVariant = 'normal' | 'radio'

type CheckBoxProps = {
	x?: number
	y?: number
	checked?: boolean
	onChange?: (checked: boolean) => void
	variant?: CheckBoxVariant
	scale?: number
	text?: string
	textColor?: number
}

export const CheckBox: FC<CheckBoxProps> = ({
	x,
	y,
	checked = false,
	onChange,
	variant = 'normal',
	scale = 1,
	text,
	textColor = 0xffffff,
}) => {
	const prefix = variant === 'radio' ? 'radio' : 'checkbox'
	const uncheckedTexture = useUITexture(`${prefix}-unchecked`)
	const checkedTexture = useUITexture(`${prefix}-checked`)

	const fontConfig = FONTS.label
	const texture = checked ? checkedTexture : uncheckedTexture

	const handleToggle = () => onChange?.(!checked)

	const iconW = Math.round(texture.width * scale)
	const iconH = Math.round(texture.height * scale)
	const fontSize = Math.round(fontConfig.fontSize * scale)
	const textW = text ? fontSize * text.length * 0.6 : 0
	const gap = Math.round(8 * scale)
	const layoutWidth = text ? iconW + gap + textW : iconW
	const layoutHeight = iconH

	const drawHitRect = useCallback(
		(g: Graphics) => {
			g.clear()
			g.rect(0, 0, layoutWidth, layoutHeight).fill({
				color: 0xffffff,
				alpha: 0,
			})
		},
		[layoutWidth, layoutHeight],
	)

	return (
		<pixiContainer
			x={x}
			y={y}
			eventMode='static'
			cursor='pointer'
			onPointerDown={handleToggle}
			layout={{ width: layoutWidth, height: layoutHeight }}
		>
			<pixiGraphics draw={drawHitRect} />
			<pixiSprite texture={texture} width={iconW} height={iconH} />
			{text && (
				<pixiBitmapText
					x={iconW + gap}
					y={iconH / 2}
					anchor={{ x: 0, y: 0.5 }}
					text={text}
					style={{
						fontFamily: fontConfig.fontFamily,
						fontSize: fontSize,
						fill: textColor,
					}}
				/>
			)}
		</pixiContainer>
	)
}
