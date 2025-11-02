# Mejoras al Proyecto Argentum

Este es un archivo con mejoras o cambios que quiero que hagas en el código que fue autogenerado con IA.

## Instrucciones Generales

- Por favor ejecuta paso por paso, y pídeme aprobación entre cada ítem planteado.
- Actualmente casi todo está funcionando correctamente, los cambios que te voy a pedir son cambios de arquitectura, no debes romper funcionalidad existente.
- Recuerda que prefiero responsabilidades bien separadas, y si hay funciones que se pueden separar en otro lado, muévelas de lugar y unifícalas.
- Eres un EXPERTO en refactors de React y PixiJS respetando buena arquitectura. El código debe quedar limpio y entendible, sin código spaghetti.

**IMPORTANTE:**
- NO me consientas, no tengo la razón en todo. Si crees que estoy equivocado en algo házmelo saber!
- Si tienes dudas pregúntame todo lo que sea necesario!
- Usa el MCP de Context7 para consultar documentación de Pixi, React, React Pixi, Redux Toolkit, etc.

---

## 1. CARGA DE MAPA

- [x] **a.** En el `mapLoader()` hay una función `getMap()` que internamente usa un cache. Por el momento NO necesito tener más de un mapa en la memoria! por lo que podrías usar momentáneamente la misma KEY para acceder al mapa! No necesito que `Assets.cache()` guarde todos los mapas que vaya cargando. Con solo cargar uno por vez me basta!

- [x] **b.** Esa función `getMap()` prefiero que se llame `loadMap()` y que esté al principio del archivo, para que mantenga consistencia con los otros loaders!

- [x] **c.** Al hook `useMapLoader()` lo estás usando tanto en MapNavigator como MapRenderer. ¿Está ok usarlo así? o ¿un componente debería pasárselo como parámetro al otro?. Fíjate que en uno solo le usas la variable 'map', pero en el otro además de 'map' usas 'loading' y 'error'. Actúa según las mejores prácticas de React.

## 2. CÁMARA

- [x] **a.** No me convence el nombre del componente MapNavigator. Siendo que es el componente principal y donde pasa todo el juego, ¿qué nombre recomiendas? ¿World lo ves una buena opción? ¿Algún otro nombre? → **Renombrado a GameView**

- [x] **b.** Fíjate si el `useSmoothCamera` y las funciones definidas en `usePlayer()` están bien o necesitan alguna redefinición arquitectónica! Me gustaría que sea simple de seguir! Fíjate si toda la lógica de conversión de píxeles puedes dejarla encapsulada en algunos pocos lugares, pero en el resto del código hablar en términos de TILES. Solo fíjate que es lo mejor.

## 3. MAP RENDERER

- [x] **a.** Me cuesta seguir los useEffects que tiene. Tiene mucha información sobre animaciones. ¿Se podría separar en otros hooks? ¡Solo si lo ves conveniente!

- [x] **b.** Al iniciar el juego, si el personaje YA se encuentra en un trigger de techo, los techos NO desaparecen. Recién desaparecen cuando se mueve para algún lado a otro tile que también tiene un trigger de techo. ¿Quizás tenga que ver con inicialización? ¿Algo que falte?

## 4. DEBUG

- [x] **a.** El componente de Debug también es medio complicado de seguir, ¿tienes forma de mejorarlo o de partirlo en más componentes?

## 5. QUITAR CÓDIGO QUE NO SE USA

- [x] **a.** Explora todo el proyecto y quita el código que no se use. Has hecho hasta ahora muchas iteraciones y creo que te olvidaste de quitar cosas cuando te pedí un cambio. → **Eliminados: useInput.ts, useTexture.ts**

## 6. MEJORAS QUE CONSIDERES

- [x] **a.** Quiero que repases TODO el código generado hasta el momento para este proyecto. Y si ves mejoras arquitectónicas que me van a permitir agregar funcionalidades fácilmente y va a mantener legibilidad, entonces hazlo por favor!

---

## ✅ RESUMEN DE MEJORAS COMPLETADAS

### Mejoras Arquitectónicas Aplicadas:

1. **Carga de Mapas Optimizada**
   - Cache estático (solo un mapa en memoria)
   - Función renombrada de `getMap()` a `loadMap()`
   - Hook `useMapLoader()` llamado una sola vez (en GameView)
   - Props correctamente propagadas a componentes hijos

2. **Separación de Responsabilidades**
   - Componente principal renombrado: `MapNavigator` → `GameView` (más descriptivo)
   - Debug dividido en sub-componentes especializados:
     - `PlayerPositionIndicator`
     - `BlockedTileIndicator`
     - `TriggerNumberDisplay`
     - Hook `useDebugVisibleTiles` para lógica de cálculo

3. **Lógica de Animación Encapsulada**
   - Hook `useRoofAnimation` para animación de techos
   - Bug de inicialización de techos corregido
   - Código más limpio y reutilizable

4. **Conversiones de Coordenadas Centralizadas**
   - Nuevo archivo `utils/coordinates.ts` con:
     - `tileToPixel()` - Convierte coordenadas de tile a píxeles
     - `pixelToTile()` - Convierte píxeles a coordenadas de tile
     - `arrayIndexToPixel()` - Convierte índice de array a píxeles
     - `worldTileToArrayIndex()` - Convierte coordenadas mundiales a índices
     - `arrayIndexToWorldTile()` - Convierte índices a coordenadas mundiales
   - Toda la lógica de conversión en un solo lugar
   - Código más legible hablando en términos de TILES

5. **Código Limpio**
   - Eliminados hooks sin usar: `useInput.ts`, `useTexture.ts`
   - Build exitoso sin errores de TypeScript
   - Linter limpio

### Beneficios de la Nueva Arquitectura:

- ✅ **Mantenibilidad**: Código más fácil de entender y modificar
- ✅ **Reutilización**: Hooks y utilidades bien definidas
- ✅ **Performance**: Carga de mapas optimizada (un solo mapa en memoria)
- ✅ **Escalabilidad**: Fácil agregar nuevas funcionalidades
- ✅ **Legibilidad**: Separación clara de responsabilidades