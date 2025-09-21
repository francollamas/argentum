import type { FC } from 'react'
import { extend } from '@pixi/react'
import { BitmapText } from 'pixi.js'

extend({ BitmapText })

type TextProps = {
    text: string
    x: number
    y: number
    bold?: boolean
    border?: boolean
    color?: number
} & Record<string, any>

export const Text: FC<TextProps> = ({ text, x, y, bold = false, border = false, color = 0xffffff, ...props }) => {
    let fontFamily = 'tahoma13'
    if (bold) fontFamily += '-bold'
    if (border) fontFamily += '-border'

    return (
        <pixiBitmapText
            text={text}
            x={x}
            y={y}
            style={{
                fontFamily,
                fontSize: 13,
                fill: color,
            }}
            {...props}
        />
    )
}