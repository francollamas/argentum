class_name InitBinParser
extends RefCounted

const INITIAL_OFFSET := 263


static func open_file(path: String) -> FileAccess:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		push_error('Failed to open %s' % path)
		return null

	file.seek(INITIAL_OFFSET)
	return file


static func read_int16(file: FileAccess) -> int:
	var bytes := file.get_buffer(2)
	if bytes.size() < 2:
		return 0

	var value := bytes[0] | (bytes[1] << 8)
	if value >= 0x8000:
		value -= 0x10000

	return value
