import { tw } from '@pixi/layout/tailwind'
import type { ReactNode } from 'react'
import { Colors, Label } from '../ui'

type FormFieldProps = {
	label?: string
	helperText?: string
	error?: string
	reserveMessageSpace?: boolean
	children: ReactNode
	layout?: Record<string, unknown>
}

export const FormField = ({
	label,
	helperText,
	error,
	reserveMessageSpace = false,
	children,
	layout,
}: FormFieldProps) => {
	return (
		<layoutContainer
			layout={{
				...tw`w-full flex-col`,
				gap: 6,
				...layout,
			}}
		>
			{label ? (
				<Label text={label} font='label' color={Colors.metalHighlight} />
			) : null}
			{children}
			{error ? (
				<Label text={error} font='labelSm' color={Colors.statusError} />
			) : helperText ? (
				<Label text={helperText} font='labelSm' color={Colors.silver} />
			) : reserveMessageSpace ? (
				<layoutContainer alpha={0}>
					<Label text='.' font='labelSm' color={Colors.silver} />
				</layoutContainer>
			) : null}
		</layoutContainer>
	)
}
