class_name SpecialEffectsBinParser
extends RefCounted

const SPECIAL_EFFECTS_BIN_PATH := 'res://assets/inits/specialeffects.o.bin'


func parse() -> Dictionary:
	var file := InitBinParser.open_file(SPECIAL_EFFECTS_BIN_PATH)
	if file == null:
		return {}

	var quantity := InitBinParser.read_int16(file)
	var definitions := {}

	for effect_id in range(quantity):
		definitions[effect_id] = SpecialEffectDefinition.new(
			effect_id,
			InitBinParser.read_int16(file),
			Vector2i(
				InitBinParser.read_int16(file),
				InitBinParser.read_int16(file),
			),
		)

	return definitions
