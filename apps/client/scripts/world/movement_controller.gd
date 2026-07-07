@tool
class_name MovementController
extends Node

signal facing_changed(direction: StringName)
signal movement_started(direction: StringName, from_tile: Vector2i, to_tile: Vector2i)
signal position_changed(tile_position: Vector2i, world_position: Vector2)
signal movement_finished(tile_position: Vector2i)

const TILE_SIZE := 32.0
const UP := &'up'
const RIGHT := &'right'
const DOWN := &'down'
const LEFT := &'left'
const NO_DIRECTION := &''

@export var tiles_per_second := 12.0:
	get:
		return _tiles_per_second
	set(value):
		_tiles_per_second = maxf(value, 0.001)

var _tiles_per_second := 12.0
var _map_data = null
var _tile_position := Vector2i.ZERO
var _facing_direction: StringName = DOWN
var _held_direction: StringName = NO_DIRECTION
var _active_step := {}


func configure(map_data, start_tile: Vector2i) -> void:
	_map_data = map_data
	_held_direction = NO_DIRECTION
	_active_step.clear()
	set_tile_position(start_tile)


func set_tile_position(tile_position: Vector2i) -> void:
	if _map_data == null:
		_tile_position = tile_position
		return

	_tile_position = _clamp_tile(tile_position)
	_active_step.clear()
	_emit_position_changed()


func set_held_direction(direction: StringName) -> void:
	if not _is_supported_direction(direction):
		return

	_held_direction = direction

	if not is_moving():
		_try_start_step()


func clear_held_direction(direction: StringName) -> void:
	if _held_direction == direction:
		_held_direction = NO_DIRECTION


func clear_input() -> void:
	_held_direction = NO_DIRECTION


func get_tile_position() -> Vector2i:
	return _tile_position


func get_facing_direction() -> StringName:
	return _facing_direction


func get_focus_world_position() -> Vector2:
	if _map_data == null:
		return Vector2.ZERO

	if not is_moving():
		return _tile_to_world_center(_tile_position)

	var from_world := _tile_to_world_center(_active_step['from_tile'])
	var to_world := _tile_to_world_center(_active_step['to_tile'])
	var progress: float = _active_step['elapsed'] / _active_step['duration_seconds']
	return from_world.lerp(to_world, clampf(progress, 0.0, 1.0))


func is_moving() -> bool:
	return not _active_step.is_empty()


func _process(delta: float) -> void:
	if _map_data == null:
		return

	if is_moving():
		_advance_step(delta)
		return

	if _held_direction != NO_DIRECTION:
		_try_start_step()


func _try_start_step() -> void:
	if _map_data == null or _held_direction == NO_DIRECTION:
		return

	if _facing_direction != _held_direction:
		_facing_direction = _held_direction
		facing_changed.emit(_held_direction)

	var direction_vector := _direction_to_vector(_held_direction)
	var target_tile := _tile_position + direction_vector
	if not _can_move_to(target_tile):
		return

	var from_tile := _tile_position
	_tile_position = target_tile
	_active_step = {
		'from_tile': from_tile,
		'to_tile': target_tile,
		'direction': _held_direction,
		'elapsed': 0.0,
		'duration_seconds': 1.0 / _tiles_per_second,
	}

	movement_started.emit(_held_direction, from_tile, target_tile)
	_emit_position_changed()


func _advance_step(delta: float) -> void:
	_active_step['elapsed'] = minf(
		_active_step['elapsed'] + delta,
		_active_step['duration_seconds'],
	)
	_emit_position_changed()

	if _active_step['elapsed'] < _active_step['duration_seconds']:
		return

	_active_step.clear()
	movement_finished.emit(_tile_position)
	_emit_position_changed()

	if _held_direction != NO_DIRECTION:
		_try_start_step()


func _emit_position_changed() -> void:
	position_changed.emit(_tile_position, get_focus_world_position())


func _can_move_to(tile_position: Vector2i) -> bool:
	if _map_data == null or not _map_data.has_tile(tile_position.x, tile_position.y):
		return false

	var tile = _map_data.get_tile(tile_position.x, tile_position.y)
	return tile != null and not tile.is_blocked


func _clamp_tile(tile_position: Vector2i) -> Vector2i:
	return Vector2i(
		clampi(tile_position.x, _map_data.min_tile_x, _map_data.max_tile_x),
		clampi(tile_position.y, _map_data.min_tile_y, _map_data.max_tile_y),
	)


func _tile_to_world_center(tile_position: Vector2i) -> Vector2:
	return _map_data.tile_to_pixel(tile_position.x, tile_position.y) + Vector2(TILE_SIZE / 2.0, TILE_SIZE / 2.0)


func _direction_to_vector(direction: StringName) -> Vector2i:
	match direction:
		UP:
			return Vector2i(0, -1)
		RIGHT:
			return Vector2i(1, 0)
		DOWN:
			return Vector2i(0, 1)
		LEFT:
			return Vector2i(-1, 0)
		_:
			return Vector2i.ZERO


func _is_supported_direction(direction: StringName) -> bool:
	return direction == UP or direction == RIGHT or direction == DOWN or direction == LEFT
