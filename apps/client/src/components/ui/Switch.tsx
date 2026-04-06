import type { Graphics } from 'pixi.js'
import type { FC } from 'react'
import { useCallback } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

type SwitchProps = {
	x?: number
	y?: number
	enabled?: boolean
	onChange?: (enabled: boolean) => void
	scale?: number
	text?: string
	textColor?: number
}

export const Switch: FC<SwitchProps> = ({
	x,
	y,
	enabled = false,
	onChange,
	scale = 1,
	text,
	textColor = 0xffffff,
}) => {
	const offTexture = useUITexture('switch-off')
	const onTexture = useUITexture('switch-on')

	const fontConfig = FONTS.label
	const texture = enabled ? onTexture : offTexture

	const handleToggle = () => onChange?.(!enabled)

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
