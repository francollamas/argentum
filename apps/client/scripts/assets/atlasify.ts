import { execFile } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'

const execFilePromise = util.promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const atlasifyPath = path.join(
	__dirname,
	'../../node_modules/.bin',
	process.platform === 'win32' ? 'atlasify.cmd' : 'atlasify',
)

type PackAtlasOptions = {
	inputPath: string
	outputPath: string
	outputName: string
	width: number
	height: number
}

export async function ensureAtlasifyInstalled() {
	try {
		await fs.promises.access(atlasifyPath)
	} catch {
		throw new Error('atlasify is not installed. Run `pnpm install`.')
	}
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

export async function packAtlas({
	inputPath,
	outputPath,
	outputName,
	width,
	height,
}: PackAtlasOptions) {
	await ensureAtlasifyInstalled()
	await fs.promises.mkdir(outputPath, { recursive: true })

	await execFilePromise(
		atlasifyPath,
		[
			'-o',
			`${outputName}.png`,
			'-m',
			`${width},${height}`,
			'-p',
			'0',
			'-b',
			'0',
			'--search-dummy',
			inputPath,
		],
		{ cwd: outputPath },
	)
}
