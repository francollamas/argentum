@tool
extends Node2D

var _graphic_id := 1

@export var graphic_id: int:
	get:
		return _graphic_id
	set(value):
		_graphic_id = value
		_refresh_graphic()

var _catalog := GraphicsCatalog.new()
var _factory := GraphicNodeFactory.new()
var _graphic_node: Node2D


func _ready() -> void:
	_refresh_graphic()


func _enter_tree() -> void:
	_refresh_graphic()


func _refresh_graphic() -> void:
	if not is_inside_tree():
		return

	_clear_generated_preview_nodes()

	if not _catalog.has_graphic(graphic_id):
		push_warning('Graphic %d was not found in sprites.bin' % graphic_id)
		return

	var definition := _catalog.get_graphic(graphic_id)
	_graphic_node = _factory.create_graphic_node(definition)
	if _graphic_node == null:
		return

	add_child(_graphic_node)
	if Engine.is_editor_hint():
		_graphic_node.position = Vector2.ZERO
		return

	_graphic_node.position = get_viewport_rect().size / 2.0


func _clear_generated_preview_nodes() -> void:
	if is_instance_valid(_graphic_node):
		remove_child(_graphic_node)
		_graphic_node.queue_free()
		_graphic_node = null

	for child in get_children():
		if child is Node and String(child.name).begins_with('_'):
			remove_child(child)
			child.queue_free()
