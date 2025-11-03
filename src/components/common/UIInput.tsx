import { extend } from '@pixi/react'
import { Input } from '@pixi/ui'
import { Container, Graphics, TextStyle } from 'pixi.js'
import { type FC, useEffect, useRef, useMemo } from 'react'

extend({ Container, Graphics })

type UIInputProps = {
	placeholder: string
	value: string
	onChange: (value: string) => void
	password?: boolean
	width?: number | string
	height?: number
}

export const UIInput: FC<UIInputProps> = ({
	placeholder,
	value,
	onChange,
	password = false,
	width = '100%',
	height = 32,
}) => {
	const containerRef = useRef<Container>(null)
	const inputInstanceRef = useRef<Input | null>(null)
	const numericWidth = typeof width === 'string' ? 200 : width

	const bg = useMemo(
		() => new Graphics().rect(0, 0, numericWidth, height).fill(0x1a1a1a),
		[numericWidth, height],
	)

	useEffect(() => {
		if (!containerRef.current) return

		const input = new Input({
			bg,
			textStyle: new TextStyle({
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				fontSize: 12,
				fill: 0xe8e4d9,
			}),
			placeholder,
			value,
			secure: password,
			align: 'left',
			padding: 8,
			addMask: true,
		})

		inputInstanceRef.current = input
		containerRef.current.addChild(input)

		const handleChange = (val: string) => {
			onChange(val)
		}

		input.onChange.connect(handleChange)

		return () => {
			input.onChange.disconnect(handleChange)
			if (containerRef.current) {
				containerRef.current.removeChild(input)
			}
			input.destroy()
		}
	}, [bg, placeholder, password, onChange])

	useEffect(() => {
		if (inputInstanceRef.current) {
			inputInstanceRef.current.value = value
		}
	}, [value])

	return (
		<pixiContainer
			ref={containerRef}
			layout={{
				width: numericWidth,
				height,
			}}
		/>
	)
}
