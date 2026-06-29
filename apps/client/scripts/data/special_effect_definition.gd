class_name SpecialEffectDefinition
extends RefCounted

var id: int
var sprite_id: int
var offset: Vector2i


func _init(effect_id: int, effect_sprite_id: int, effect_offset: Vector2i) -> void:
	id = effect_id
	sprite_id = effect_sprite_id
	offset = effect_offset


func has_sprite() -> bool:
	return sprite_id > 0
