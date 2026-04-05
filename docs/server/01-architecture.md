# Arquitectura del Servidor — Argentum Online

> Este documento describe la arquitectura del servidor nuevo (`apps/server`).
> El stack está definido, las decisiones de diseño están tomadas. Este doc es la referencia
> para cualquiera que trabaje en el server.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | .NET 10 / C# |
| Transporte (cliente-servidor) | SignalR (WebSocket) |
| Serialización | MessagePack |
| Persistencia | A definir (PostgreSQL o SQLite) |
| Tests | xUnit + FluentAssertions |

**Principio fundamental de abstracción**: la lógica de negocio nunca toca SignalR,
la base de datos, ni ninguna otra tecnología directamente. Todo pasa por interfaces.
Si el día de mañana se quiere cambiar SignalR por gRPC, o PostgreSQL por SQLite,
solo se toca la capa de infraestructura — cero cambios en dominio o aplicación.

---

## Patrones Arquitectónicos

La arquitectura combina cuatro patrones que encajan naturalmente con la complejidad de AO.
El razonamiento completo está en
[`context/reimplementacion/arquitectura-patrones.md`](../../context/reimplementacion/arquitectura-patrones.md).

### 1. Specification Pattern

Para todas las precondiciones y guards antes de ejecutar una acción.
En vez de anidar 25 `if` antes de un ataque, se compone una cadena de specs:

- Cada `ISpecification<T>` es una clase pequeña, con nombre descriptivo, testeable de forma aislada.
- Se reutilizan entre sistemas: `NotInSafeZone` sirve para combate, robo, domar e invocar.
- Cuando una acción falla, la spec que falló dice exactamente por qué.

### 2. Domain Events + Handlers

Para las cascadas de side-effects. Ningún método del dominio hace 10 cosas a la vez.
En cambio, publica un evento (`CharacterDied`, `ItemPickedUp`, `SpellCast`) y cada
consecuencia es un handler independiente:

- Los handlers se ejecutan sincrónicamente dentro del mismo tick del game loop (cero latencia).
- Un handler puede publicar nuevos eventos (cascadas naturales, sin recursión explícita).
- Cada handler es testeable de forma aislada.

### 3. Strategy Pattern (variación por clase)

AO tiene 12 clases jugables con comportamiento cualitativamente distinto.
En vez de switches gigantes, cada clase implementa `IClassProfile`:
modificadores de combate, mana por nivel, habilidades únicas, etc.
Agregar una clase nueva es implementar una interfaz, no tocar 40 switches.

### 4. Zone Rules como estrategias inyectables

Cada tipo de zona (zona segura, arena, zona PK, anti-piquete) implementa `IZoneRules`.
Las reglas de "qué está permitido en esta zona" se consultan desde las Specifications,
no se hardcodean en cada acción.

### 5. State Machine para estados del personaje

El personaje tiene ~50 flags. La State Machine define qué acciones bloquea cada estado
y qué transiciones son válidas (ej: meditando + recibe daño → sale de meditación).
Evita que los flags se chequeen de forma ad-hoc en cada sistema.

---

## Estructura de Proyectos

```
apps/server/
├── Argentum.Domain/
│   ├── Characters/
│   ├── Combat/
│   ├── Magic/
│   ├── Inventory/
│   ├── World/
│   ├── Npcs/
│   ├── Guilds/
│   ├── Factions/
│   ├── Party/
│   ├── Trade/
│   └── Shared/
│       ├── Specifications/     # ISpecification<T>, CompositeSpecification
│       ├── Events/             # IEvent, IEventBus, IEventHandler<T>
│       └── StateMachine/       # ICharacterState, StateTransition
│
├── Argentum.Application/
│   ├── Commands/               # Casos de uso (MoveCommand, AttackCommand, CastSpellCommand...)
│   ├── Queries/                # Lecturas de estado
│   └── EventHandlers/          # Handlers de Domain Events cross-cutting
│
├── Argentum.Infrastructure/
│   ├── SignalR/                # Implementación de IGameHub e IGameClient con SignalR real
│   ├── Persistence/            # Implementaciones de ICharacterRepository, IWorldRepository...
│   ├── Serialization/          # MessagePack adapters
│   └── Configuration/          # Lectura de archivos de config, datos de juego (JSON)
│
└── Argentum.GameServer/        # Entry point
    ├── GameLoop.cs             # Tick loop principal (25 Hz base)
    ├── DependencyInjection/    # Registro de todos los servicios
    └── Program.cs
```

### Por qué esta separación

| Proyecto | Puede importar |
|----------|---------------|
| `Domain` | Solo BCL — cero dependencias externas |
| `Application` | `Domain` |
| `Infrastructure` | `Domain` + `Application` + tecnologías (SignalR, EF, etc.) |
| `GameServer` | Todo (punto de composición, registro de DI) |

El `Domain` es el corazón: contiene la lógica de negocio y nunca sabe que existe SignalR,
una base de datos, o el game loop. Es completamente testeable sin levantar ningún servidor.

---

## Abstracción de SignalR

SignalR es un detalle de infraestructura. El dominio y la aplicación se comunican con
el cliente a través de dos contratos que viven en `Application`:

### `IGameClient` — lo que el servidor puede enviar a un cliente

```
IGameClient
  SendCharacterMoved(characterId, position, direction)
  SendDamageTaken(characterId, amount, isCritical)
  SendCharacterDied(characterId)
  SendInventoryUpdated(slot, item)
  SendConsoleMessage(text, color)
  SendMapData(tiles, entities)
  SendStatUpdated(stat, value)
  ... (un método por mensaje S→C)
```

La implementación real en `Infrastructure/SignalR` traduce cada llamada a un mensaje SignalR.
Si mañana se cambia la tecnología, solo cambia esa clase — la lógica de negocio no se toca.

### `IGameHub` — lo que el cliente puede enviar al servidor

Los mensajes entrantes del cliente se mapean a Commands de `Application`.
El Hub de SignalR en `Infrastructure` recibe el mensaje, construye el Command, y lo
despacha al handler. El hub no tiene lógica de negocio — solo traduce y delega.

```
[SignalR Hub]  recibe "Move(direction)"    →  MoveCommand    →  MoveCommandHandler
[SignalR Hub]  recibe "Attack(targetId)"   →  AttackCommand  →  AttackCommandHandler
[SignalR Hub]  recibe "CastSpell(spellId)" →  CastCommand    →  CastCommandHandler
```

---

## Game Loop

El game loop vive en `Argentum.GameServer/GameLoop.cs`. Es un bucle con tick base de ~40ms
(25 Hz) que ejecuta subsistemas a distintas frecuencias:

| Subsistema | Frecuencia | Responsabilidad |
|-----------|-----------|----------------|
| Procesamiento de mensajes entrantes | 5 ms | Despachar commands recibidos de clientes |
| Flush de mensajes salientes | 10 ms | Enviar buffers acumulados a cada cliente |
| Tick principal del mundo | 40 ms | Timers de estado, regen, veneno, necesidades, cooldowns |
| IA de NPCs | ~100 ms | Movimiento, aggro, decisión de ataque |
| Efectos de lluvia | ~500 ms | Reducción de stamina a jugadores al exterior |
| Mantenimiento lento | 6 s | Anti-piquete, viaje a casa, validación de clanes |
| Mantenimiento mayor | 1 min | Respawn de guardias, clima, purga de penas |
| Persistence flush (async) | 5-10 s | Escribir entidades dirty a la base de datos |

El game loop no conoce SignalR. Interactúa con cada jugador a través de `IGameClient`.
Los mensajes de red entrantes se encolan y se procesan al inicio de cada ciclo
(modelo de cola de mensajes, no callbacks directos en el thread de red).

---

## Persistencia Asíncrona

No hay WorldSave bloqueante. Se usa **write-behind con dirty tracking**:

1. Cada entidad (`Character`, `MapState`, `Guild`) tiene un flag `IsDirty`.
2. Al modificarse el estado, la entidad se marca dirty.
3. Un `PersistenceWorker` en background escanea las entidades dirty cada 5-10 segundos
   y las escribe a la DB sin bloquear el game loop.
4. En disconnect: se fuerza flush inmediato de ese jugador (sigue siendo async al game loop).
5. Pérdida máxima ante crash: ~10 segundos (vs. 60-180 minutos del sistema original).

Los contratos de persistencia viven en `Domain`/`Application`:

```
ICharacterRepository    →  Save(character),  Load(name)
IWorldRepository        →  SaveMapState(mapId, state)
IGuildRepository        →  Save(guild),      LoadAll()
```

Las implementaciones reales viven en `Infrastructure/Persistence`.

---

## Sistema de Áreas (Interest Management)

Para no enviar cada actualización a todos los jugadores conectados:

- El mundo se divide en celdas de tamaño fijo (**Spatial Hash Grid**).
- Cada jugador "escucha" las celdas dentro de su radio de visión (~27x27 tiles).
- Al cruzar una celda: se envían datos de las nuevas celdas visibles y se dejan de
  enviar los de las que ya no se ven.
- Funciona con coordenadas globales (compatible con world grid continuo si se implementa).
- Lookup e inserción O(1), comportamiento predecible — es el estándar en MMOs 2D.

---

## Protocolo de Mensajes

La comunicación cliente-servidor usa SignalR con serialización MessagePack.
El protocolo es **server-authoritative**:

- El cliente envía **intenciones** ("quiero moverme al norte").
- El servidor valida, ejecuta, y responde con el **estado resultante**.
- El cliente puede predecir localmente para UX responsiva, pero el servidor tiene
  la palabra final y puede corregir cualquier desincronización.

Para movimiento se usa **Client-Side Prediction + Server Reconciliation**:
el cliente aplica el movimiento inmediatamente con un sequence number,
y reconcilia suavemente cuando llega la confirmación del servidor.
Sin tecla "L", sin desincronizaciones permanentes.

---

## Principios de Diseño

1. **La lógica de negocio no toca tecnología**: ninguna clase en `Domain` o `Application`
   importa SignalR, Entity Framework, ni nada de infraestructura.

2. **Cada regla de negocio es una clase con nombre descriptivo**: una spec, un handler,
   una strategy. La wiki del legacy debe poder auditarse contra el código 1:1.

3. **El servidor siempre compila y corre**: aunque muchas features no estén implementadas,
   el servidor debe poder levantarse en cualquier punto del desarrollo.

4. **Tests sin servidor**: todo el dominio y la aplicación son testeables con xUnit puro,
   sin levantar SignalR, sin base de datos, sin game loop.

5. **Configuración, no constantes**: todos los intervalos, multiplicadores, y límites del
   juego vienen de archivos de configuración (JSON), no de constantes en código.
