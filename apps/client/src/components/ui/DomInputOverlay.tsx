import type { CSSProperties, FC, KeyboardEvent } from 'react'

type DomInputOverlayProps = {
	style: CSSProperties | null
	placeholder: string
	value: string
	maxLength?: number
	secure?: boolean
	onChange?: (value: string) => void
	onEnter?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
}

export const DomInputOverlay: FC<DomInputOverlayProps> = ({
	style,
	placeholder,
	value,
	maxLength,
	secure = false,
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
			className='input-overlay'
			type={secure ? 'password' : 'text'}
			maxLength={maxLength}
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
