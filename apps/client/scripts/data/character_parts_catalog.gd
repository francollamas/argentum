class_name CharacterPartsCatalog
extends RefCounted

static var _definitions_cache := {}


func has_part(resource_type: StringName, part_id: int) -> bool:
	_ensure_loaded(resource_type)
	return _get_definitions(resource_type).has(part_id)


func get_part(resource_type: StringName, part_id: int) -> CharacterPartDefinition:
	var definitions := _get_definitions(resource_type)
	if not definitions.has(part_id):
		return null

	return definitions[part_id]


func _ensure_loaded(resource_type: StringName) -> void:
	if _definitions_cache.has(resource_type):
		return

	_definitions_cache[resource_type] = CharacterPartsBinParser.new().parse(resource_type)


func _get_definitions(resource_type: StringName) -> Dictionary:
	_ensure_loaded(resource_type)
	return _definitions_cache.get(resource_type, {})
