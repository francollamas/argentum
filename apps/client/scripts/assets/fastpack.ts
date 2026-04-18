import { execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'

const execFilePromise = util.promisify(execFile)
let fastPackPath: string | undefined

type PackProjectOptions = {
	projectPath: string
	outputPath: string
	name: string
}

export async function ensureFastPackInstalled() {
	const candidates = ['fastpack']
	const homeDirectory = process.env.HOME
	const cargoHome = process.env.CARGO_HOME

	if (cargoHome) {
		candidates.push(path.join(cargoHome, 'bin', 'fastpack'))
	}

	if (homeDirectory) {
		candidates.push(path.join(homeDirectory, '.cargo', 'bin', 'fastpack'))
	}

	for (const candidate of candidates) {
		try {
			await execFilePromise(candidate, ['--help'])
			fastPackPath = candidate
			return
		} catch {}
	}

	fastPackPath = undefined

	throw new Error(
		'FastPack CLI is not installed. Install Rust, then run `cargo install fastpack`.',
	)
}

export async function clearAtlasOutput(outputPath: string, prefixes: string[]) {
	const files = await fs.promises.readdir(outputPath).catch(() => [])

	await Promise.all(
		files
			.filter((file) => {
				if (file === 'spritesheets.json') {
					return true
				}

				return prefixes.some(
					(prefix) =>
						file.startsWith(prefix) &&
						(file.endsWith('.png') || file.endsWith('.json')),
				)
			})
			.map((file) =>
				fs.promises.rm(path.join(outputPath, file), { force: true }),
			),
	)
}

export async function packProject({
	projectPath,
	outputPath,
	name,
}: PackProjectOptions) {
	if (!fastPackPath) {
		await ensureFastPackInstalled()
	}

	const projectDirectory = path.dirname(projectPath)
	await fs.promises.mkdir(outputPath, { recursive: true })

	await execFilePromise(
		fastPackPath as string,
		[
			'pack',
			'--project',
			path.basename(projectPath),
			'--output',
			outputPath,
			'--name',
			name,
			'--data-format',
			'pixijs',
			'--texture-format',
			'png',
			'--pixel-format',
			'rgba8888',
			'--multipack',
		],
		{ cwd: projectDirectory },
	)
}
