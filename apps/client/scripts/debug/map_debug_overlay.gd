class_name MapDebugOverlay
extends Node2D

const TILE_SIZE := 32.0
const BLOCKED_COLOR := Color(1.0, 0.1, 0.1, 0.3)
const ROOF_TRIGGER_COLOR := Color(0.2, 0.6, 1.0, 0.25)
const OTHER_TRIGGER_COLOR := Color(1.0, 0.8, 0.1, 0.2)
const CURRENT_TILE_COLOR := Color(1.0, 1.0, 0.1, 0.9)
const GRID_COLOR := Color(1.0, 1.0, 1.0, 0.08)
const ROOF_TRIGGERS := [1, 2, 4]

var map_data
var start_tile_x := 1
var end_tile_x := 1
var start_tile_y := 1
var end_tile_y := 1
var current_tile_x := 50
var current_tile_y := 50
var show_grid := true
var show_blocked := true
var show_triggers := true
var show_trigger_numbers := true


func configure(
	new_map_data,
	new_start_tile_x: int,
	new_end_tile_x: int,
	new_start_tile_y: int,
	new_end_tile_y: int,
	new_current_tile_x: int,
	new_current_tile_y: int,
) -> void:
	map_data = new_map_data
	start_tile_x = new_start_tile_x
	end_tile_x = new_end_tile_x
	start_tile_y = new_start_tile_y
	end_tile_y = new_end_tile_y
	current_tile_x = new_current_tile_x
	current_tile_y = new_current_tile_y
	queue_redraw()


func _draw() -> void:
	if map_data == null:
		return

	var fallback_font := ThemeDB.fallback_font
	var fallback_font_size := ThemeDB.fallback_font_size

	for tile_y in range(start_tile_y, end_tile_y + 1):
		for tile_x in range(start_tile_x, end_tile_x + 1):
			var tile: Variant = map_data.get_tile(tile_x, tile_y)
			if tile == null:
				continue

			var tile_position: Vector2 = map_data.tile_to_pixel(tile_x, tile_y)
			var tile_rect := Rect2(tile_position, Vector2(TILE_SIZE, TILE_SIZE))

			if show_blocked and tile.is_blocked:
				draw_rect(tile_rect, BLOCKED_COLOR, true)

			if show_triggers and tile.trigger > 0:
				var trigger_color := OTHER_TRIGGER_COLOR
				if ROOF_TRIGGERS.has(tile.trigger):
					trigger_color = ROOF_TRIGGER_COLOR
				draw_rect(tile_rect, trigger_color, true)

				if show_trigger_numbers and fallback_font != null:
					draw_string(
						fallback_font,
						tile_position + Vector2(4.0, 14.0),
						str(tile.trigger),
						HORIZONTAL_ALIGNMENT_LEFT,
						-1.0,
						fallback_font_size,
						Color.WHITE,
					)

			if show_grid:
				draw_rect(tile_rect, GRID_COLOR, false, 1.0)

	var current_tile_rect := Rect2(
		map_data.tile_to_pixel(current_tile_x, current_tile_y),
		Vector2(TILE_SIZE, TILE_SIZE),
	)
	draw_rect(current_tile_rect, CURRENT_TILE_COLOR, false, 2.0)
