import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { useUITexture } from '../../hooks/useUITexture'
import { Label } from './Label'

type SwitchProps = {
	enabled?: boolean
	onChange?: (enabled: boolean) => void
	text?: string
	textColor?: number
	size?: number
	layout?: Record<string, unknown>
}

export const Switch: FC<SwitchProps> = ({
	enabled = false,
	onChange,
	text,
	textColor = 0xffffff,
	size = 44,
	layout,
}) => {
	const offTexture = useUITexture('switch-off')
	const onTexture = useUITexture('switch-on')
	const texture = enabled ? onTexture : offTexture
	const referenceTexture = onTexture.width > 1 ? onTexture : offTexture
	const aspectRatio =
		referenceTexture.width > 0 && referenceTexture.height > 0
			? referenceTexture.width / referenceTexture.height
			: 1
	const switchHeight = size
	const switchWidth = Math.round(switchHeight * aspectRatio)

	const handleToggle = () => onChange?.(!enabled)

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
				width={switchWidth}
				height={switchHeight}
				layout={{
					width: switchWidth,
					height: switchHeight,
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
