export enum InputAction {
	MOVE_UP = 'MOVE_UP',
	MOVE_DOWN = 'MOVE_DOWN',
	MOVE_LEFT = 'MOVE_LEFT',
	MOVE_RIGHT = 'MOVE_RIGHT',
	ATTACK = 'ATTACK',
	CAST_SPELL = 'CAST_SPELL',
	USE_ITEM = 'USE_ITEM',
	OPEN_INVENTORY = 'OPEN_INVENTORY',
	OPEN_CHAT = 'OPEN_CHAT',
	TOGGLE_RUN = 'TOGGLE_RUN',
	INTERACT = 'INTERACT',
	TOGGLE_FULLSCREEN = 'TOGGLE_FULLSCREEN',
}

export type KeybindMap = Record<InputAction, string[]>

export type InputState = {
	keybinds: KeybindMap
	pressedKeys: Set<string>
}

export type InputActionHandler = (action: InputAction, pressed: boolean) => void
