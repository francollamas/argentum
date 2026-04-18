import fs from 'node:fs'
import path from 'node:path'
import type { SpritesheetData } from 'pixi.js'

type FrameData = Record<string, unknown>
type MutableSpritesheetData = SpritesheetData & {
	meta: SpritesheetData['meta'] & { scale: number }
}

async function loadJSON<T>(filePath: string): Promise<T> {
	const data = await fs.promises.readFile(filePath, 'utf-8')

	return JSON.parse(data)
}

function normalizeFrameName(frameName: string) {
	return frameName.replace(/\.(png|jpg|jpeg)$/i, '')
}

export function normalizeAtlasBaseName(baseName: string) {
	return baseName.replace(/\.(\d+)$/, '$1')
}

function sanitizeFrame(frame: FrameData) {
	const nextFrame = { ...frame }
	delete nextFrame.pivot
	delete nextFrame['9slicedFrame']

	return nextFrame
}

export async function patchSpritesheets(
	outputPath: string,
	resolution?: number,
) {
	const files = await fs.promises.readdir(outputPath)
	const jsonFiles = files.filter(
		(file) => file.endsWith('.json') && file !== 'spritesheets.json',
	)
	jsonFiles.sort((left, right) =>
		left.localeCompare(right, undefined, { numeric: true }),
	)

	for (const jsonFile of jsonFiles) {
		const jsonPath = path.join(outputPath, jsonFile)
		const data = await loadJSON<MutableSpritesheetData>(jsonPath)
		const frames = Object.fromEntries(
			Object.entries(data.frames).map(([frameName, frameData]) => [
				normalizeFrameName(frameName),
				sanitizeFrame(frameData as FrameData),
			]),
		) as SpritesheetData['frames']

		const nextData: MutableSpritesheetData = {
			...data,
			frames,
			meta:
				resolution === undefined
					? data.meta
					: { ...data.meta, scale: resolution },
		}

		await fs.promises.writeFile(jsonPath, JSON.stringify(nextData, null, 2))
	}
}

export async function generateSpritesheetManifest(outputPath: string) {
	const files = await fs.promises.readdir(outputPath)
	const jsonFiles = files.filter(
		(file) => file.endsWith('.json') && file !== 'spritesheets.json',
	)
	jsonFiles.sort((left, right) =>
		left.localeCompare(right, undefined, { numeric: true }),
	)

	const entries: string[] = []
	for (const jsonFile of jsonFiles) {
		const jsonPath = path.join(outputPath, jsonFile)
		const jsonData = await loadJSON<SpritesheetData>(jsonPath)
		const keys = Object.keys(jsonData.frames)
		const baseName = normalizeAtlasBaseName(path.basename(jsonPath, '.json'))

		for (const key of keys) {
			entries.push(`  "${key}": "${baseName}"`)
		}
	}

	const manifest = `{\n${entries.join(',\n')}\n}\n`
	await fs.promises.writeFile(
		path.join(outputPath, 'spritesheets.json'),
		manifest,
	)
}
