@tool
extends Node2D

var _effect_id := 0

@export var effect_id: int:
	get:
		return _effect_id
	set(value):
		_effect_id = value
		_refresh_preview()

var _catalog := SpecialEffectsCatalog.new()
var _factory := GraphicNodeFactory.new()
var _preview_node: Node2D


func _ready() -> void:
	_refresh_preview()


func _enter_tree() -> void:
	_refresh_preview()


func _refresh_preview() -> void:
	if not is_inside_tree():
		return

	_clear_generated_preview_nodes()

	if not _catalog.has_effect(effect_id):
		push_warning('Special effect %d was not found' % effect_id)
		return

	var definition := _catalog.get_effect(effect_id)
	if not definition.has_sprite():
		push_warning('Special effect %d has no sprite assigned' % effect_id)
		return

	_preview_node = _factory.create_graphic_node_by_id(definition.sprite_id)
	if _preview_node == null:
		return

	add_child(_preview_node)
	var offset := Vector2(definition.offset)
	if Engine.is_editor_hint():
		_preview_node.position = offset
		return

	_preview_node.position = (get_viewport_rect().size / 2.0) + offset


func _clear_generated_preview_nodes() -> void:
	if is_instance_valid(_preview_node):
		remove_child(_preview_node)
		_preview_node.queue_free()
		_preview_node = null

	for child in get_children():
		if child is Node and String(child.name).begins_with('_'):
			remove_child(child)
			child.queue_free()
