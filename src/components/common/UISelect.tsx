import { extend } from '@pixi/react'
import { Select } from '@pixi/ui'
import { Container, Graphics, TextStyle } from 'pixi.js'
import { type FC, useEffect, useRef } from 'react'

extend({ Container, Graphics })

type UISelectProps = {
	options: string[]
	value: string
	onChange: (value: string) => void
	width?: number | string
	height?: number
}

export const UISelect: FC<UISelectProps> = ({
	options,
	value,
	onChange,
	width = '100%',
	height = 32,
}) => {
	const containerRef = useRef<Container>(null)
	const selectInstanceRef = useRef<Select | null>(null)
	const numericWidth = typeof width === 'string' ? 200 : width

	useEffect(() => {
		if (!containerRef.current) return

		const selectedIndex = options.indexOf(value)

		const closedBG = new Graphics().rect(0, 0, numericWidth, height).fill(0x1a1a1a)
		const openBG = new Graphics().rect(0, 0, numericWidth, height).fill(0x3a3a3a)

		const select = new Select({
			closedBG,
			openBG,
			textStyle: new TextStyle({
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				fontSize: 12,
				fill: 0xcccccc,
				padding: 8,
			}),
			selected: selectedIndex >= 0 ? selectedIndex : 0,
			items: {
				items: options,
				backgroundColor: 0x2a2a2a,
				width: numericWidth,
				height: 30,
				hoverColor: 0xc9a227,
				textStyle: new TextStyle({
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
					fontSize: 12,
					fill: 0xcccccc,
					padding: 8,
				}),
				radius: 5,
			},
		})

		selectInstanceRef.current = select
		containerRef.current.addChild(select)

		const handleSelect = (_selectedId: number, selectedText: string) => {
			onChange(selectedText)
		}

		select.onSelect.connect(handleSelect)

		return () => {
			select.onSelect.disconnect(handleSelect)
			if (containerRef.current && containerRef.current.children.includes(select)) {
				containerRef.current.removeChild(select)
			}
			select.destroy({ children: true })
		}
	}, [options, numericWidth, height, value, onChange])

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
