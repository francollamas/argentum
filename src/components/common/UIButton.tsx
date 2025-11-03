import { extend } from '@pixi/react'
import { FancyButton } from '@pixi/ui'
import { Graphics, Text, TextStyle, Container } from 'pixi.js'
import { type FC, useEffect, useRef, useMemo } from 'react'

extend({ Container })

type UIButtonProps = {
	text: string
	onClick: () => void
	width?: number
	height?: number
	disabled?: boolean
}

export const UIButton: FC<UIButtonProps> = ({
	text,
	onClick,
	width = 180,
	height = 40,
	disabled = false,
}) => {
	const containerRef = useRef<Container>(null)
	const buttonInstanceRef = useRef<FancyButton | null>(null)

	const textStyle = useMemo(
		() =>
			new TextStyle({
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				fontSize: 14,
				fill: disabled ? 0x666666 : 0xe8e4d9,
				fontWeight: 'normal',
			}),
		[disabled],
	)

	const defaultView = useMemo(() => {
		const container = new Container()
		const bg = new Graphics().roundRect(0, 0, width, height, 4).fill(disabled ? 0x4a4a4a : 0x7b5537)
		const textElement = new Text({ text, style: textStyle })
		textElement.anchor.set(0.5)
		textElement.position.set(width / 2, height / 2)

		container.addChild(bg, textElement)
		return container
	}, [width, height, text, textStyle, disabled])

	const hoverView = useMemo(() => {
		if (disabled) return undefined

		const container = new Container()
		const bg = new Graphics().roundRect(0, 0, width, height, 4).fill(0xc9a227)
		const textElement = new Text({ text, style: textStyle })
		textElement.anchor.set(0.5)
		textElement.position.set(width / 2, height / 2)

		container.addChild(bg, textElement)
		return container
	}, [width, height, text, textStyle, disabled])

	const pressedView = useMemo(() => {
		if (disabled) return undefined

		const container = new Container()
		const bg = new Graphics().roundRect(0, 0, width, height, 4).fill(0xa8851f)
		const textElement = new Text({ text, style: textStyle })
		textElement.anchor.set(0.5)
		textElement.position.set(width / 2, height / 2)

		container.addChild(bg, textElement)
		return container
	}, [width, height, text, textStyle, disabled])

	useEffect(() => {
		if (!containerRef.current) return

		const button = new FancyButton({
			defaultView,
			hoverView,
			pressedView,
		})

		button.enabled = !disabled
		buttonInstanceRef.current = button
		containerRef.current.addChild(button)

		const handlePress = () => {
			if (!disabled) {
				onClick()
			}
		}

		button.onPress.connect(handlePress)

		return () => {
			button.onPress.disconnect(handlePress)
			if (containerRef.current) {
				containerRef.current.removeChild(button)
			}
			button.destroy()
		}
	}, [defaultView, hoverView, pressedView, disabled, onClick])

	return (
		<pixiContainer
			ref={containerRef}
			layout={{
				width,
				height,
			}}
		/>
	)
}
