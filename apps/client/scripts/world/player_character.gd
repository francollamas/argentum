@tool
class_name PlayerCharacter
extends Node2D

const RESOURCE_TYPE := &'bodies'
const TILE_SIZE := 32.0

@export var part_id := 9:
	get:
		return _part_id
	set(value):
		if _part_id == value:
			return
		_part_id = value
		_refresh_graphic()

var _part_id := 9
var _direction: StringName = CharacterPartDefinition.DOWN
var _is_moving := false
var _catalog := CharacterPartsCatalog.new()
var _factory := GraphicNodeFactory.new()
var _graphic_node: Node2D
var _current_sprite_id := -1


func _ready() -> void:
	_refresh_graphic()


func set_direction(direction: StringName) -> void:
	if _direction == direction:
		return

	_direction = direction
	_refresh_graphic()


func set_moving(is_moving: bool) -> void:
	if _is_moving == is_moving:
		return

	_is_moving = is_moving
	_apply_animation_state()


func _refresh_graphic() -> void:
	if not is_inside_tree():
		return

	if not _catalog.has_part(RESOURCE_TYPE, _part_id):
		push_warning('Body part %d was not found' % _part_id)
		_clear_graphic()
		return

	var definition := _catalog.get_part(RESOURCE_TYPE, _part_id)
	var sprite_id := definition.get_sprite_id(_direction)
	if sprite_id <= 0:
		push_warning('Body part %d has no sprite for %s' % [_part_id, String(_direction)])
		_clear_graphic()
		return

	if _current_sprite_id != sprite_id:
		_rebuild_graphic(sprite_id)

	if _graphic_node != null:
		_graphic_node.position = _calculate_graphic_offset(definition)
	_apply_animation_state()


func _rebuild_graphic(sprite_id: int) -> void:
	_clear_graphic()
	_graphic_node = _factory.create_graphic_node_by_id(sprite_id)
	_current_sprite_id = sprite_id
	if _graphic_node == null:
		return

	if _graphic_node is Sprite2D:
		_graphic_node.centered = false
	elif _graphic_node is AnimatedSprite2D:
		_graphic_node.centered = false

	add_child(_graphic_node)


func _apply_animation_state() -> void:
	if not is_instance_valid(_graphic_node):
		return

	if _graphic_node is AnimatedSprite2D:
		if _is_moving:
			_graphic_node.play()
		else:
			_graphic_node.stop()
			_graphic_node.frame = 0


func _calculate_graphic_offset(definition: CharacterPartDefinition) -> Vector2:
	var graphic_size := _get_graphic_size()
	return Vector2(
		-graphic_size.x / 2.0,
		TILE_SIZE / 2.0 - graphic_size.y,
	) + Vector2(definition.offset)


func _get_graphic_size() -> Vector2:
	if _graphic_node is Sprite2D and _graphic_node.texture != null:
		return _graphic_node.texture.get_size()

	if _graphic_node is AnimatedSprite2D and _graphic_node.sprite_frames != null:
		var texture: Texture2D = _graphic_node.sprite_frames.get_frame_texture(_graphic_node.animation, 0)
		if texture != null:
			return texture.get_size()

	return Vector2(TILE_SIZE, TILE_SIZE)


func _clear_graphic() -> void:
	_current_sprite_id = -1
	if not is_instance_valid(_graphic_node):
		return

	remove_child(_graphic_node)
	_graphic_node.queue_free()
	_graphic_node = null
