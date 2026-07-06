class_name GraphicNodeFactory
extends RefCounted

const GRAPHICS_BASE_PATH := 'res://assets/graphics/world'
const DEFAULT_ANIMATION_NAME := &'default'
const DEFAULT_ANIMATION_FPS := 1.0
const PIXI_TICK_RATE := 60.0

static var _static_texture_cache: Dictionary = {}
static var _animated_frames_cache: Dictionary = {}

var _catalog := GraphicsCatalog.new()


func create_graphic_node(definition: SpriteDefinition) -> Node2D:
	if definition == null:
		push_error('Cannot build a graphic node from a null SpriteDefinition')
		return null

	if not definition.has_frames():
		push_error('Graphic %d has no frames to render' % definition.id)
		return null

	if definition.is_static():
		return _create_static_sprite(definition)

	return _create_animated_sprite(definition)


func create_graphic_node_by_id(graphic_id: int) -> Node2D:
	if not _catalog.has_graphic(graphic_id):
		push_error('Graphic %d was not found in sprites.bin' % graphic_id)
		return null

	return create_graphic_node(_catalog.get_graphic(graphic_id))



func _create_static_sprite(definition: SpriteDefinition) -> Sprite2D:
	var texture := _get_static_texture(definition)
	if texture == null:
		return null

	var sprite := Sprite2D.new()
	sprite.texture = texture
	sprite.centered = true
	return sprite


func _create_animated_sprite(definition: SpriteDefinition) -> AnimatedSprite2D:
	var sprite_frames := _get_animated_frames(definition)
	if sprite_frames == null:
		return null

	var sprite := AnimatedSprite2D.new()
	sprite.centered = true
	sprite.sprite_frames = sprite_frames
	sprite.animation = DEFAULT_ANIMATION_NAME
	sprite.play(DEFAULT_ANIMATION_NAME)
	return sprite


func _get_static_texture(definition: SpriteDefinition) -> AtlasTexture:
	if _static_texture_cache.has(definition.id):
		return _static_texture_cache[definition.id]

	var texture := _build_frame_texture(definition)
	if texture == null:
		return null

	_static_texture_cache[definition.id] = texture
	return texture


func _get_animated_frames(definition: SpriteDefinition) -> SpriteFrames:
	if _animated_frames_cache.has(definition.id):
		return _animated_frames_cache[definition.id]

	var sprite_frames := SpriteFrames.new()
	sprite_frames.set_animation_loop_mode(DEFAULT_ANIMATION_NAME, SpriteFrames.LOOP_LINEAR)

	var loaded_frames := 0
	for frame_id in definition.frames:
		var frame_definition := _catalog.get_graphic(frame_id)
		if frame_definition == null:
			push_error('Animated graphic %d references unknown frame %d' % [definition.id, frame_id])
			continue

		var texture := _get_static_texture(frame_definition)
		if texture == null:
			continue

		sprite_frames.add_frame(DEFAULT_ANIMATION_NAME, texture)
		loaded_frames += 1

	if loaded_frames == 0:
		push_error('Animated graphic %d has no valid frame textures' % definition.id)
		return null

	var animation_fps: float = maxf(
		definition.speed * PIXI_TICK_RATE,
		DEFAULT_ANIMATION_FPS,
	)
	sprite_frames.set_animation_speed(DEFAULT_ANIMATION_NAME, animation_fps)
	_animated_frames_cache[definition.id] = sprite_frames
	return sprite_frames



func _build_frame_texture(definition: SpriteDefinition) -> AtlasTexture:
	if definition == null:
		return null

	if not definition.has_texture_region():
		push_error('Graphic %d has no texture region metadata' % definition.id)
		return null

	var source_texture := _load_source_texture(definition.texture_id)
	if source_texture == null:
		return null

	var atlas_texture := AtlasTexture.new()
	atlas_texture.atlas = source_texture
	atlas_texture.region = Rect2(definition.region.position, definition.region.size)
	return atlas_texture


func _load_source_texture(texture_id: int) -> Texture2D:
	var texture_path := '%s/%d.png' % [GRAPHICS_BASE_PATH, texture_id]
	if not FileAccess.file_exists(texture_path):
		push_error('Missing source texture %d at %s' % [texture_id, texture_path])
		return null

	return load(texture_path) as Texture2D
