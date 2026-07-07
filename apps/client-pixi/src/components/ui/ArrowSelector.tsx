import { tw } from '@pixi/layout/tailwind'
import type { FC } from 'react'
import { ArrowButton } from './ArrowButton'
import { Colors } from './colors'
import { Label } from './Label'

type ArrowSelectorItem = {
	text: string
}

type ArrowSelectorProps = {
	items: ArrowSelectorItem[]
	selectedIndex: number
	onChange?: (selectedIndex: number) => void
	disabled?: boolean
	textColor?: number
	size?: number
	gap?: number
	layout?: Record<string, unknown>
}

const DEFAULT_MIN_WIDTH = 280

const wrapIndex = (index: number, length: number) => {
	if (length <= 0) {
		return 0
	}

	return ((index % length) + length) % length
}

export const ArrowSelector: FC<ArrowSelectorProps> = ({
	items,
	selectedIndex,
	onChange,
	disabled = false,
	textColor = 0xffffff,
	size = 36,
	gap = 12,
	layout,
}) => {
	const itemCount = items.length
	const safeIndex = wrapIndex(selectedIndex, itemCount)
	const selectedItem = items[safeIndex]
	const canNavigate = itemCount > 1
	const labelColor = disabled ? Colors.disabled : textColor

	const handlePrevious = () => {
		if (itemCount === 0) {
			return
		}

		onChange?.(wrapIndex(safeIndex - 1, itemCount))
	}

	const handleNext = () => {
		if (itemCount === 0) {
			return
		}

		onChange?.(wrapIndex(safeIndex + 1, itemCount))
	}

	return (
		<layoutContainer
			layout={{
				...tw`w-full flex-row items-center justify-between`,
				alignSelf: 'stretch',
				minWidth: DEFAULT_MIN_WIDTH,
				gap,
				...layout,
			}}
		>
			<ArrowButton
				direction='left'
				size={size}
				onPress={handlePrevious}
				disabled={disabled || !canNavigate}
			/>
			<layoutContainer
				layout={{
					...tw`items-center justify-center`,
					flexGrow: 1,
					flexShrink: 1,
					flexBasis: 0,
					minWidth: 0,
					minHeight: size,
					paddingBottom: 5,
				}}
			>
				<Label
					text={selectedItem?.text ?? ''}
					font='label'
					color={labelColor}
					layout={{
						minWidth: 0,
					}}
				/>
			</layoutContainer>
			<ArrowButton
				direction='right'
				size={size}
				onPress={handleNext}
				disabled={disabled || !canNavigate}
			/>
		</layoutContainer>
	)
}
