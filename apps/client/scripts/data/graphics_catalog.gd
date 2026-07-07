class_name GraphicsCatalog
extends RefCounted

static var _definitions_cache: Dictionary[int, SpriteDefinition] = {}


func _init() -> void:
	if _definitions_cache.is_empty():
		_definitions_cache = SpritesBinParser.new().parse()


func has_graphic(graphic_id: int) -> bool:
	return _definitions_cache.has(graphic_id)


func get_graphic(graphic_id: int) -> SpriteDefinition:
	if not _definitions_cache.has(graphic_id):
		return null

	return _definitions_cache[graphic_id]
