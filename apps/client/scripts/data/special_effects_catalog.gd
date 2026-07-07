class_name SpecialEffectsCatalog
extends RefCounted

static var _definitions_cache := {}


func _init() -> void:
	if _definitions_cache.is_empty():
		_definitions_cache = SpecialEffectsBinParser.new().parse()


func has_effect(effect_id: int) -> bool:
	return _definitions_cache.has(effect_id)


func get_effect(effect_id: int) -> SpecialEffectDefinition:
	if not _definitions_cache.has(effect_id):
		return null

	return _definitions_cache[effect_id]
