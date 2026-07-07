class_name MapData
extends RefCounted

const MIN_TILE_X := 1
const MIN_TILE_Y := 1
const MAX_TILE_X := 100
const MAX_TILE_Y := 100
const TILE_SIZE := 32

var number := 0
var width := 100
var height := 100
var min_tile_x := MIN_TILE_X
var min_tile_y := MIN_TILE_Y
var max_tile_x := MAX_TILE_X
var max_tile_y := MAX_TILE_Y
var _tiles: Array = []


func _init(map_number: int, map_tiles: Array) -> void:
	number = map_number
	width = MAX_TILE_X - MIN_TILE_X + 1
	height = MAX_TILE_Y - MIN_TILE_Y + 1
	_tiles = map_tiles


func get_tile(tile_x: int, tile_y: int):
	if not has_tile(tile_x, tile_y):
		return null

	return _tiles[_to_index(tile_x, tile_y)]


func has_tile(tile_x: int, tile_y: int) -> bool:
	return (
		tile_x >= min_tile_x
		and tile_x <= max_tile_x
		and tile_y >= min_tile_y
		and tile_y <= max_tile_y
	)


func tile_to_pixel(tile_x: int, tile_y: int) -> Vector2:
	return Vector2(
		float(tile_x - min_tile_x) * TILE_SIZE,
		float(tile_y - min_tile_y) * TILE_SIZE,
	)


func get_pixel_size() -> Vector2:
	return Vector2(float(width * TILE_SIZE), float(height * TILE_SIZE))


func _to_index(tile_x: int, tile_y: int) -> int:
	var local_x := tile_x - min_tile_x
	var local_y := tile_y - min_tile_y
	return local_y * width + local_x
