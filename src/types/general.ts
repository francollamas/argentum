export const Direction = {
	Up: 'up',
	Left: 'left',
	Down: 'down',
	Right: 'right',
} as const

export type Direction = (typeof Direction)[keyof typeof Direction]
