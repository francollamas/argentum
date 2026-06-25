import type { CSSProperties, FC, KeyboardEvent, RefObject } from 'react'

type DomInputOverlayProps = {
	style: CSSProperties | null
	interactive?: boolean
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
	interactive = false,
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

	const inputStyle: CSSProperties = {
		...style,
		pointerEvents: interactive && !disabled ? 'auto' : 'none',
	}

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
			style={inputStyle}
			onChange={(event) => onChange?.(event.currentTarget.value)}
			onKeyDown={handleKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	)
}
