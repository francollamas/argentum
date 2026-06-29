class_name CharacterPartDefinition
extends RefCounted

const UP := &'up'
const RIGHT := &'right'
const DOWN := &'down'
const LEFT := &'left'
const DIRECTION_ORDER: Array[StringName] = [UP, RIGHT, DOWN, LEFT]

var id: int
var directions: Dictionary
var offset: Vector2i


func _init(
	part_id: int,
	part_directions: Dictionary,
	part_offset: Vector2i = Vector2i.ZERO,
) -> void:
	id = part_id
	directions = part_directions
	offset = part_offset


func has_direction(direction: StringName) -> bool:
	return directions.has(direction)


func get_sprite_id(direction: StringName) -> int:
	if not directions.has(direction):
		return -1

	return directions[direction]
