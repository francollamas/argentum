import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { TextArea } from '../ui'
import { FormField } from './FormField'

type FormTextAreaFieldProps<
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
	align?: 'left' | 'center' | 'right'
	textColor?: number
	disabled?: boolean
	layout?: Record<string, unknown>
	inputLayout?: Record<string, unknown>
}

export const FormTextAreaField = <
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
	align,
	textColor,
	disabled,
	layout,
	inputLayout,
}: FormTextAreaFieldProps<TFieldValues, TName>) => {
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
			<TextArea
				ref={field.ref}
				width={width}
				height={height}
				placeholder={placeholder}
				value={String(field.value ?? '')}
				maxLength={maxLength}
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
