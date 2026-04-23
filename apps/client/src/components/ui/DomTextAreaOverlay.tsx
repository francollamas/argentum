import type { CSSProperties, FC } from 'react'

type DomTextAreaOverlayProps = {
	style: CSSProperties | null
	placeholder: string
	value: string
	maxLength?: number
	onChange?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
}

export const DomTextAreaOverlay: FC<DomTextAreaOverlayProps> = ({
	style,
	placeholder,
	value,
	maxLength,
	onChange,
	onFocus,
	onBlur,
}) => {
	if (!style) return null

	const shellStyle: CSSProperties = {
		position: style.position,
		top: style.top,
		left: style.left,
		width: style.width,
		height: style.height,
		borderRadius: style.borderRadius,
		overflow: 'hidden',
		pointerEvents: 'none',
		zIndex: style.zIndex,
		'--input-placeholder-color': style['--input-placeholder-color'],
	}

	const viewportStyle: CSSProperties = {
		position: 'absolute',
		top: style.paddingTop,
		right: style.paddingRight,
		bottom: style.paddingBottom,
		left: style.paddingLeft,
		overflow: 'hidden',
	}

	const textAreaStyle: CSSProperties = {
		display: 'block',
		width: '100%',
		height: '100%',
		padding: 0,
		margin: style.margin,
		boxSizing: style.boxSizing,
		border: style.border,
		background: style.background,
		color: style.color,
		caretColor: style.caretColor,
		textAlign: style.textAlign,
		fontSize: style.fontSize,
		fontFamily: style.fontFamily,
		lineHeight: style.lineHeight,
		appearance: style.appearance,
		outline: style.outline,
		pointerEvents: 'auto',
		resize: style.resize,
		overflowX: style.overflowX,
		overflowY: style.overflowY,
	}

	return (
		<div className='textarea-overlay-shell' style={shellStyle}>
			<div className='textarea-overlay-viewport' style={viewportStyle}>
				<textarea
					className='textarea-overlay'
					maxLength={maxLength}
					autoComplete='off'
					spellCheck={false}
					placeholder={placeholder}
					value={value}
					style={textAreaStyle}
					onChange={(event) => onChange?.(event.currentTarget.value)}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</div>
		</div>
	)
}
