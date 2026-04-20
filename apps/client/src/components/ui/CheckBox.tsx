import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useUITexture } from '../../hooks/useUITexture'
import { Label } from './Label'

type CheckBoxVariant = 'normal' | 'radio'

type CheckBoxProps = {
	checked?: boolean
	onChange?: (checked: boolean) => void
	variant?: CheckBoxVariant
	text?: string
	textColor?: number
	size?: number
	layout?: Record<string, unknown>
}

export const CheckBox: FC<CheckBoxProps> = ({
	checked = false,
	onChange,
	variant = 'normal',
	text,
	textColor = 0xffffff,
	size = 36,
	layout,
}) => {
	const prefix = variant === 'radio' ? 'radio' : 'checkbox'
	const uncheckedTexture = useUITexture(`${prefix}-unchecked`)
	const checkedTexture = useUITexture(`${prefix}-checked`)
	const texture = checked ? checkedTexture : uncheckedTexture

	const handleToggle = () => onChange?.(!checked)

	return (
		<layoutContainer
			eventMode='static'
			cursor='pointer'
			onPointerDown={handleToggle}
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
					color={textColor}
					layout={{
						minWidth: 0,
					}}
				/>
			)}
		</layoutContainer>
	)
}
