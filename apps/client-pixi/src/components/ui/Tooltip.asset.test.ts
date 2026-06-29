/// <reference types="node" />

import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const projectRoot = process.cwd()

describe('tooltip UI assets', () => {
	it('includes the tooltip source svg', () => {
		const tooltipSourcePath = path.join(
			projectRoot,
			'tools/texpacker/ui/tooltip.svg',
		)

		expect(fs.existsSync(tooltipSourcePath)).toBe(true)

		const tooltipSource = fs.readFileSync(tooltipSourcePath, 'utf8')

		expect(tooltipSource).not.toMatch(/fill-opacity=/)
		expect(tooltipSource.match(/<rect\b/g)?.length).toBe(1)
	})

	it('keeps tooltip atlas entries reproducible', () => {
		const atlasPath = path.join(projectRoot, 'src/assets/ui/ui.json')
		const manifestPath = path.join(
			projectRoot,
			'src/assets/ui/spritesheets.json',
		)
		const atlas = JSON.parse(fs.readFileSync(atlasPath, 'utf8')) as {
			frames?: Record<string, unknown>
		}
		const manifest = JSON.parse(
			fs.readFileSync(manifestPath, 'utf8'),
		) as Record<string, string>

		expect(atlas.frames?.tooltip).toBeTruthy()
		expect(manifest.tooltip).toBe('ui')
	})
})
