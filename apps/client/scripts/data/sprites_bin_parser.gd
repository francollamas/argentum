class_name SpritesBinParser
extends RefCounted

const SPRITES_BIN_PATH := 'res://assets/inits/sprites.bin'
const INITIAL_OFFSET := 4
const PIXI_SPEED_DIVISOR := 2025.0


func parse() -> Dictionary[int, SpriteDefinition]:
	var file := FileAccess.open(SPRITES_BIN_PATH, FileAccess.READ)
	if file == null:
		push_error('Failed to open %s' % SPRITES_BIN_PATH)
		return {}

	var definitions: Dictionary[int, SpriteDefinition] = {}
	file.seek(INITIAL_OFFSET)

	var quantity := file.get_32()
	while file.get_position() < file.get_length():
		var index := file.get_32()
		if index <= 0 or index > quantity:
			push_error('Invalid sprite index %d while parsing sprites.bin' % index)
			break

		var frame_count := file.get_16()
		if frame_count <= 0:
			push_warning('Sprite %d has no frames and will be skipped' % index)
			continue

		if frame_count == 1:
			var texture_id := file.get_32()
			var region_x := file.get_16()
			var region_y := file.get_16()
			var region_width := file.get_16()
			var region_height := file.get_16()
			var region := Rect2i(region_x, region_y, region_width, region_height)
			definitions[index] = SpriteDefinition.new(index, [index], 0.0, texture_id, region)
			continue

		var frames: Array[int] = []
		for frame_offset in range(frame_count):
			var frame_id := file.get_32()
			if frame_id <= 0 or frame_id > quantity:
				push_warning(
					'Ignoring invalid frame %d for animated sprite %d at offset %d'
					% [frame_id, index, frame_offset]
				)
				continue

			frames.append(frame_id)

		var speed := file.get_float() / PIXI_SPEED_DIVISOR
		definitions[index] = SpriteDefinition.new(index, frames, speed)

	return definitions
