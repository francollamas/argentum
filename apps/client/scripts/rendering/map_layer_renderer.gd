class_name MapLayerRenderer
extends Node2D

const TILE_SIZE := 32.0

var _factory := GraphicNodeFactory.new()


func render_layer(
	map_data,
	layer_index: int,
	start_tile_x: int,
	end_tile_x: int,
	start_tile_y: int,
	end_tile_y: int,
	center_graphics: bool,
) -> void:
	_clear_layer()

	for tile_y in range(start_tile_y, end_tile_y + 1):
		for tile_x in range(start_tile_x, end_tile_x + 1):
			var tile: Variant = map_data.get_tile(tile_x, tile_y)
			if tile == null:
				continue

			var graphic_id: int = tile.get_layer_graphic_id(layer_index)
			if graphic_id <= 0:
				continue

			var graphic_node := _factory.create_graphic_node_by_id(graphic_id)
			if graphic_node == null:
				continue

			_position_graphic_node(
				graphic_node,
				map_data.tile_to_pixel(tile_x, tile_y),
				center_graphics,
			)
			add_child(graphic_node)


func _position_graphic_node(graphic_node: Node2D, tile_position: Vector2, center_graphics: bool) -> void:
	var graphic_size := _get_graphic_size(graphic_node)
	var draw_position := tile_position

	if center_graphics:
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


func _clear_layer() -> void:
	for child in get_children():
		remove_child(child)
		child.queue_free()
