# Arquitectura del Proyecto Argentum Online

## Visión General

Argentum Online es un MMORPG 2D sencillo implementado con React 19, PixiJS 8 y Redux Toolkit. La arquitectura prioriza simplicidad y mantenibilidad sobre abstracción excesiva.

## Principios Fundamentales

### 1. Simplicidad Primero
- Solo agregar complejidad cuando sea necesaria
- Prefiere composición sobre herencia
- Evita abstracciones prematuras

### 2. Separación Clara de Responsabilidades
- Componentes React: solo presentación
- Hooks: lógica reutilizable
- Services: comunicación externa y lógica compleja
- Redux: estado global

## Estructura de Carpetas

```
src/
├── components/          # Componentes React
│   ├── common/         # Componentes reutilizables (Button, Modal)
│   ├── game/           # Componentes del juego (Map, Player, HUD)
│   └── screens/        # Pantallas completas (Login, Game, Settings)
├── hooks/              # Custom hooks
├── services/           # Lógica de negocio externa
├── store/              # Redux store y slices
├── types/              # Tipos TypeScript
├── constants/          # Constantes del juego
├── utils/              # Funciones utilitarias
├── loaders/            # Cargadores de assets
└── assets/             # Recursos estáticos
```

## Responsabilidades por Carpeta

### `/components`
- **common/**: Botones, modales, inputs reutilizables
- **game/**: Mapa, personajes, HUD, inventario
- **screens/**: Login, juego principal, configuración

**Regla**: Componentes puros, reciben props y renderizan. No manejan lógica compleja.

### `/hooks`
- Encapsulan lógica reutilizable
- Acceso a Redux store
- Lógica de efectos y estado local
- Ejemplos: `useInput`, `useMapLoader`, `useNetworkConnection`

### `/services`
- Comunicación TCP y manejo de paquetes binarios
- Lógica de validación compleja
- APIs externas
- Ejemplos: `networkService.ts`, `gameValidation.ts`

### `/store`
- Redux slices por dominio: `authSlice`, `gameSlice`, `inputSlice`
- Solo estado que necesita persistir o compartirse globalmente
- Usar `redux-persist` solo para configuración crítica

### `/loaders`
- Parsers de PixiJS para assets específicos
- Lógica de carga y cache de recursos
- Ya existentes: `mapLoader`, `spriteLoader`

## Flujos de Datos Principales

### 1. Input del Usuario
```
Input → Hook → Redux Action → State Update → Component Re-render
```

### 2. Comunicación de Red
```
TCP Socket → Service → Redux Action → State Update → UI Update
```

### 3. Renderizado del Juego
```
Redux State → Hook → Component Props → PixiJS Component → Render
```

## Gestión de Estado

### ¿Cuándo usar Redux vs Estado Local?

**Redux para**:
- Estado del jugador (posición, stats, inventario)
- Configuración de controles
- Estado de conexión de red
- Estado que múltiples componentes necesitan

**Estado Local para**:
- Estado de formularios
- Animaciones temporales
- Estado de UI transitorio (hover, focus)

## Patrones Recomendados

### 1. Custom Hooks para Lógica Compleja
```typescript
// useNetworkConnection.ts
export const useNetworkConnection = () => {
  // Lógica de conexión TCP
  // Manejo de reconexión
  // Return interface simple
}
```

### 2. Services para Lógica Externa
```typescript
// networkService.ts
export class NetworkService {
  // Manejo directo de TCP
  // Parsing de paquetes binarios
  // No depende de React
}
```

### 3. Componentes Composables
```typescript
// En lugar de un componente gigante, componer varios pequeños
<GameScreen>
  <GameMap />
  <PlayerHUD />
  <ChatWindow />
</GameScreen>
```

## Manejo de Errores

### Estrategia Simple
- Error boundaries para errores de renderizado React
- Try-catch en services y hooks
- Estado de error en Redux para errores de red
- Logs simples, no over-engineering

## Performance

### Solo Optimizar Cuando Sea Necesario
- `React.memo()` solo para componentes que re-renderizan frecuentemente
- `useMemo()` solo para cálculos costosos (no para objetos simples)
- PixiJS object pooling solo si hay problemas de performance

### Evitar Optimizaciones Prematuras
- No crear abstracciones complejas "por si acaso"
- Medir antes de optimizar
- Simplicidad > Performance teórica

### ⚠️ Cuidado con Bucles Anidados en Render
- **Evitar `Array.from()` anidados en JSX** - Causa re-creación masiva de arrays
- **Un bucle simple > múltiples bucles anidados** - Mejor 1 bucle con arrays separados
- **Usar `useMemo()` para cálculos costosos de JSX** - Cuando generas muchos elementos
- **Memoizar por dependencias específicas** - Solo cuando la data cambia

## Anti-Patrones a Evitar

### ❌ Over-Engineering
- No crear factories si solo tienes 2-3 tipos
- No crear interfaces si no hay múltiples implementaciones
- No separar en micro-services si no es necesario
- **No usar `array.push()` en render** - En React usar JSX directo o `.map()`
- **No crear componentes separados innecesarios** - Si no agrega lógica, no lo separes

### ❌ Abstracciones Innecesarias
- No crear "managers" si el código puede ir en un hook
- No crear middlewares complejos si un service simple funciona
- No usar patrones Enterprise para un proyecto simple
- **En React 19: Evitar `useMemo()` innecesario** - El compilador optimiza automáticamente
- **Solo usar `useMemo()` para cálculos genuinamente costosos** - Como generación masiva de elementos
- **Probar performance antes de optimizar** - React 19 puede ser más inteligente de lo esperado

### ❌ Estado Global Excesivo
- No poner todo en Redux
- No persistir estado transitorio
- No normalizar datos simples

### ❌ Acoplamiento Innecesario
- **Evitar props que no se usan** - Si un componente no necesita props específicos, no los pases
- **Respetar orden de renderizado** - No optimizar si rompe la lógica visual
- **Responsabilidades claras** - Un componente = una responsabilidad

## Convenciones de Código

### Nombres
- Componentes: PascalCase (`GameMap`)
- Hooks: camelCase con `use` (`useMapLoader`)
- Services: camelCase (`networkService`)
- Types: PascalCase (`GameState`)
- Constants: UPPER_SNAKE_CASE (`TILE_SIZE`)

### PixiJS v8 Migraciones
- **Usar `parser` en lugar de `loadParser`** - API deprecada en v8
- **Revisar warnings de console** - PixiJS muestra deprecation warnings claros
- **Actualizar según documentación oficial** - Las APIs cambian entre versiones mayores

### Archivos
- Un componente por archivo
- Un hook por archivo
- Services pueden agruparse si están relacionados
- Export default para componentes principales

## Migración Gradual

### Fase 1: Estructura Base
- Crear carpetas según estructura propuesta
- Mover archivos existentes sin cambiar lógica

### Fase 2: Simplificación
- Identificar y eliminar abstracciones innecesarias
- Consolidar código duplicado
- Simplificar interfaces complejas

### Fase 3: Funcionalidades Nuevas
- Implementar nuevas features siguiendo los principios
- Refactorizar código viejo solo si es necesario

## Próximos Pasos Concretos

1. **Reorganizar carpetas** según estructura propuesta
2. **Identificar servicios necesarios** (network, validation)
3. **Simplificar Redux slices** (eliminar estado innecesario)
4. **Crear hooks específicos** para lógica reutilizable
5. **Documentar decisiones** conforme se tomen

**Regla de Oro**: Si dudas si algo es necesario, probablemente no lo sea. Agrega complejidad solo cuando resuelva un problema real.