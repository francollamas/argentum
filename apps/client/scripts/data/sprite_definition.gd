class_name SpriteDefinition
extends RefCounted

var id: int
var frames: Array[int]
var speed: float
var texture_id: int
var region: Rect2i


func _init(
	sprite_id: int,
	sprite_frames: Array[int],
	sprite_speed: float,
	sprite_texture_id: int = -1,
	sprite_region: Rect2i = Rect2i(),
) -> void:
	id = sprite_id
	frames = sprite_frames
	speed = sprite_speed
	texture_id = sprite_texture_id
	region = sprite_region


func is_animated() -> bool:
	return frames.size() > 1


func is_static() -> bool:
	return frames.size() == 1


func has_frames() -> bool:
	return not frames.is_empty()


func has_texture_region() -> bool:
	return texture_id > 0 and region.size.x > 0 and region.size.y > 0


func get_primary_frame_id() -> int:
	if frames.is_empty():
		return -1

	return frames[0]
