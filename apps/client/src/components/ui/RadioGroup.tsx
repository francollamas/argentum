import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { CheckBox } from './CheckBox'

type RadioGroupItem = {
	text: string
}

type RadioGroupProps = {
	items: RadioGroupItem[]
	selectedIndex?: number
	onChange?: (selectedIndex: number) => void
	direction?: 'vertical' | 'horizontal'
	gap?: number
	textColor?: number
	layout?: Record<string, unknown>
}

export const RadioGroup: FC<RadioGroupProps> = ({
	items,
	selectedIndex = 0,
	onChange,
	direction = 'vertical',
	gap = 8,
	textColor = 0xffffff,
	layout,
}) => {
	return (
		<layoutContainer
			layout={{
				...(direction === 'vertical' ? tw`flex-col` : tw`flex-row`),
				gap,
				...layout,
			}}
		>
			{items.map((item, index) => {
				return (
					<CheckBox
						key={item.text}
						variant='radio'
						checked={index === selectedIndex}
						onChange={() => onChange?.(index)}
						text={item.text}
						textColor={textColor}
					/>
				)
			})}
		</layoutContainer>
	)
}
