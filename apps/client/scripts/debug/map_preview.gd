@tool
extends Node2D

@onready var _world_map_view = $WorldMapView


func _ready() -> void:
	if _world_map_view == null:
		push_error('MapPreview requires a WorldMapView child node')


func _unhandled_input(event: InputEvent) -> void:
	if _world_map_view == null:
		return

	if event.is_action_pressed('ui_left'):
		_world_map_view.set_held_direction(&'left')
		get_viewport().set_input_as_handled()
	elif event.is_action_released('ui_left'):
		_world_map_view.clear_held_direction(&'left')
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed('ui_right'):
		_world_map_view.set_held_direction(&'right')
		get_viewport().set_input_as_handled()
	elif event.is_action_released('ui_right'):
		_world_map_view.clear_held_direction(&'right')
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed('ui_up'):
		_world_map_view.set_held_direction(&'up')
		get_viewport().set_input_as_handled()
	elif event.is_action_released('ui_up'):
		_world_map_view.clear_held_direction(&'up')
		get_viewport().set_input_as_handled()
	elif event.is_action_pressed('ui_down'):
		_world_map_view.set_held_direction(&'down')
		get_viewport().set_input_as_handled()
	elif event.is_action_released('ui_down'):
		_world_map_view.clear_held_direction(&'down')
		get_viewport().set_input_as_handled()
