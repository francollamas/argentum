import { tw } from '@pixi/layout/tailwind'
import type { FC, ReactNode } from 'react'
import { Button } from './Button'
import { Window } from './Window'

type DialogAction = {
	text: string
	onPress?: () => void
	variant?: 'normal' | 'small'
	disabled?: boolean
}

type DialogProps = {
	visible: boolean
	title: string
	children?: ReactNode
	actions?: DialogAction[]
	onClose?: () => void
	width?: number
	height?: number
	layout?: Record<string, unknown>
	backgroundContent?: ReactNode
}

const ACTION_BUTTON_WIDTH = 180

export const Dialog: FC<DialogProps> = ({
	visible,
	title,
	children,
	actions = [],
	onClose,
	width,
	height,
	layout,
	backgroundContent,
}) => {
	return (
		<Window
			visible={visible}
			title={title}
			onClose={onClose}
			width={width}
			height={height}
			layout={layout}
			backgroundContent={backgroundContent}
		>
			<layoutContainer
				layout={{
					...tw`w-full flex-col`,
					...(height != null ? { flex: 1 } : {}),
					gap: 16,
				}}
			>
				<layoutContainer
					layout={{
						...tw`w-full flex-col`,
						...(height != null ? { flex: 1 } : {}),
						gap: 12,
					}}
				>
					{children}
				</layoutContainer>
				{actions.length > 0 ? (
					<layoutContainer
						layout={{
							...tw`w-full flex-row justify-between`,
							flexWrap: 'nowrap',
							gap: 12,
							flexShrink: 0,
						}}
					>
						{actions.map((action) => (
							<Button
								key={action.text}
								text={action.text}
								width={ACTION_BUTTON_WIDTH}
								variant={action.variant}
								disabled={action.disabled}
								onPress={action.onPress}
							/>
						))}
					</layoutContainer>
				) : null}
			</layoutContainer>
		</Window>
	)
}
