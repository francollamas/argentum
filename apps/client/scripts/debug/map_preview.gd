@tool
extends Node2D

@onready var _world_map_view = $WorldMapView


func _ready() -> void:
	if _world_map_view == null:
		push_error('MapPreview requires a WorldMapView child node')
