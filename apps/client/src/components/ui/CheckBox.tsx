import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useUITexture } from '../../hooks/useUITexture'
import { Colors } from './colors'
import { Label } from './Label'

type CheckBoxVariant = 'normal' | 'radio'

type CheckBoxProps = {
	checked?: boolean
	onChange?: (checked: boolean) => void
	variant?: CheckBoxVariant
	text?: string
	textColor?: number
	size?: number
	disabled?: boolean
	invalid?: boolean
	layout?: Record<string, unknown>
}

export const CheckBox: FC<CheckBoxProps> = ({
	checked = false,
	onChange,
	variant = 'normal',
	text,
	textColor = 0xffffff,
	size = 36,
	disabled = false,
	invalid = false,
	layout,
}) => {
	const prefix = variant === 'radio' ? 'radio' : 'checkbox'
	const uncheckedTexture = useUITexture(`${prefix}-unchecked`)
	const checkedTexture = useUITexture(`${prefix}-checked`)
	const texture = checked ? checkedTexture : uncheckedTexture

	const handleToggle = () => {
		if (!disabled) {
			onChange?.(!checked)
		}
	}

	const resolvedTextColor = disabled
		? Colors.disabled
		: invalid
			? Colors.statusError
			: textColor

	return (
		<layoutContainer
			eventMode='static'
			cursor={disabled ? 'default' : 'pointer'}
			onPointerDown={handleToggle}
			alpha={disabled ? 0.6 : 1}
			layout={{
				...tw`flex-row items-center`,
				gap: text ? 8 : 0,
				...layout,
			}}
		>
			<pixiSprite
				texture={texture}
				width={size}
				height={size}
				tint={invalid && !disabled ? Colors.statusError : 0xffffff}
				layout={{
					width: size,
					height: size,
					flexShrink: 0,
				}}
			/>
			{text && (
				<Label
					text={text}
					font='label'
					color={resolvedTextColor}
					layout={{
						minWidth: 0,
					}}
				/>
			)}
		</layoutContainer>
	)
}
