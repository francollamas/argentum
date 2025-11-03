# Guía de Integración: PixiJS Layout con Pixi React

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Conceptos Fundamentales](#conceptos-fundamentales)
4. [Integración con Pixi React](#integración-con-pixi-react)
5. [Componentes de Layout](#componentes-de-layout)
6. [Propiedades Flexbox](#propiedades-flexbox)
7. [Ejemplos Prácticos](#ejemplos-prácticos)
8. [TypeScript Support](#typescript-support)
9. [Debugging](#debugging)
10. [Best Practices](#best-practices)

---

## Introducción

**PixiJS Layout** es una biblioteca basada en **Yoga** (el motor de flexbox de Facebook) que trae capacidades de layout flexbox a aplicaciones PixiJS. Esto permite crear interfaces de usuario responsivas y visualmente ricas con una API simple, similar a CSS Flexbox.

### ¿Por qué usar PixiJS Layout?

- **Flexbox nativo**: Utiliza el mismo modelo de layout que CSS
- **Responsivo**: Adapta automáticamente el contenido a diferentes tamaños
- **Componentes especializados**: `LayoutContainer`, `LayoutView`, `LayoutSprite`
- **Styling avanzado**: Soporte para background, borders, border-radius, overflow (scroll)
- **Integración con React**: Se combina perfectamente con `@pixi/react`

---

## Instalación

```bash
# Con pnpm (recomendado para este proyecto)
pnpm add @pixi/layout

# Con npm
npm install @pixi/layout

# Con yarn
yarn add @pixi/layout
```

**Dependencias requeridas**:
- `pixi.js` (ya instalado en el proyecto)
- `@pixi/react` (ya instalado en el proyecto)
- `react@19+` (ya instalado en el proyecto)

---

## Conceptos Fundamentals

### 1. Habilitando Layout en Objetos PixiJS

Puedes habilitar layout de dos formas:

#### Opción A: Durante la creación

```typescript
import { Container, Sprite } from 'pixi.js';

const container = new Container({
    layout: {
        width: 500,
        height: 300,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
```

#### Opción B: Después de la creación

```typescript
const sprite = new Sprite({ texture });
sprite.layout = {
    width: 100,
    height: 100,
    objectFit: 'contain',
};
```

### 2. Tipos de Dimensiones

```typescript
// Valores absolutos (píxeles)
width: 300

// Valores porcentuales
width: '50%'

// Auto (calculado por flexbox)
width: 'auto'

// Intrinsic (usa las dimensiones naturales del objeto, ej: tamaño de textura)
width: 'intrinsic'
height: 'intrinsic'
```

### 3. Modelo Flexbox

PixiJS Layout implementa el modelo completo de Flexbox:

- **Main axis**: Definido por `flexDirection` ('row' o 'column')
- **Cross axis**: Perpendicular al main axis
- **Flex items**: Children del container con layout habilitado

---

## Integración con Pixi React

### Setup Básico

Para usar PixiJS Layout con React, debes importar el módulo de React y extender los componentes:

```tsx
import '@pixi/layout/react';  // ← IMPORTANTE: Habilita tipos TypeScript
import '@pixi/layout';
import { Container } from 'pixi.js';
import { extend } from '@pixi/react';
import { LayoutContainer } from '@pixi/layout/components';

// Extender componentes para usarlos en JSX
extend({
    Container,
    LayoutContainer,
});

function App() {
    return (
        <Application resizeTo={window} background={0x1C1C1D}>
            <pixiContainer layout={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <layoutContainer layout={{
                    width: 400,
                    height: 300,
                    backgroundColor: 0x1099bb,
                    borderRadius: 10,
                    padding: 20,
                    flexDirection: 'column',
                    gap: 10,
                }}>
                    {/* Contenido aquí */}
                </layoutContainer>
            </pixiContainer>
        </Application>
    );
}
```

### Componente de Resize Automático

Para que el layout responda a cambios de tamaño de ventana:

```tsx
import { useRef } from 'react';
import { useApplication } from '@pixi/react';
import { Container } from 'pixi.js';

const LayoutResizer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const layoutRef = useRef<Container>(null);
    const { app } = useApplication();

    // Actualizar layout al redimensionar
    app.renderer.on('resize', () => {
        if (layoutRef.current) {
            layoutRef.current.layout = {
                width: app.screen.width,
                height: app.screen.height,
            };
        }
    });

    return (
        <pixiContainer ref={layoutRef} layout={{}}>
            {children}
        </pixiContainer>
    );
};
```

---

## Componentes de Layout

### 1. LayoutContainer

Container con soporte avanzado para background, borders y overflow.

```typescript
import { LayoutContainer } from '@pixi/layout/components';

const container = new LayoutContainer({
    layout: {
        width: 300,
        height: 200,
        backgroundColor: 0xFF0000,
        borderWidth: 2,
        borderColor: 0x000000,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});
```

**Con React**:

```tsx
<layoutContainer layout={{
    width: 300,
    height: 200,
    backgroundColor: 0xFF0000,
    borderWidth: 2,
    borderColor: 0x000000,
    borderRadius: 8,
    padding: 16,
}}>
    {/* Children */}
</layoutContainer>
```

### 2. LayoutSprite

Sprite con capacidades de layout y objectFit.

```tsx
<layoutSprite
    texture={texture}
    layout={{
        width: '100%',
        height: 200,
        objectFit: 'cover',  // 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
        objectPosition: 'center',
    }}
/>
```

### 3. LayoutView

Wrapper genérico para cualquier DisplayObject.

```typescript
import { LayoutView } from '@pixi/layout/components';
import { Sprite, Assets } from 'pixi.js';

const texture = await Assets.load('image.png');
const sprite = new Sprite(texture);

const view = new LayoutView({
    slot: sprite,
    layout: {
        width: 200,
        height: 200,
        objectFit: 'cover',
        objectPosition: 'center',
        backgroundColor: 0x333333,
        borderRadius: 10,
    }
});
```

### 4. Container Scrolleable (Overflow)

```typescript
const scrollContainer = new LayoutContainer({
    layout: {
        width: 400,
        height: 300,
        overflow: 'scroll',
        padding: 10,
        gap: 5,
        flexDirection: 'column',
    },
    trackpad: {
        constrain: true,  // Limitar scroll a los bounds
        maxSpeed: 400,    // Velocidad máxima (px/frame)
    }
});

// Agregar muchos items para habilitar scroll
for (let i = 0; i < 50; i++) {
    const item = new LayoutContainer({
        layout: { width: '100%', height: 50, backgroundColor: 0x333333 }
    });
    scrollContainer.addChild(item);
}
```

---

## Propiedades Flexbox

### Layout Direction

```typescript
container.layout = {
    flexDirection: 'row',        // 'row' | 'row-reverse' | 'column' | 'column-reverse'
    flexWrap: 'wrap',           // 'nowrap' | 'wrap' | 'wrap-reverse'
};
```

### Alignment

```typescript
container.layout = {
    // Alineación en el main axis
    justifyContent: 'center',   // 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'

    // Alineación en el cross axis
    alignItems: 'center',       // 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'

    // Alineación de múltiples líneas (con wrap)
    alignContent: 'space-around', // 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch' | 'space-evenly'
};
```

### Spacing

```typescript
container.layout = {
    gap: 20,         // Espacio entre items (row y column)
    rowGap: 10,      // Espacio vertical
    columnGap: 30,   // Espacio horizontal
    padding: 20,     // Padding interno
    margin: 10,      // Margen externo
};
```

### Flex Items

```typescript
child.layout = {
    flex: 1,              // Shorthand para grow/shrink
    flexGrow: 2,          // Factor de crecimiento
    flexShrink: 1,        // Factor de reducción
    flexBasis: 100,       // Tamaño inicial
    alignSelf: 'center',  // Override de alignItems del padre
};
```

### Positioning

```typescript
// Posicionamiento relativo (default, participa en flex flow)
sprite.layout = {
    position: 'relative',
    left: 20,
    top: 10
};

// Posicionamiento absoluto (se remueve del flex flow)
sprite.layout = {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
};
```

### Sizing Constraints

```typescript
container.layout = {
    width: '100%',
    height: 'auto',
    minWidth: 200,
    maxWidth: 800,
    minHeight: 100,
    maxHeight: 600,
};
```

---

## Ejemplos Prácticos

### Ejemplo 1: Card Layout Responsivo

```tsx
import '@pixi/layout/react';
import { extend, Application } from '@pixi/react';
import { LayoutContainer, LayoutSprite } from '@pixi/layout/components';

extend({ LayoutContainer, LayoutSprite });

function CardList() {
    return (
        <Application width={800} height={600}>
            <layoutContainer layout={{
                width: '100%',
                height: '100%',
                padding: 20,
                gap: 20,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {cards.map((card, i) => (
                    <layoutContainer key={i} layout={{
                        width: 250,
                        height: 350,
                        backgroundColor: 0x2C2C2E,
                        borderRadius: 12,
                        padding: 15,
                        flexDirection: 'column',
                        gap: 10,
                    }}>
                        <layoutSprite
                            texture={card.texture}
                            layout={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 8,
                            }}
                        />
                        <layoutText
                            text={card.title}
                            layout={{
                                width: '100%',
                                height: 'intrinsic',
                            }}
                        />
                    </layoutContainer>
                ))}
            </layoutContainer>
        </Application>
    );
}
```

### Ejemplo 2: Toolbar con Items Distribuidos

```tsx
function Toolbar() {
    return (
        <layoutContainer layout={{
            width: '100%',
            height: 60,
            backgroundColor: 0x1C1C1D,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
        }}>
            {/* Logo a la izquierda */}
            <layoutSprite
                texture={logoTexture}
                layout={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain',
                }}
            />

            {/* Botones en el centro con flex grow */}
            <pixiContainer layout={{
                flex: 1,
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
            }}>
                <Button label="Inventario" />
                <Button label="Mapa" />
                <Button label="Stats" />
            </pixiContainer>

            {/* Avatar a la derecha */}
            <layoutSprite
                texture={avatarTexture}
                layout={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 20,
                }}
            />
        </layoutContainer>
    );
}
```

### Ejemplo 3: Grid Layout

```tsx
function InventoryGrid() {
    const GRID_SIZE = 8;
    const SLOT_SIZE = 64;

    return (
        <layoutContainer layout={{
            width: SLOT_SIZE * GRID_SIZE,
            height: 'auto',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            padding: 10,
            backgroundColor: 0x1A1A1A,
            borderRadius: 8,
        }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                <layoutContainer key={i} layout={{
                    width: SLOT_SIZE,
                    height: SLOT_SIZE,
                    backgroundColor: 0x2C2C2E,
                    borderWidth: 1,
                    borderColor: 0x404040,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {/* Item sprite si existe */}
                </layoutContainer>
            ))}
        </layoutContainer>
    );
}
```

### Ejemplo 4: Scrollable Chat

```tsx
function ChatPanel() {
    const messages = useMessages();

    return (
        <layoutContainer layout={{
            width: 300,
            height: 400,
            backgroundColor: 0x1C1C1D,
            borderRadius: 8,
            overflow: 'scroll',
            padding: 10,
            gap: 8,
            flexDirection: 'column',
        }}
        trackpad={{
            constrain: true,
            maxSpeed: 300,
        }}>
            {messages.map((msg, i) => (
                <layoutContainer key={i} layout={{
                    width: '100%',
                    height: 'auto',
                    padding: 8,
                    backgroundColor: msg.isOwn ? 0x007AFF : 0x2C2C2E,
                    borderRadius: 6,
                    alignSelf: msg.isOwn ? 'flex-end' : 'flex-start',
                }}>
                    <layoutText
                        text={msg.text}
                        layout={{
                            width: 'intrinsic',
                            height: 'intrinsic',
                        }}
                    />
                </layoutContainer>
            ))}
        </layoutContainer>
    );
}
```

---

## TypeScript Support

### Declaración de Tipos para Componentes Custom

Si usas componentes de layout en React, debes declararlos en un archivo global de tipos:

```typescript
// global.d.ts o types/pixi-layout.d.ts
import { type PixiReactElementProps } from '@pixi/react';
import { type LayoutContainer, type LayoutSprite, type LayoutView } from '@pixi/layout/components';

declare module '@pixi/react' {
    interface PixiElements {
        layoutContainer: PixiReactElementProps<typeof LayoutContainer>;
        layoutSprite: PixiReactElementProps<typeof LayoutSprite>;
        layoutView: PixiReactElementProps<typeof LayoutView>;
    }
}
```

### Uso con Tipos

```tsx
import { type ComponentProps } from 'react';

type LayoutContainerProps = ComponentProps<'layoutContainer'>;

function StyledContainer(props: LayoutContainerProps) {
    return <layoutContainer {...props} />;
}
```

---

## Debugging

### Habilitar DevTools de Layout

```typescript
import '@pixi/layout/devtools';
import { Application } from 'pixi.js';

const app = new Application();
await app.init({
    layout: {
        enableDebug: true,
        debugModificationCount: 50,
    }
});

// Habilitar visualización de debug en containers específicos
app.stage.layout = {
    width: 800,
    height: 600,
    debug: true,                // Mostrar layout boxes
    debugDrawMargin: true,      // Mostrar área de margin
    debugDrawPadding: true,     // Mostrar área de padding
    debugDrawBorder: true,      // Mostrar área de border
    debugDrawContent: true,     // Mostrar área de contenido
    debugHeat: true,            // Mostrar heatmap de modificaciones
};
```

### Acceso a Computed Layout

```typescript
const layoutBox = sprite.layout?.computedLayout;
console.log({
    left: layoutBox.left,
    top: layoutBox.top,
    width: layoutBox.width,
    height: layoutBox.height
});

// Valores específicos de PixiJS
const pixiLayout = sprite.layout?.computedPixiLayout;
console.log({
    offsetX: pixiLayout.offsetX,
    offsetY: pixiLayout.offsetY,
    scaleX: pixiLayout.scaleX,
    scaleY: pixiLayout.scaleY
});
```

### Eventos de Layout

```typescript
sprite.on('layout', (layout) => {
    console.log('Layout actualizado:', {
        position: { x: layout.realX, y: layout.realY },
        size: {
            width: layout.computedLayout.width,
            height: layout.computedLayout.height
        },
        scale: { x: layout.realScaleX, y: layout.realScaleY },
    });
});
```

---

## Best Practices

### 1. Performance

```typescript
// ✅ BIEN: Auto-update habilitado para actualizaciones automáticas
const app = new Application();
await app.init({
    layout: {
        autoUpdate: true,  // Layout se actualiza automáticamente en cada render
    }
});

// ⚠️ Manual updates cuando necesites control fino
app.renderer.layout.autoUpdate = false;
app.renderer.layout.update(app.stage);
```

### 2. Opt-in Layout

Solo habilita layout en los objetos que lo necesiten:

```typescript
// ✅ BIEN: Solo managed tiene layout
const container = new Container({
    layout: {
        width: 500,
        height: 500,
        justifyContent: 'center',
    },
});

const managed = new Sprite({ texture, layout: true });
const unmanaged = new Sprite(texture);  // No layout overhead

container.addChild(managed, unmanaged);
```

### 3. Intrinsic Sizing

Usa `'intrinsic'` para sprites que deben mantener su tamaño natural:

```typescript
const sprite = new Sprite({
    texture: await Assets.load('bunny.png'),
    layout: {
        width: 'intrinsic',   // Usa el ancho de la textura
        height: 'intrinsic',  // Usa el alto de la textura
    }
});
```

### 4. Combinar con Transform Origin

```typescript
sprite.layout = {
    width: 300,
    height: 300,
    objectFit: 'cover',
    transformOrigin: 'center',  // Rotaciones/escalas desde el centro
};

sprite.rotation = 0.2;  // Rota alrededor del centro del layout box
```

### 5. Tailwind-style Utilities (Opcional)

Para un desarrollo más rápido:

```typescript
import { tw } from '@pixi/layout/tailwind';

const container = new Container({
    layout: tw`p-4 m-2 flex-row items-center justify-between gap-4`
});

// Equivalente a:
// {
//     padding: 16,
//     margin: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 16
// }
```

---

## Integración con el Proyecto Argentum

### Caso de Uso: UI del Juego

Puedes usar PixiJS Layout para crear la UI del juego de Argentum:

```tsx
// src/components/ui/GameUI.tsx
import '@pixi/layout/react';
import { extend } from '@pixi/react';
import { LayoutContainer } from '@pixi/layout/components';

extend({ LayoutContainer });

export function GameUI() {
    return (
        <layoutContainer layout={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
        }}>
            {/* Top bar */}
            <layoutContainer layout={{
                width: '100%',
                height: 60,
                backgroundColor: 0x1C1C1D,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
            }}>
                <PlayerStats />
                <MiniMap />
            </layoutContainer>

            {/* Game view (flex grow para ocupar espacio restante) */}
            <pixiContainer layout={{ flex: 1 }}>
                <GameView />
            </pixiContainer>

            {/* Bottom bar */}
            <layoutContainer layout={{
                width: '100%',
                height: 100,
                backgroundColor: 0x1C1C1D,
                flexDirection: 'row',
                gap: 10,
                padding: 10,
            }}>
                <Inventory />
                <Spells />
            </layoutContainer>
        </layoutContainer>
    );
}
```

### Actualización de `src/main.tsx`

Agrega la importación de layout al inicio de tu aplicación:

```tsx
// src/main.tsx
import '@pixi/layout';
import '@pixi/layout/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
```

---

## Recursos Adicionales

- **Documentación oficial**: https://layout.pixijs.com/
- **GitHub**: https://github.com/pixijs/layout
- **Pixi React Docs**: https://react.pixijs.io/
- **Yoga Layout**: https://www.yogalayout.dev/

---

## Conclusión

PixiJS Layout es una herramienta poderosa para crear UIs complejas y responsivas en PixiJS. Su integración con React mediante `@pixi/react` es directa y permite aprovechar lo mejor de ambos mundos:

- **Flexbox familiar**: Si conoces CSS Flexbox, ya sabes usar PixiJS Layout
- **Componentes especializados**: LayoutContainer, LayoutSprite, LayoutView
- **Performance**: Motor Yoga optimizado, solo se actualiza cuando es necesario
- **Debugging**: Herramientas visuales para inspeccionar layouts

Para el proyecto Argentum, esto es especialmente útil para:
- Crear UIs de inventario, chat, stats
- Layouts responsivos que se adapten a diferentes resoluciones
- Organizar elementos en pantalla sin cálculos manuales
- Mantener un código más limpio y mantenible
