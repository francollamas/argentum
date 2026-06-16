import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { CheckBox } from './CheckBox'

type RadioGroupItem = {
	text: string
}

type RadioGroupProps = {
	items: RadioGroupItem[]
	selectedIndex?: number | null
	onChange?: (selectedIndex: number) => void
	direction?: 'vertical' | 'horizontal'
	gap?: number
	textColor?: number
	disabled?: boolean
	invalid?: boolean
	layout?: Record<string, unknown>
}

export const RadioGroup: FC<RadioGroupProps> = ({
	items,
	selectedIndex = null,
	onChange,
	direction = 'vertical',
	gap = 8,
	textColor = 0xffffff,
	disabled = false,
	invalid = false,
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
						disabled={disabled}
						invalid={invalid}
					/>
				)
			})}
		</layoutContainer>
	)
}
