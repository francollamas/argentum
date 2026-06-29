import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { RadioGroup } from '../ui'
import { FormField } from './FormField'

type FormRadioGroupItem = {
	text: string
	value: string
}

type FormRadioGroupFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = {
	control: Control<TFieldValues>
	name: TName
	items: FormRadioGroupItem[]
	label?: string
	helperText?: string
	direction?: 'vertical' | 'horizontal'
	gap?: number
	textColor?: number
	disabled?: boolean
	layout?: Record<string, unknown>
	radioGroupLayout?: Record<string, unknown>
}

export const FormRadioGroupField = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
>({
	control,
	name,
	items,
	label,
	helperText,
	direction,
	gap,
	textColor,
	disabled,
	layout,
	radioGroupLayout,
}: FormRadioGroupFieldProps<TFieldValues, TName>) => {
	const { field, fieldState } = useController({
		control,
		name,
		disabled,
	})

	const selectedIndex = items.findIndex((item) => item.value === field.value)

	return (
		<FormField
			label={label}
			helperText={helperText}
			error={fieldState.error?.message}
			reserveMessageSpace
			layout={layout}
		>
			<RadioGroup
				items={items}
				selectedIndex={selectedIndex >= 0 ? selectedIndex : null}
				direction={direction}
				gap={gap}
				textColor={textColor}
				disabled={field.disabled}
				invalid={fieldState.invalid}
				onChange={(nextIndex) => {
					const nextItem = items[nextIndex]
					if (!nextItem) {
						return
					}

					field.onChange(nextItem.value)
					field.onBlur()
				}}
				layout={radioGroupLayout}
			/>
		</FormField>
	)
}
