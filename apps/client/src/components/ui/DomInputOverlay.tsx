import type { CSSProperties, FC, KeyboardEvent, RefObject } from 'react'

type DomInputOverlayProps = {
	style: CSSProperties | null
	placeholder: string
	value: string
	inputRef?: RefObject<HTMLInputElement | null>
	maxLength?: number
	secure?: boolean
	disabled?: boolean
	onChange?: (value: string) => void
	onEnter?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
}

export const DomInputOverlay: FC<DomInputOverlayProps> = ({
	style,
	placeholder,
	value,
	inputRef,
	maxLength,
	secure = false,
	disabled = false,
	onChange,
	onEnter,
	onFocus,
	onBlur,
}) => {
	if (!style) return null

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			onEnter?.(event.currentTarget.value)
			event.currentTarget.blur()
		}

		if (event.key === 'Escape') {
			event.currentTarget.blur()
		}
	}

	return (
		<input
			ref={inputRef}
			className='input-overlay'
			type={secure ? 'password' : 'text'}
			maxLength={maxLength}
			disabled={disabled}
			autoComplete='off'
			spellCheck={false}
			placeholder={placeholder}
			value={value}
			style={style}
			onChange={(event) => onChange?.(event.currentTarget.value)}
			onKeyDown={handleKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	)
}
