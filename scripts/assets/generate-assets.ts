import { generateTextures } from './generate-textures'
import { generateUITextures } from './generate-ui'
import { generateMSDFFonts } from './generate-fonts'

const args = process.argv.slice(2)
const validTargets = ['textures', 'ui', 'fonts']

async function main() {
	if (args.length === 0) {
		console.log('=== Generating All Assets ===\n')

		console.log('Generating packed textures...')
		await generateTextures()

		console.log('\nGenerating UI textures...')
		await generateUITextures()

		console.log('\nGenerating MSDF fonts...')
		await generateMSDFFonts()

		console.log('\n=== Asset generation complete! ===')
	} else {
		const invalidArgs = args.filter(arg => !validTargets.includes(arg))
		if (invalidArgs.length > 0) {
			console.error(`Invalid arguments: ${invalidArgs.join(', ')}`)
			console.error(`Valid options: ${validTargets.join(', ')}`)
			process.exit(1)
		}

		console.log(`=== Generating Assets: ${args.join(', ')} ===\n`)

		if (args.includes('textures')) {
			console.log('Generating packed textures...')
			await generateTextures()
		}

		if (args.includes('ui')) {
			console.log('\nGenerating UI textures...')
			await generateUITextures()
		}

		if (args.includes('fonts')) {
			console.log('\nGenerating MSDF fonts...')
			await generateMSDFFonts()
		}

		console.log('\n=== Asset generation complete! ===')
	}
}

main().catch((error) => {
	console.error('Asset generation failed:', error)
	process.exit(1)
})
