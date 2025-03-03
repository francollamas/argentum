import { useSpritesParser } from './useSpritesParser.ts'

export const useCustomParsers = () => {
	const spritesParserDefined = useSpritesParser()

	return spritesParserDefined
}
