@tool
class_name WorldMidLayerRenderer
extends Node2D

const TILE_SIZE := 32.0

var _factory := GraphicNodeFactory.new()
var _layer3_nodes: Dictionary = {}
var _layer3_graphics: Dictionary = {}
var _managed_actor_nodes: Dictionary = {}


func render_mid_layer(
	map_data,
	start_tile_x: int,
	end_tile_x: int,
	start_tile_y: int,
	end_tile_y: int,
	actors: Array[Dictionary],
) -> void:
	var visible_layer3_keys := {}
	var actors_by_tile := _build_actors_by_tile(actors)
	var visible_actor_ids := {}

	for tile_y in range(start_tile_y, end_tile_y + 1):
		for tile_x in range(start_tile_x, end_tile_x + 1):
			var tile_key := Vector2i(tile_x, tile_y)
			var tile_actors: Array = actors_by_tile.get(tile_key, [])
			for actor_entry in tile_actors:
				var actor_id: StringName = actor_entry['id']
				visible_actor_ids[actor_id] = true
				var actor_node := _attach_actor_node(actor_entry)
				if actor_node == null:
					continue

				actor_node.visible = true
				actor_node.position = (actor_entry['world_position'] as Vector2).round()
				move_child(actor_node, get_child_count() - 1)

			var tile = map_data.get_tile(tile_x, tile_y)
			if tile == null:
				continue

			var graphic_id: int = tile.get_layer_graphic_id(2)
			if graphic_id <= 0:
				continue

			visible_layer3_keys[tile_key] = true
			var graphic_node := _get_or_create_layer3_node(tile_key, graphic_id)
			if graphic_node == null:
				continue

			_position_layer3_node(graphic_node, map_data.tile_to_pixel(tile_x, tile_y))
			move_child(graphic_node, get_child_count() - 1)

	_clear_missing_layer3_nodes(visible_layer3_keys)
	_update_actor_visibility(visible_actor_ids)


func update_actor_positions(actors: Array[Dictionary]) -> void:
	var visible_actor_ids := {}
	for actor_entry in actors:
		var actor_id: StringName = actor_entry['id']
		visible_actor_ids[actor_id] = true
		var actor_node := _attach_actor_node(actor_entry)
		if actor_node == null:
			continue

		actor_node.visible = true
		actor_node.position = (actor_entry['world_position'] as Vector2).round()

	_update_actor_visibility(visible_actor_ids)


func clear_layer() -> void:
	for tile_key in _layer3_nodes.keys():
		_remove_layer3_node(tile_key)

	for actor_id in _managed_actor_nodes.keys():
		var actor_node: Node2D = _managed_actor_nodes[actor_id]
		if is_instance_valid(actor_node):
			actor_node.visible = false


func _build_actors_by_tile(actors: Array[Dictionary]) -> Dictionary:
	var actors_by_tile := {}
	for actor_entry in actors:
		var tile_key: Vector2i = actor_entry['tile_position']
		if not actors_by_tile.has(tile_key):
			actors_by_tile[tile_key] = []
		actors_by_tile[tile_key].append(actor_entry)

	return actors_by_tile


func _attach_actor_node(actor_entry: Dictionary) -> Node2D:
	var actor_id: StringName = actor_entry['id']
	var actor_node: Node2D = actor_entry['node']
	if actor_node == null:
		return null

	if actor_node.get_parent() != self:
		if actor_node.get_parent() != null:
			actor_node.reparent(self)
		else:
			add_child(actor_node)

	_managed_actor_nodes[actor_id] = actor_node
	return actor_node


func _update_actor_visibility(visible_actor_ids: Dictionary) -> void:
	for actor_id in _managed_actor_nodes.keys():
		var actor_node: Node2D = _managed_actor_nodes[actor_id]
		if not is_instance_valid(actor_node):
			_managed_actor_nodes.erase(actor_id)
			continue

		actor_node.visible = visible_actor_ids.has(actor_id)


func _get_or_create_layer3_node(tile_key: Vector2i, graphic_id: int) -> Node2D:
	if _layer3_nodes.has(tile_key):
		if _layer3_graphics.get(tile_key) == graphic_id:
			return _layer3_nodes[tile_key]

		_remove_layer3_node(tile_key)

	var graphic_node := _factory.create_graphic_node_by_id(graphic_id)
	if graphic_node == null:
		return null

	_layer3_nodes[tile_key] = graphic_node
	_layer3_graphics[tile_key] = graphic_id
	add_child(graphic_node)
	return graphic_node


func _clear_missing_layer3_nodes(visible_layer3_keys: Dictionary) -> void:
	for tile_key in _layer3_nodes.keys():
		if visible_layer3_keys.has(tile_key):
			continue

		_remove_layer3_node(tile_key)


func _remove_layer3_node(tile_key: Vector2i) -> void:
	if not _layer3_nodes.has(tile_key):
		return

	var graphic_node: Node = _layer3_nodes[tile_key]
	_layer3_nodes.erase(tile_key)
	_layer3_graphics.erase(tile_key)

	if is_instance_valid(graphic_node):
		remove_child(graphic_node)
		graphic_node.queue_free()


func _position_layer3_node(graphic_node: Node2D, tile_position: Vector2) -> void:
	var graphic_size := _get_graphic_size(graphic_node)
	var draw_position := tile_position

	if graphic_size.x != TILE_SIZE:
		draw_position.x -= graphic_size.x / 2.0 - TILE_SIZE / 2.0

	if graphic_size.y != TILE_SIZE:
		draw_position.y -= graphic_size.y - TILE_SIZE

	if graphic_node is Sprite2D:
		graphic_node.centered = false
	elif graphic_node is AnimatedSprite2D:
		graphic_node.centered = false

	graphic_node.position = draw_position.round()


func _get_graphic_size(graphic_node: Node2D) -> Vector2:
	if graphic_node is Sprite2D and graphic_node.texture != null:
		return graphic_node.texture.get_size()

	if graphic_node is AnimatedSprite2D and graphic_node.sprite_frames != null:
		var texture: Texture2D = graphic_node.sprite_frames.get_frame_texture(graphic_node.animation, 0)
		if texture != null:
			return texture.get_size()

	return Vector2(TILE_SIZE, TILE_SIZE)
