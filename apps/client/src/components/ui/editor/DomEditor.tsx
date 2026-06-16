import type { CSSProperties, FC, KeyboardEvent, RefObject } from 'react'
import type { EditorKind } from './EditorContext'

type DomEditorProps = {
	kind: EditorKind
	style: CSSProperties | null
	value: string
	inputRef?: RefObject<HTMLInputElement | null>
	textareaRef?: RefObject<HTMLTextAreaElement | null>
	maxLength?: number
	secure?: boolean
	disabled?: boolean
	onChange?: (value: string) => void
	onEnter?: (value: string) => void
	onFocus?: () => void
	onBlur?: () => void
}

const InputEditor: FC<Omit<DomEditorProps, 'kind' | 'textareaRef'>> = ({
	style,
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
			className='dom-editor'
			type={secure ? 'password' : 'text'}
			maxLength={maxLength}
			disabled={disabled}
			autoComplete='off'
			spellCheck={false}
			value={value}
			style={style}
			onChange={(event) => onChange?.(event.currentTarget.value)}
			onKeyDown={handleKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	)
}

const TextAreaEditor: FC<
	Omit<DomEditorProps, 'kind' | 'inputRef' | 'secure' | 'onEnter'>
> = ({
	style,
	value,
	textareaRef,
	maxLength,
	disabled = false,
	onChange,
	onFocus,
	onBlur,
}) => {
	if (!style) return null

	return (
		<textarea
			ref={textareaRef}
			className='dom-editor'
			maxLength={maxLength}
			disabled={disabled}
			autoComplete='off'
			spellCheck={false}
			value={value}
			style={style}
			onChange={(event) => onChange?.(event.currentTarget.value)}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	)
}

export const DomEditor: FC<DomEditorProps> = (props) => {
	if (props.kind === 'input') {
		const { kind: _kind, textareaRef: _textarea, ...rest } = props
		return <InputEditor {...rest} />
	}
	const {
		kind: _kind,
		inputRef: _input,
		secure: _secure,
		onEnter: _onEnter,
		...rest
	} = props
	return <TextAreaEditor {...rest} />
}
