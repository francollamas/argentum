class_name MapParser
extends RefCounted

const MAPS_BASE_PATH := 'res://assets/maps'
const MAP_DATA_SCRIPT := preload('res://scripts/data/map_data.gd')
const MAP_TILE_DATA_SCRIPT := preload('res://scripts/data/map_tile_data.gd')
const MIN_TILE_X := 1
const MIN_TILE_Y := 1
const MAX_TILE_X := 100
const MAX_TILE_Y := 100
const HEADER_SIZE := 273
const FLAG_BLOCKED := 1
const FLAG_LAYER_2 := 2
const FLAG_LAYER_3 := 4
const FLAG_LAYER_4 := 8
const FLAG_TRIGGER := 16


func parse_map(map_number: int):
	var map_path := '%s/%d.mmap' % [MAPS_BASE_PATH, map_number]
	return parse_map_file(map_path, map_number)


func parse_map_file(path: String, map_number: int = 0):
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		push_error('Failed to open map file %s' % path)
		return null

	file.seek(HEADER_SIZE)

	var tiles: Array = []

	for tile_y in range(MIN_TILE_Y, MAX_TILE_Y + 1):
		for tile_x in range(MIN_TILE_X, MAX_TILE_X + 1):
			var flags := file.get_8()
			var layer_values: Array[int] = [0, 0, 0, 0]
			var trigger := 0

			layer_values[0] = _read_uint16(file)

			if (flags & FLAG_LAYER_2) != 0:
				layer_values[1] = _read_uint16(file)

			if (flags & FLAG_LAYER_3) != 0:
				layer_values[2] = _read_uint16(file)

			if (flags & FLAG_LAYER_4) != 0:
				layer_values[3] = _read_uint16(file)

			if (flags & FLAG_TRIGGER) != 0:
				trigger = _read_uint16(file)

			tiles.append(MAP_TILE_DATA_SCRIPT.new(layer_values, (flags & FLAG_BLOCKED) != 0, trigger))

	return MAP_DATA_SCRIPT.new(map_number, tiles)


func _read_uint16(file: FileAccess) -> int:
	var bytes := file.get_buffer(2)
	if bytes.size() < 2:
		return 0

	return bytes[0] | (bytes[1] << 8)
