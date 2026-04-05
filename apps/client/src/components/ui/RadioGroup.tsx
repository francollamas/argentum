import { extend } from '@pixi/react'
import { BitmapText, Sprite } from 'pixi.js'
import type { FC } from 'react'
import { FONTS } from '../../config/typography'
import { useUITexture } from '../../hooks/useUITexture'

extend({ Sprite, BitmapText })

type RadioGroupItem = {
	text: string
}

type RadioGroupProps = {
	x?: number
	y?: number
	items: RadioGroupItem[]
	selectedIndex?: number
	onChange?: (selectedIndex: number) => void
	scale?: number
	type?: 'vertical' | 'horizontal'
	elementsMargin?: number
}

export const RadioGroup: FC<RadioGroupProps> = ({
	x,
	y,
	items,
	selectedIndex = 0,
	onChange,
	scale = 1,
	type = 'vertical',
	elementsMargin = 15,
}) => {
	const uncheckedTexture = useUITexture('radio-unchecked')
	const checkedTexture = useUITexture('radio-checked')

	const fontConfig = FONTS.checkbox
	const iconW = uncheckedTexture.width
	const iconH = uncheckedTexture.height
	const itemH = Math.max(iconH, fontConfig.fontSize)
	const itemW = iconW + 8 + fontConfig.fontSize * 6

	// Pre-scale total bounding box so parent layout knows the occupied space
	const totalWidth =
		type === 'horizontal'
			? items.length * itemW + (items.length - 1) * elementsMargin
			: itemW
	const totalHeight =
		type === 'vertical'
			? items.length * itemH + (items.length - 1) * elementsMargin
			: itemH

	return (
		<pixiContainer
			x={x}
			y={y}
			scale={scale}
			layout={{ width: totalWidth, height: totalHeight }}
		>
			{items.map((item, index) => {
				const isSelected = index === selectedIndex
				const texture = isSelected ? checkedTexture : uncheckedTexture
				const offsetX =
					type === 'horizontal' ? index * (itemW + elementsMargin) : 0
				const offsetY =
					type === 'vertical' ? index * (itemH + elementsMargin) : 0

				return (
					<pixiContainer
						key={item.text}
						x={offsetX}
						y={offsetY}
						eventMode='static'
						cursor='pointer'
						onPointerDown={() => onChange?.(index)}
					>
						<pixiSprite texture={texture} y={Math.round((itemH - iconH) / 2)} />
						<pixiBitmapText
							x={iconW + 8}
							y={Math.round((itemH - fontConfig.fontSize) / 2)}
							text={item.text}
							style={{
								fontFamily: fontConfig.fontFamily,
								fontSize: fontConfig.fontSize,
								fill: 0xffffff,
							}}
						/>
					</pixiContainer>
				)
			})}
		</pixiContainer>
	)
}
