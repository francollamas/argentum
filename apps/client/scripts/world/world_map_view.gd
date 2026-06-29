@tool
class_name WorldMapView
extends Node2D

const MAP_PARSER_SCRIPT := preload('res://scripts/data/map_parser.gd')
const MAP_LAYER_RENDERER_SCRIPT := preload('res://scripts/rendering/map_layer_renderer.gd')
const MAP_DEBUG_OVERLAY_SCRIPT := preload('res://scripts/debug/map_debug_overlay.gd')

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

var _map_number := 1
var _player_tile_x := 50
var _player_tile_y := 50
var _show_debug_overlay := true
var _show_grid := true
var _show_blocked_tiles := true
var _show_trigger_tiles := true
var _show_trigger_numbers := true

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
		_refresh_view()

@export_range(MIN_TILE_Y, MAX_TILE_Y, 1) var player_tile_y := 50:
	get:
		return _player_tile_y
	set(value):
		_player_tile_y = clampi(value, MIN_TILE_Y, MAX_TILE_Y)
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

var _parser = MAP_PARSER_SCRIPT.new()
var _map_data
var _map_container: Node2D
var _layer_1_renderer: Node2D
var _layer_2_renderer: Node2D
var _layer_3_renderer: Node2D
var _layer_4_renderer: Node2D
var _debug_overlay: Node2D


func _ready() -> void:
	_ensure_nodes()
	var viewport := get_viewport()
	if viewport != null and not viewport.size_changed.is_connected(_refresh_view):
		viewport.size_changed.connect(_refresh_view)
	_reload_map()


func _enter_tree() -> void:
	_ensure_nodes()
	_reload_map()


func move_player_by(delta_x: int, delta_y: int) -> void:
	_player_tile_x = clampi(_player_tile_x + delta_x, MIN_TILE_X, MAX_TILE_X)
	_player_tile_y = clampi(_player_tile_y + delta_y, MIN_TILE_Y, MAX_TILE_Y)
	_refresh_view()


func get_current_tile():
	if _map_data == null:
		return null

	return _map_data.get_tile(_player_tile_x, _player_tile_y)


func _reload_map() -> void:
	if not is_inside_tree():
		return

	_map_data = _parser.parse_map(_map_number)
	_refresh_view()


func _refresh_view() -> void:
	if not is_inside_tree():
		return

	_ensure_nodes()

	if _map_data == null:
		return

	var player_tile_position: Vector2 = _map_data.tile_to_pixel(_player_tile_x, _player_tile_y)
	_map_container.position = _calculate_map_container_position(player_tile_position)

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
		_player_tile_x,
		_player_tile_y,
	)


func _calculate_map_container_position(player_tile_position: Vector2) -> Vector2:
	if Engine.is_editor_hint():
		return (-player_tile_position - Vector2(TILE_SIZE / 2.0, TILE_SIZE / 2.0)).round()

	var viewport_size := get_viewport_rect().size
	var viewport_center := viewport_size / 2.0
	return (viewport_center - player_tile_position - Vector2(TILE_SIZE / 2.0, TILE_SIZE / 2.0)).round()


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
	var top_left := -_map_container.position
	return Rect2(top_left, viewport_size)


func _ensure_nodes() -> void:
	if is_instance_valid(_map_container):
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
