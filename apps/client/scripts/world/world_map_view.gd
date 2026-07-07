@tool
class_name WorldMapView
extends Node2D

const MAP_PARSER_SCRIPT := preload('res://scripts/data/map_parser.gd')
const MAP_LAYER_RENDERER_SCRIPT := preload('res://scripts/rendering/map_layer_renderer.gd')
const MAP_DEBUG_OVERLAY_SCRIPT := preload('res://scripts/debug/map_debug_overlay.gd')
const MOVEMENT_CONTROLLER_SCRIPT := preload('res://scripts/world/movement_controller.gd')
const PLAYER_CHARACTER_SCENE := preload('res://scenes/world/PlayerCharacter.tscn')

const TILE_SIZE := 32.0
const MIN_TILE_X := 1
const MIN_TILE_Y := 1
const MAX_TILE_X := 100
const MAX_TILE_Y := 100
const ROOF_HIDDEN_ALPHA := 0.15
const GROUND_PADDING := 2
const UPPER_PADDING := 10
const ROOF_PADDING := 12
const ROOF_TRIGGERS := [1, 2, 4]
const DEFAULT_WORLD_ZOOM := 1.56
const DEFAULT_MOVEMENT_TILES_PER_SECOND := 4.0

var _map_number := 1
var _player_tile_x := 50
var _player_tile_y := 50
var _show_debug_overlay := true
var _show_grid := true
var _show_blocked_tiles := true
var _show_trigger_tiles := true
var _show_trigger_numbers := true
var _world_zoom := DEFAULT_WORLD_ZOOM
var _movement_tiles_per_second := DEFAULT_MOVEMENT_TILES_PER_SECOND

@export_range(1, 288, 1) var map_number := 1:
	get:
		return _map_number
	set(value):
		if _map_number == value:
			return
		_map_number = value
		_reload_map()

@export_range(MIN_TILE_X, MAX_TILE_X, 1) var player_tile_x := 50:
	get:
		return _player_tile_x
	set(value):
		_player_tile_x = clampi(value, MIN_TILE_X, MAX_TILE_X)
		if _movement_controller != null and _map_data != null:
			_movement_controller.set_tile_position(Vector2i(_player_tile_x, _player_tile_y))
		_refresh_view()

@export_range(MIN_TILE_Y, MAX_TILE_Y, 1) var player_tile_y := 50:
	get:
		return _player_tile_y
	set(value):
		_player_tile_y = clampi(value, MIN_TILE_Y, MAX_TILE_Y)
		if _movement_controller != null and _map_data != null:
			_movement_controller.set_tile_position(Vector2i(_player_tile_x, _player_tile_y))
		_refresh_view()

@export var show_debug_overlay := true:
	get:
		return _show_debug_overlay
	set(value):
		_show_debug_overlay = value
		if is_instance_valid(_debug_overlay):
			_debug_overlay.visible = value
			_debug_overlay.queue_redraw()

@export var show_grid := true:
	get:
		return _show_grid
	set(value):
		_show_grid = value
		if is_instance_valid(_debug_overlay):
			_debug_overlay.show_grid = value
			_debug_overlay.queue_redraw()

@export var show_blocked_tiles := true:
	get:
		return _show_blocked_tiles
	set(value):
		_show_blocked_tiles = value
		if is_instance_valid(_debug_overlay):
			_debug_overlay.show_blocked = value
			_debug_overlay.queue_redraw()

@export var show_trigger_tiles := true:
	get:
		return _show_trigger_tiles
	set(value):
		_show_trigger_tiles = value
		if is_instance_valid(_debug_overlay):
			_debug_overlay.show_triggers = value
			_debug_overlay.queue_redraw()

@export var show_trigger_numbers := true:
	get:
		return _show_trigger_numbers
	set(value):
		_show_trigger_numbers = value
		if is_instance_valid(_debug_overlay):
			_debug_overlay.show_trigger_numbers = value
			_debug_overlay.queue_redraw()

@export_range(0.5, 4.0, 0.01) var world_zoom := DEFAULT_WORLD_ZOOM:
	get:
		return _world_zoom
	set(value):
		_world_zoom = maxf(value, 0.01)
		_refresh_view()

@export_range(1.0, 12.0, 0.1) var movement_tiles_per_second := DEFAULT_MOVEMENT_TILES_PER_SECOND:
	get:
		return _movement_tiles_per_second
	set(value):
		_movement_tiles_per_second = maxf(value, 0.1)
		if _movement_controller != null:
			_movement_controller.tiles_per_second = _movement_tiles_per_second

var _parser = MAP_PARSER_SCRIPT.new()
var _map_data
var _map_container: Node2D
var _layer_1_renderer: Node2D
var _layer_2_renderer: Node2D
var _layer_3_renderer: Node2D
var _layer_4_renderer: Node2D
var _debug_overlay: Node2D
var _movement_controller: MovementController
var _player_character: PlayerCharacter
var _follow_world_position := Vector2.ZERO
var _is_initialized := false


func _ready() -> void:
	if _is_initialized:
		_refresh_view()
		return

	_is_initialized = true
	_ensure_nodes()
	var viewport := get_viewport()
	if viewport != null and not viewport.size_changed.is_connected(_refresh_view):
		viewport.size_changed.connect(_refresh_view)
	_reload_map()


func move_player_by(delta_x: int, delta_y: int) -> void:
	var direction := _delta_to_direction(delta_x, delta_y)
	if direction == &'':
		return

	set_held_direction(direction)
	clear_held_direction(direction)


func set_held_direction(direction: StringName) -> void:
	if Engine.is_editor_hint():
		return

	if _movement_controller == null:
		return

	_movement_controller.set_held_direction(direction)


func clear_held_direction(direction: StringName) -> void:
	if Engine.is_editor_hint():
		return

	if _movement_controller == null:
		return

	_movement_controller.clear_held_direction(direction)


func get_current_tile():
	if _map_data == null:
		return null

	var tile_position := _get_current_tile_position()
	return _map_data.get_tile(tile_position.x, tile_position.y)


func _process(_delta: float) -> void:
	if Engine.is_editor_hint():
		return

	if _map_data == null or _movement_controller == null:
		return

	_update_focus_visuals()


func _reload_map() -> void:
	if not is_inside_tree():
		return

	_ensure_nodes()
	_map_data = _parser.parse_map(_map_number)
	if not Engine.is_editor_hint() and _movement_controller != null:
		_movement_controller.tiles_per_second = _movement_tiles_per_second
		_movement_controller.configure(_map_data, Vector2i(_player_tile_x, _player_tile_y))
	_follow_world_position = _get_current_focus_world_position()
	_refresh_view()


func _refresh_view() -> void:
	if not is_inside_tree():
		return

	_ensure_nodes()

	if _map_data == null:
		_clear_rendered_layers()
		_debug_overlay.visible = false
		return

	_update_focus_visuals()

	var ground_bounds := _calculate_layer_bounds(GROUND_PADDING)
	var upper_bounds := _calculate_layer_bounds(UPPER_PADDING)
	var roof_bounds := _calculate_layer_bounds(ROOF_PADDING)

	_layer_1_renderer.render_layer(
		_map_data,
		0,
		ground_bounds['start_x'],
		ground_bounds['end_x'],
		ground_bounds['start_y'],
		ground_bounds['end_y'],
		false,
	)
	_layer_2_renderer.render_layer(
		_map_data,
		1,
		ground_bounds['start_x'],
		ground_bounds['end_x'],
		ground_bounds['start_y'],
		ground_bounds['end_y'],
		false,
	)
	_layer_3_renderer.render_layer(
		_map_data,
		2,
		upper_bounds['start_x'],
		upper_bounds['end_x'],
		upper_bounds['start_y'],
		upper_bounds['end_y'],
		true,
	)
	_layer_4_renderer.render_layer(
		_map_data,
		3,
		roof_bounds['start_x'],
		roof_bounds['end_x'],
		roof_bounds['start_y'],
		roof_bounds['end_y'],
		true,
	)

	_update_roof_visibility()
	_debug_overlay.visible = _show_debug_overlay
	_debug_overlay.show_grid = _show_grid
	_debug_overlay.show_blocked = _show_blocked_tiles
	_debug_overlay.show_triggers = _show_trigger_tiles
	_debug_overlay.show_trigger_numbers = _show_trigger_numbers
	_debug_overlay.configure(
		_map_data,
		upper_bounds['start_x'],
		upper_bounds['end_x'],
		upper_bounds['start_y'],
		upper_bounds['end_y'],
		_get_current_tile_position().x,
		_get_current_tile_position().y,
	)


func _calculate_map_container_position(focus_world_position: Vector2) -> Vector2:
	if Engine.is_editor_hint():
		return (-focus_world_position * _world_zoom).round()

	var viewport_size := get_viewport_rect().size
	var viewport_center := viewport_size / 2.0
	return (viewport_center - focus_world_position * _world_zoom).round()


func _update_roof_visibility() -> void:
	var current_tile = get_current_tile()
	if current_tile == null:
		_layer_4_renderer.modulate.a = 1.0
		return

	_layer_4_renderer.modulate.a = ROOF_HIDDEN_ALPHA if ROOF_TRIGGERS.has(current_tile.trigger) else 1.0


func _calculate_layer_bounds(padding: int) -> Dictionary:
	if Engine.is_editor_hint():
		return {
			'start_x': MIN_TILE_X,
			'end_x': MAX_TILE_X,
			'start_y': MIN_TILE_Y,
			'end_y': MAX_TILE_Y,
		}

	var visible_rect := _get_visible_world_rect()
	var start_x := int(floor(visible_rect.position.x / TILE_SIZE)) + MIN_TILE_X - padding
	var end_x := int(ceil(visible_rect.end.x / TILE_SIZE)) + MIN_TILE_X - 1 + padding
	var start_y := int(floor(visible_rect.position.y / TILE_SIZE)) + MIN_TILE_Y - padding
	var end_y := int(ceil(visible_rect.end.y / TILE_SIZE)) + MIN_TILE_Y - 1 + padding

	return {
		'start_x': clampi(start_x, MIN_TILE_X, MAX_TILE_X),
		'end_x': clampi(end_x, MIN_TILE_X, MAX_TILE_X),
		'start_y': clampi(start_y, MIN_TILE_Y, MAX_TILE_Y),
		'end_y': clampi(end_y, MIN_TILE_Y, MAX_TILE_Y),
	}


func _get_visible_world_rect() -> Rect2:
	var viewport_size := get_viewport_rect().size
	var top_left := -_map_container.position / _world_zoom
	return Rect2(top_left, viewport_size / _world_zoom)


func _ensure_nodes() -> void:
	if not Engine.is_editor_hint() and _movement_controller == null:
		_movement_controller = get_node_or_null('MovementController') as MovementController
		if _movement_controller == null:
			_movement_controller = MOVEMENT_CONTROLLER_SCRIPT.new()
			_movement_controller.name = 'MovementController'
			add_child(_movement_controller)
		_movement_controller.tiles_per_second = _movement_tiles_per_second
		_connect_movement_controller()

	if _player_character == null:
		_player_character = get_node_or_null('PlayerCharacter') as PlayerCharacter
		if _player_character == null:
			_player_character = PLAYER_CHARACTER_SCENE.instantiate() as PlayerCharacter
			_player_character.name = 'PlayerCharacter'
			add_child(_player_character)
	move_child(_player_character, get_child_count() - 1)

	if is_instance_valid(_map_container):
		move_child(_player_character, get_child_count() - 1)
		_update_player_screen_position()
		return

	_map_container = Node2D.new()
	_map_container.name = 'MapContainer'
	add_child(_map_container)

	_layer_1_renderer = MAP_LAYER_RENDERER_SCRIPT.new()
	_layer_1_renderer.name = 'Layer1'
	_map_container.add_child(_layer_1_renderer)

	_layer_2_renderer = MAP_LAYER_RENDERER_SCRIPT.new()
	_layer_2_renderer.name = 'Layer2'
	_map_container.add_child(_layer_2_renderer)

	_layer_3_renderer = MAP_LAYER_RENDERER_SCRIPT.new()
	_layer_3_renderer.name = 'Layer3'
	_map_container.add_child(_layer_3_renderer)

	_layer_4_renderer = MAP_LAYER_RENDERER_SCRIPT.new()
	_layer_4_renderer.name = 'Layer4'
	_map_container.add_child(_layer_4_renderer)

	_debug_overlay = MAP_DEBUG_OVERLAY_SCRIPT.new()
	_debug_overlay.name = 'DebugOverlay'
	_map_container.add_child(_debug_overlay)
	move_child(_player_character, get_child_count() - 1)
	_update_player_screen_position()


func _clear_rendered_layers() -> void:
	if is_instance_valid(_layer_1_renderer):
		_layer_1_renderer.clear_layer()
	if is_instance_valid(_layer_2_renderer):
		_layer_2_renderer.clear_layer()
	if is_instance_valid(_layer_3_renderer):
		_layer_3_renderer.clear_layer()
	if is_instance_valid(_layer_4_renderer):
		_layer_4_renderer.clear_layer()


func _connect_movement_controller() -> void:
	if _movement_controller == null:
		return

	if not _movement_controller.facing_changed.is_connected(_on_facing_changed):
		_movement_controller.facing_changed.connect(_on_facing_changed)
	if not _movement_controller.movement_started.is_connected(_on_movement_started):
		_movement_controller.movement_started.connect(_on_movement_started)
	if not _movement_controller.position_changed.is_connected(_on_position_changed):
		_movement_controller.position_changed.connect(_on_position_changed)
	if not _movement_controller.movement_finished.is_connected(_on_movement_finished):
		_movement_controller.movement_finished.connect(_on_movement_finished)


func _on_facing_changed(direction: StringName) -> void:
	if _player_character != null:
		_player_character.set_direction(direction)


func _on_movement_started(_direction: StringName, _from_tile: Vector2i, _to_tile: Vector2i) -> void:
	if _player_character != null:
		_player_character.set_moving(true)
	_refresh_view()


func _on_position_changed(tile_position: Vector2i, world_position: Vector2) -> void:
	_player_tile_x = tile_position.x
	_player_tile_y = tile_position.y
	_follow_world_position = world_position
	if Engine.is_editor_hint():
		_refresh_view()


func _on_movement_finished(_tile_position: Vector2i) -> void:
	call_deferred('_sync_player_motion_state')


func _update_focus_visuals() -> void:
	if _map_container == null:
		return

	var focus_world_position := _get_current_focus_world_position()
	_follow_world_position = focus_world_position
	_map_container.scale = Vector2.ONE * _world_zoom
	_map_container.position = _calculate_map_container_position(focus_world_position)
	_update_player_screen_position()


func _get_current_focus_world_position() -> Vector2:
	if _map_data == null:
		return Vector2.ZERO

	if Engine.is_editor_hint():
		return _map_data.tile_to_pixel(_player_tile_x, _player_tile_y) + Vector2(TILE_SIZE / 2.0, TILE_SIZE / 2.0)

	if _movement_controller != null:
		return _movement_controller.get_focus_world_position()

	return _map_data.tile_to_pixel(_player_tile_x, _player_tile_y) + Vector2(TILE_SIZE / 2.0, TILE_SIZE / 2.0)


func _get_current_tile_position() -> Vector2i:
	if Engine.is_editor_hint():
		return Vector2i(_player_tile_x, _player_tile_y)

	if _movement_controller != null:
		return _movement_controller.get_tile_position()

	return Vector2i(_player_tile_x, _player_tile_y)


func _update_player_screen_position() -> void:
	if _player_character == null:
		return

	if Engine.is_editor_hint():
		_player_character.position = _follow_world_position + _map_container.position
		_player_character.scale = Vector2.ONE * _world_zoom
		return

	_player_character.position = (get_viewport_rect().size / 2.0).round()
	_player_character.scale = Vector2.ONE * _world_zoom


func _sync_player_motion_state() -> void:
	if _player_character != null:
		_player_character.set_moving(_movement_controller != null and _movement_controller.is_moving())
	if _movement_controller == null or not _movement_controller.is_moving():
		_refresh_view()


func _delta_to_direction(delta_x: int, delta_y: int) -> StringName:
	if delta_x < 0:
		return &'left'
	if delta_x > 0:
		return &'right'
	if delta_y < 0:
		return &'up'
	if delta_y > 0:
		return &'down'
	return &''
