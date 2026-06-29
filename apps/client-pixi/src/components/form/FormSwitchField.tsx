import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Switch } from '../ui'
import { FormField } from './FormField'

type FormSwitchFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = {
	control: Control<TFieldValues>
	name: TName
	label?: string
	helperText?: string
	text?: string
	textColor?: number
	size?: number
	disabled?: boolean
	layout?: Record<string, unknown>
	switchLayout?: Record<string, unknown>
}

export const FormSwitchField = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	helperText,
	text,
	textColor,
	size,
	disabled,
	layout,
	switchLayout,
}: FormSwitchFieldProps<TFieldValues, TName>) => {
	const { field, fieldState } = useController({
		control,
		name,
		disabled,
	})

	return (
		<FormField
			label={label}
			helperText={helperText}
			error={fieldState.error?.message}
			reserveMessageSpace
			layout={layout}
		>
			<Switch
				enabled={Boolean(field.value)}
				text={text}
				textColor={textColor}
				size={size}
				disabled={field.disabled}
				invalid={fieldState.invalid}
				onChange={(nextValue) => {
					field.onChange(nextValue)
					field.onBlur()
				}}
				layout={switchLayout}
			/>
		</FormField>
	)
}
