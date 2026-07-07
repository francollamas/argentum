class_name CharacterPartsBinParser
extends RefCounted

const FILE_PATHS := {
	&'bodies': 'res://assets/inits/bodies.odir.bin',
	&'heads': 'res://assets/inits/heads.dir.bin',
	&'helmets': 'res://assets/inits/helmets.dir.bin',
	&'shields': 'res://assets/inits/shields.dir.bin',
	&'weapons': 'res://assets/inits/weapons.dir.bin',
}


func parse(resource_type: StringName) -> Dictionary:
	if not FILE_PATHS.has(resource_type):
		push_error('Unsupported character part resource type %s' % String(resource_type))
		return {}

	var path: String = FILE_PATHS[resource_type]
	var file := InitBinParser.open_file(path)
	if file == null:
		return {}

	var has_offset := path.ends_with('odir.bin')
	var quantity := InitBinParser.read_int16(file)
	var definitions := {}

	for part_id in range(quantity):
		var directions := {}
		for direction in CharacterPartDefinition.DIRECTION_ORDER:
			directions[direction] = InitBinParser.read_int16(file)

		var offset := Vector2i.ZERO
		if has_offset:
			offset = Vector2i(
				InitBinParser.read_int16(file),
				InitBinParser.read_int16(file),
			)

		definitions[part_id] = CharacterPartDefinition.new(part_id, directions, offset)

	return definitions
