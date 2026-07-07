@tool
extends Node2D

const MIN_MAP_NUMBER := 1
const MAX_MAP_NUMBER := 290

@onready var _world_map_view = $WorldMapView
@onready var _previous_button: Button = $HudLayer/HudRoot/MapSwitchBar/PreviousButton
@onready var _next_button: Button = $HudLayer/HudRoot/MapSwitchBar/NextButton


func _ready() -> void:
	if _world_map_view == null:
		push_error('MapPreview requires a WorldMapView child node')
		return
	_previous_button.pressed.connect(_on_previous_pressed)
	_next_button.pressed.connect(_on_next_pressed)


func _on_previous_pressed() -> void:
	_cycle_map(-1)


func _on_next_pressed() -> void:
	_cycle_map(1)


func _cycle_map(delta: int) -> void:
	var current: int = _world_map_view.map_number
	var range_size: int = MAX_MAP_NUMBER - MIN_MAP_NUMBER + 1
	var next: int = ((current - MIN_MAP_NUMBER + delta + range_size) % range_size) + MIN_MAP_NUMBER
	_world_map_view.map_number = next
