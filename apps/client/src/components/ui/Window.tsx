import { tw } from '@pixi/layout/tailwind'
import { BlurFilter, Rectangle } from 'pixi.js'
import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'
import { useScreenMetrics } from '../../store/viewportStore'
import { CloseButton } from './CloseButton'
import { Colors } from './colors'
import { Label } from './Label'
import { Panel } from './Panel'

type WindowProps = {
	visible: boolean
	title: string
	children?: ReactNode
	onClose?: () => void
	width?: number
	height?: number
	layout?: Record<string, unknown>
	backgroundContent?: ReactNode
}

const DEFAULT_WIDTH = 560
const DEFAULT_BLUR = 4
const HEADER_CLOSE_BUTTON_SIZE = 52

export const Window: FC<WindowProps> = ({
	visible,
	title,
	children,
	onClose,
	width = DEFAULT_WIDTH,
	height,
	layout,
	backgroundContent,
}) => {
	const { screenWidth, screenHeight } = useScreenMetrics()
	const blurFilter = useMemo(
		() =>
			new BlurFilter({
				strength: DEFAULT_BLUR,
				quality: 4,
				kernelSize: 5,
			}),
		[],
	)
	const filterArea = useMemo(
		() => new Rectangle(0, 0, screenWidth, screenHeight),
		[screenHeight, screenWidth],
	)

	if (!visible && !backgroundContent) {
		return null
	}

	return (
		<layoutContainer
			layout={{
				...tw`w-full h-full`,
				position: 'relative',
			}}
		>
			{backgroundContent ? (
				<layoutContainer
					layout={{
						...tw`w-full h-full`,
						position: 'absolute',
						left: 0,
						top: 0,
					}}
					filters={visible ? [blurFilter] : undefined}
					filterArea={filterArea}
				>
					{backgroundContent}
				</layoutContainer>
			) : null}
			{visible ? (
				<layoutContainer
					layout={{
						...tw`w-full h-full items-center justify-center`,
						position: backgroundContent ? 'absolute' : 'relative',
						left: backgroundContent ? 0 : undefined,
						top: backgroundContent ? 0 : undefined,
					}}
					eventMode='static'
				>
					<layoutContainer
						layout={{
							position: 'absolute',
							left: 0,
							top: 0,
							width: '100%',
							height: '100%',
							backgroundColor: Colors.backgroundDark,
						}}
						alpha={0.72}
					/>
					<Panel
						layout={{
							width,
							...(height != null ? { height } : {}),
							maxWidth: Math.max(280, screenWidth - 80),
							maxHeight: Math.max(220, screenHeight - 80),
							gap: 16,
							padding: 20,
							...layout,
						}}
					>
						<layoutContainer
							layout={{
								...tw`w-full flex-row items-center justify-between`,
								gap: 16,
								flexShrink: 0,
							}}
						>
							<Label
								text={title}
								font='titleSm'
								color={Colors.gold}
								layout={{ flex: 1 }}
							/>
							<CloseButton size={HEADER_CLOSE_BUTTON_SIZE} onPress={onClose} />
						</layoutContainer>
						<layoutContainer
							layout={{
								...tw`w-full flex-col`,
								...(height != null ? { flex: 1 } : {}),
								gap: 12,
							}}
						>
							{children}
						</layoutContainer>
					</Panel>
				</layoutContainer>
			) : null}
		</layoutContainer>
	)
}
