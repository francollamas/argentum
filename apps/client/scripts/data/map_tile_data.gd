class_name MapTileData
extends RefCounted

const LAYER_COUNT := 4

var layers: Array[int] = [0, 0, 0, 0]
var is_blocked := false
var trigger := 0


func _init(
	tile_layers: Array[int] = [0, 0, 0, 0],
	tile_is_blocked: bool = false,
	tile_trigger: int = 0,
) -> void:
	layers = tile_layers.duplicate()
	is_blocked = tile_is_blocked
	trigger = tile_trigger


func get_layer_graphic_id(layer_index: int) -> int:
	if layer_index < 0 or layer_index >= layers.size():
		return 0

	return layers[layer_index]


func has_graphic_on_layer(layer_index: int) -> bool:
	return get_layer_graphic_id(layer_index) > 0
