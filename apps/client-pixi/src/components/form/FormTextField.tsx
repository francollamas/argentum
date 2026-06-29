import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Input } from '../ui'
import { FormField } from './FormField'

type FormTextFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = {
	control: Control<TFieldValues>
	name: TName
	label?: string
	helperText?: string
	placeholder?: string
	width?: number
	height?: number
	maxLength?: number
	secure?: boolean
	align?: 'left' | 'center' | 'right'
	textColor?: number
	disabled?: boolean
	layout?: Record<string, unknown>
	inputLayout?: Record<string, unknown>
}

export const FormTextField = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	helperText,
	placeholder,
	width,
	height,
	maxLength,
	secure,
	align,
	textColor,
	disabled,
	layout,
	inputLayout,
}: FormTextFieldProps<TFieldValues, TName>) => {
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
			layout={layout}
		>
			<Input
				ref={field.ref}
				width={width}
				height={height}
				placeholder={placeholder}
				value={String(field.value ?? '')}
				maxLength={maxLength}
				secure={secure}
				align={align}
				textColor={textColor}
				disabled={field.disabled}
				invalid={fieldState.invalid}
				onChange={field.onChange}
				onBlur={field.onBlur}
				layout={inputLayout}
			/>
		</FormField>
	)
}
