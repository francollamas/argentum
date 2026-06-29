@tool
extends Node2D

const RESOURCE_TYPES := [&'bodies', &'heads', &'helmets', &'shields', &'weapons']

var _resource_type := &'heads'
var _part_id := 0
var _direction := CharacterPartDefinition.DOWN

@export_enum('bodies', 'heads', 'helmets', 'shields', 'weapons') var resource_type: String:
	get:
		return String(_resource_type)
	set(value):
		_resource_type = StringName(value)
		_refresh_preview()

@export var part_id: int:
	get:
		return _part_id
	set(value):
		_part_id = value
		_refresh_preview()

@export_enum('up', 'left', 'down', 'right') var direction: String:
	get:
		return String(_direction)
	set(value):
		_direction = StringName(value)
		_refresh_preview()

var _catalog := CharacterPartsCatalog.new()
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

	if not RESOURCE_TYPES.has(_resource_type):
		push_warning('Unsupported character part type %s' % String(_resource_type))
		return

	if not _catalog.has_part(_resource_type, part_id):
		push_warning('%s part %d was not found' % [String(_resource_type), part_id])
		return

	var definition := _catalog.get_part(_resource_type, part_id)
	var sprite_id := definition.get_sprite_id(_direction)
	if sprite_id <= 0:
		push_warning('%s part %d has no sprite for %s' % [String(_resource_type), part_id, String(_direction)])
		return

	_preview_node = _factory.create_graphic_node_by_id(sprite_id)
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
