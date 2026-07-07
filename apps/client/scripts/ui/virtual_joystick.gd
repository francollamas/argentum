@tool
extends Control

const NO_ACTION := &''

@export var move_left_action: StringName = &'move_left'
@export var move_right_action: StringName = &'move_right'
@export var move_up_action: StringName = &'move_up'
@export var move_down_action: StringName = &'move_down'
@export_range(24.0, 160.0, 1.0) var base_radius := 56.0
@export_range(12.0, 96.0, 1.0) var knob_radius := 22.0
@export_range(0.05, 0.95, 0.01) var deadzone_ratio := 0.35
@export var base_color := Color(0.06, 0.08, 0.12, 0.35)
@export var ring_color := Color(0.76, 0.82, 0.92, 0.75)
@export var knob_color := Color(0.90, 0.94, 1.0, 0.92)

var _active_touch_index := -1
var _mouse_dragging := false
var _current_action: StringName = NO_ACTION
var _knob_offset := Vector2.ZERO


func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	_update_layout()


func _exit_tree() -> void:
	_release_current_action()


func _draw() -> void:
	var center := size / 2.0
	var outer_radius := minf(base_radius, minf(size.x, size.y) / 2.0)
	var inner_radius := maxf(outer_radius - 6.0, 1.0)
	var knob_position := center + _knob_offset

	draw_circle(center, outer_radius, base_color)
	draw_arc(center, inner_radius, 0.0, TAU, 64, ring_color, 4.0, true)
	draw_circle(knob_position, knob_radius, knob_color)


func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		_handle_screen_touch(event)
		return

	if event is InputEventScreenDrag:
		_handle_screen_drag(event)
		return

	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		_handle_mouse_button(event)
		return

	if event is InputEventMouseMotion:
		_handle_mouse_motion(event)


func _handle_screen_touch(event: InputEventScreenTouch) -> void:
	if event.pressed:
		if _active_touch_index != -1:
			return

		var local_position := _to_local_position(event.position)
		if not _is_inside_activation_area(local_position):
			return

		_active_touch_index = event.index
		_update_drag(local_position)
		return

	if event.index != _active_touch_index:
		return

	_active_touch_index = -1
	_reset_drag()


func _handle_screen_drag(event: InputEventScreenDrag) -> void:
	if event.index != _active_touch_index:
		return

	_update_drag(_to_local_position(event.position))


func _handle_mouse_button(event: InputEventMouseButton) -> void:
	if event.pressed:
		var local_position := _to_local_position(event.position)
		if not _is_inside_activation_area(local_position):
			return

		_mouse_dragging = true
		_update_drag(local_position)
		return

	if not _mouse_dragging:
		return

	_mouse_dragging = false
	_reset_drag()


func _handle_mouse_motion(event: InputEventMouseMotion) -> void:
	if not _mouse_dragging:
		return

	_update_drag(_to_local_position(event.position))


func _update_drag(local_position: Vector2) -> void:
	var center := size / 2.0
	var pointer_offset := local_position - center
	var max_distance := maxf(base_radius - knob_radius - 6.0, 0.0)
	if pointer_offset.length() > max_distance and max_distance > 0.0:
		pointer_offset = pointer_offset.normalized() * max_distance

	_knob_offset = pointer_offset
	queue_redraw()
	_update_action_for_offset(local_position - center)


func _reset_drag() -> void:
	_knob_offset = Vector2.ZERO
	queue_redraw()
	_release_current_action()


func _update_action_for_offset(raw_offset: Vector2) -> void:
	if raw_offset.length() < base_radius * deadzone_ratio:
		_release_current_action()
		return

	var next_action := NO_ACTION
	if absf(raw_offset.x) > absf(raw_offset.y):
		next_action = move_right_action if raw_offset.x > 0.0 else move_left_action
	else:
		next_action = move_down_action if raw_offset.y > 0.0 else move_up_action

	_set_current_action(next_action)


func _set_current_action(action: StringName) -> void:
	if _current_action == action:
		return

	_release_current_action()
	_current_action = action
	_emit_action(_current_action, true)


func _release_current_action() -> void:
	if _current_action == NO_ACTION:
		return

	_emit_action(_current_action, false)
	_current_action = NO_ACTION


func _emit_action(action: StringName, pressed: bool) -> void:
	if action == NO_ACTION:
		return

	var input_event := InputEventAction.new()
	input_event.action = action
	input_event.pressed = pressed
	Input.parse_input_event(input_event)


func _to_local_position(global_position: Vector2) -> Vector2:
	return get_global_transform_with_canvas().affine_inverse() * global_position


func _is_inside_activation_area(local_position: Vector2) -> bool:
	return local_position.distance_to(size / 2.0) <= base_radius


func _update_layout() -> void:
	var diameter := base_radius * 2.0
	custom_minimum_size = Vector2.ONE * diameter
	if size == Vector2.ZERO:
		size = custom_minimum_size
