# Mapa de Features del Servidor — Argentum Online

> Orden de implementación del servidor nuevo.
> Cada fase debe compilar y correr antes de pasar a la siguiente.
> La documentación de referencia de cada mecánica está en
> [`legacy/legacy-server/docs/wiki/`](../../legacy/legacy-server/docs/wiki/).

---

## Filosofía

- **Feature completa = server + tests**. No se arranca la próxima sin terminar la anterior.
- **Siempre funcional**: en cualquier punto del desarrollo el servidor debe poder levantarse.
- **Leer antes de codear**: cada feature tiene un doc de referencia en la wiki legacy — leerlo primero.

---

## Fases de Implementación

### Fase 0 — Fundación

> Sin esta fase, nada de lo demás existe.

| # | Feature | Referencia |
|---|---------|-----------|
| 0.1 | Estructura de solución (.sln + proyectos Domain / Application / Infrastructure / GameServer) | [`01-architecture.md`](01-architecture.md) |
| 0.2 | Game loop básico (tick a 25 Hz, subsistemas a distintas frecuencias) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 0.3 | Sistema de configuración (lectura de JSON, hot-reload de datos de juego) | — |
| 0.4 | Logging estructurado | — |
| 0.5 | Carga de datos de juego (NPCs, items, hechizos, recetas, balance — desde JSON) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 0.6 | Carga de mapas (tiles, triggers, teleports, metadatos) | [`12-MUNDO-Y-MAPAS.md`](../../legacy/legacy-server/docs/wiki/12-MUNDO-Y-MAPAS.md) |

---

### Fase 1 — Conexión y Sesión

> El primer jugador puede conectarse, crear un personaje y entrar al mundo.

| # | Feature | Referencia |
|---|---------|-----------|
| 1.1 | Handshake SignalR (versión de cliente, asignación de slot) | [`13-PROTOCOLO-Y-RED.md`](../../legacy/legacy-server/docs/wiki/13-PROTOCOLO-Y-RED.md) |
| 1.2 | Crear personaje (nombre, raza, clase, género — con validaciones) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 1.3 | Login (autenticación básica, carga de personaje guardado) | [`13-PROTOCOLO-Y-RED.md`](../../legacy/legacy-server/docs/wiki/13-PROTOCOLO-Y-RED.md) |
| 1.4 | Spawn en el mundo (posición inicial, envío de datos del mapa) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 1.5 | Logout limpio (/salir con countdown de 10s, guardado del personaje) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 1.6 | Desconexión por timeout (conexiones fantasma sin login) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |

---

### Fase 2 — Mundo y Movimiento

> El jugador puede moverse y ver a otros jugadores moverse.

| # | Feature | Referencia |
|---|---------|-----------|
| 2.1 | Movimiento server-authoritative (validación de tile destino, bloqueos) | [`12-MUNDO-Y-MAPAS.md`](../../legacy/legacy-server/docs/wiki/12-MUNDO-Y-MAPAS.md) |
| 2.2 | Client-side prediction + server reconciliation | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |
| 2.3 | Sistema de áreas / Spatial Hash Grid (interest management) | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |
| 2.4 | Broadcast de movimiento a jugadores del área | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 2.5 | Teleports entre mapas | [`12-MUNDO-Y-MAPAS.md`](../../legacy/legacy-server/docs/wiki/12-MUNDO-Y-MAPAS.md) |
| 2.6 | Envío de datos del área al entrar a un mapa (27x27 tiles iniciales) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |

---

### Fase 3 — Chat

> Los jugadores pueden comunicarse entre sí.

| # | Feature | Referencia |
|---|---------|-----------|
| 3.1 | Chat de área (visible para jugadores cercanos) | [`13-PROTOCOLO-Y-RED.md`](../../legacy/legacy-server/docs/wiki/13-PROTOCOLO-Y-RED.md) |
| 3.2 | Chat global (/all) | — |
| 3.3 | Mensaje directo a jugador (/w nombre) | — |
| 3.4 | Chat de clan (solo miembros online del mismo clan) | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |
| 3.5 | Chat de party (solo miembros del grupo) | [`10-PARTY.md`](../../legacy/legacy-server/docs/wiki/10-PARTY.md) |
| 3.6 | Canal de facción (Ejército Real / Legión Oscura) | [`11-FACCIONES-Y-PRETORIANOS.md`](../../legacy/legacy-server/docs/wiki/11-FACCIONES-Y-PRETORIANOS.md) |

---

### Fase 4 — Personaje

> Stats, progresión, razas, clases y muerte básica.

| # | Feature | Referencia |
|---|---------|-----------|
| 4.1 | Atributos base (fuerza, agilidad, inteligencia, carisma, constitución) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.2 | Modificadores por raza (5 razas: Humano, Elfo, Enano, Gnomo, Medio Elfo) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.3 | Perfiles de clase (12 clases: multiplicadores de combate, mana, habilidades únicas) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.4 | Sistema de niveles y experiencia (tabla de XP por nivel, máx. 50) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.5 | 20 skills con progresión independiente (0-100) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.6 | Stats vitales: HP, mana, stamina, hambre, sed | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.7 | Regeneración de HP y stamina (con y sin descanso, condicionada por hambre/sed) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 4.8 | Muerte básica y resurrección (sacerdotes, zona de spawn) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.9 | Protección newbie (nivel 1-12: items especiales, zonas protegidas) | [`02-PERSONAJE.md`](../../legacy/legacy-server/docs/wiki/02-PERSONAJE.md) |
| 4.10 | State Machine de estados del personaje (vivo, muerto, meditando, paralizado, etc.) | [`context/arquitectura-patrones.md`](../../context/reimplementacion/arquitectura-patrones.md) |

---

### Fase 5 — Inventario

> El personaje puede cargar, equipar y gestionar ítems.

| # | Feature | Referencia |
|---|---------|-----------|
| 5.1 | 20 slots de inventario + oro como billetera separada | [`06-INVENTARIO-Y-OBJETOS.md`](../../legacy/legacy-server/docs/wiki/06-INVENTARIO-Y-OBJETOS.md) |
| 5.2 | Stacking automático (hasta 10.000 unidades por slot) | [`06-INVENTARIO-Y-OBJETOS.md`](../../legacy/legacy-server/docs/wiki/06-INVENTARIO-Y-OBJETOS.md) |
| 5.3 | 8 slots de equipamiento (arma, armadura, casco, escudo, anillo, munición, barco, mochila) | [`06-INVENTARIO-Y-OBJETOS.md`](../../legacy/legacy-server/docs/wiki/06-INVENTARIO-Y-OBJETOS.md) |
| 5.4 | Mochila: 10 slots extra, restricciones al desequipar | [`06-INVENTARIO-Y-OBJETOS.md`](../../legacy/legacy-server/docs/wiki/06-INVENTARIO-Y-OBJETOS.md) |
| 5.5 | Restricciones de equipamiento por clase, género, raza y facción | [`06-INVENTARIO-Y-OBJETOS.md`](../../legacy/legacy-server/docs/wiki/06-INVENTARIO-Y-OBJETOS.md) |
| 5.6 | Drop e ítem pickup (objetos en el piso del tile) | [`06-INVENTARIO-Y-OBJETOS.md`](../../legacy/legacy-server/docs/wiki/06-INVENTARIO-Y-OBJETOS.md) |
| 5.7 | Banco (40 slots de almacenamiento, acceso solo en banquero NPC) | [`08-COMERCIO-Y-ECONOMIA.md`](../../legacy/legacy-server/docs/wiki/08-COMERCIO-Y-ECONOMIA.md) |
| 5.8 | Ítems newbie (no se pierden al morir, se quitan al dejar de ser newbie) | [`06-INVENTARIO-Y-OBJETOS.md`](../../legacy/legacy-server/docs/wiki/06-INVENTARIO-Y-OBJETOS.md) |

---

### Fase 6 — NPCs Base

> Las criaturas y personajes no jugables existen en el mundo.

| # | Feature | Referencia |
|---|---------|-----------|
| 6.1 | Tipos de NPC (común, guardia Real, guardia Caos, sacerdote, banquero, comerciante, entrenador) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 6.2 | Spawn de NPCs al cargar el mapa | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 6.3 | Respawn automático de NPCs al morir | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 6.4 | Drop de ítems y oro al morir | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 6.5 | Movimiento básico de NPCs (aleatorio dentro del mapa) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 6.6 | Interacciones especiales: resurrección (sacerdote), banco (banquero), entrenamiento (entrenador) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |

---

### Fase 7 — Combate PvE

> El jugador puede atacar NPCs y obtener experiencia.

| # | Feature | Referencia |
|---|---------|-----------|
| 7.1 | Cooldowns de ataque (melee, disparo, cruzados magia↔golpe) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 7.2 | Fórmula de hit/miss (`50 + (PoderAtaque - PoderEvasion) × 0.4`, clamp 10%-90%) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 7.3 | Fórmula de daño (con modificadores de clase, arma, nivel) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 7.4 | Bloqueo con escudo | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 7.5 | Golpe crítico | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 7.6 | Combate a distancia (arco + munición) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 7.7 | XP por matar NPC + progresión de skills de combate | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 7.8 | Propiedad de NPC (18s — otro jugador no puede atacarlo) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 7.9 | Inmunidad post-spawn (5s contra NPCs al loguearse o resucitar) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |

---

### Fase 8 — Magia

> El jugador puede lanzar hechizos.

| # | Feature | Referencia |
|---|---------|-----------|
| 8.1 | Aprender hechizos (hasta 35 slots) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.2 | Verificación de requisitos de casteo (báculo, skill, stamina, mana, rango, mapa) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.3 | Hechizos de daño directo (sobre NPC y jugador) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.4 | Hechizos de curación (sobre sí mismo y aliados) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.5 | Efectos de estado: veneno, parálisis, ceguera, estupidez | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.6 | Invisibilidad y ocultamiento (con timers) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.7 | Mimetismo (copiar apariencia) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.8 | Invocación de mascotas (hasta 3, con timer de existencia) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.9 | Meditación (regeneración acelerada de mana) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |
| 8.10 | Bonificaciones de clase al castear (Druida + Flauta Élfica, etc.) | [`04-MAGIA.md`](../../legacy/legacy-server/docs/wiki/04-MAGIA.md) |

---

### Fase 9 — Combate PvP

> Los jugadores pueden atacarse entre sí con consecuencias de reputación.

| # | Feature | Referencia |
|---|---------|-----------|
| 9.1 | Sistema de reputación (6 contadores: Noble, Burgués, Plebe, Ladrón, Bandido, Asesino) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 9.2 | Estado ciudadano / criminal (promedio ponderado de contadores) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 9.3 | Reglas de quién puede atacar a quién (ciudadano vs. criminal, facciones, zonas) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 9.4 | Safe mode (seguro que impide atacar ciudadanos accidentalmente) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 9.5 | Estado "atacable" PvP (60s después de agredir — la víctima puede contraatacar sin penalidad) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 9.6 | Consecuencias de matar (pérdida de reputación, drop de ítems, cascada de efectos) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |
| 9.7 | Zona PK (combate libre) y Arena (combate sin consecuencias) | [`12-MUNDO-Y-MAPAS.md`](../../legacy/legacy-server/docs/wiki/12-MUNDO-Y-MAPAS.md) |
| 9.8 | Apuñalar por la espalda (daño multiplicado) | [`03-COMBATE.md`](../../legacy/legacy-server/docs/wiki/03-COMBATE.md) |

---

### Fase 10 — IA Avanzada de NPCs

> Los NPCs tienen comportamientos más ricos: guardias, aggro, pathfinding.

| # | Feature | Referencia |
|---|---------|-----------|
| 10.1 | Aggro por rango (NPCs hostiles atacan al detectar un jugador) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 10.2 | Pathfinding básico (persecución de objetivo) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 10.3 | Guardias (Guardia Real ataca criminales, Guardia Caos ataca ciudadanos, scan en 4 direcciones) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 10.4 | Mascotas domadas (siguen al dueño, atacan en su defensa) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 10.5 | NPCs mágicos (casting de hechizos en combate) | [`05-NPCs-E-IA.md`](../../legacy/legacy-server/docs/wiki/05-NPCs-E-IA.md) |
| 10.6 | Pretorianos (IA avanzada de facción, evento cooperativo) | [`11-FACCIONES-Y-PRETORIANOS.md`](../../legacy/legacy-server/docs/wiki/11-FACCIONES-Y-PRETORIANOS.md) |
| 10.7 | Optimización: NPCs sin jugadores en el mapa no ejecutan IA | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |

---

### Fase 11 — Economía y Comercio

> Los jugadores pueden comprar, vender y comerciar entre sí.

| # | Feature | Referencia |
|---|---------|-----------|
| 11.1 | Compra a NPC comerciante (con descuento por skill Comerciar) | [`08-COMERCIO-Y-ECONOMIA.md`](../../legacy/legacy-server/docs/wiki/08-COMERCIO-Y-ECONOMIA.md) |
| 11.2 | Venta a NPC (precio fijo a 1/3 del base) | [`08-COMERCIO-Y-ECONOMIA.md`](../../legacy/legacy-server/docs/wiki/08-COMERCIO-Y-ECONOMIA.md) |
| 11.3 | Reposición automática del inventario de NPC comerciante | [`08-COMERCIO-Y-ECONOMIA.md`](../../legacy/legacy-server/docs/wiki/08-COMERCIO-Y-ECONOMIA.md) |
| 11.4 | Comercio seguro P2P entre jugadores (sesión de intercambio con confirmación de ambas partes) | [`08-COMERCIO-Y-ECONOMIA.md`](../../legacy/legacy-server/docs/wiki/08-COMERCIO-Y-ECONOMIA.md) |
| 11.5 | Banco: depósito, retiro y transferencia (solo en banquero NPC) | [`08-COMERCIO-Y-ECONOMIA.md`](../../legacy/legacy-server/docs/wiki/08-COMERCIO-Y-ECONOMIA.md) |

---

### Fase 12 — Oficios

> Los jugadores pueden trabajar para obtener materiales y crear ítems.

| # | Feature | Referencia |
|---|---------|-----------|
| 12.1 | Pesca (caña y red, fórmula de probabilidad cuadrática, skill Pesca) | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |
| 12.2 | Minería (herramienta como arma, yacimientos del mapa, skill Minería) | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |
| 12.3 | Tala de árboles | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |
| 12.4 | Herrería (forja de armas y armaduras con recetas) | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |
| 12.5 | Carpintería (fabricación de ítems de madera) | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |
| 12.6 | Domar criaturas (convertirlas en mascotas) | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |
| 12.7 | Navegación (barcos, tiles de agua) | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |
| 12.8 | Centinela anti-bot (desafío a jugadores que trabajan de forma repetitiva) | [`14-ADMIN-Y-SEGURIDAD.md`](../../legacy/legacy-server/docs/wiki/14-ADMIN-Y-SEGURIDAD.md) |
| 12.9 | Consumo de stamina diferenciado por clase (Trabajador gasta menos) | [`07-OFICIOS-Y-TRABAJO.md`](../../legacy/legacy-server/docs/wiki/07-OFICIOS-Y-TRABAJO.md) |

---

### Fase 13 — Party (Grupo)

> Los jugadores pueden agruparse para compartir experiencia.

| # | Feature | Referencia |
|---|---------|-----------|
| 13.1 | Crear grupo (requiere Carisma × Liderazgo ≥ 100) | [`10-PARTY.md`](../../legacy/legacy-server/docs/wiki/10-PARTY.md) |
| 13.2 | Invitar y aceptar miembros (máx. 5, distancia ≤ 2 tiles, compatible por facción) | [`10-PARTY.md`](../../legacy/legacy-server/docs/wiki/10-PARTY.md) |
| 13.3 | Expulsar miembro y disolver grupo | [`10-PARTY.md`](../../legacy/legacy-server/docs/wiki/10-PARTY.md) |
| 13.4 | Distribución de XP entre miembros del grupo | [`10-PARTY.md`](../../legacy/legacy-server/docs/wiki/10-PARTY.md) |
| 13.5 | Liderazgo: transferencia de líder | [`10-PARTY.md`](../../legacy/legacy-server/docs/wiki/10-PARTY.md) |

---

### Fase 14 — Clanes

> Los jugadores pueden fundar organizaciones permanentes.

| # | Feature | Referencia |
|---|---------|-----------|
| 14.1 | Fundar clan (nivel 25 + Liderazgo 90, 6 alineaciones posibles) | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |
| 14.2 | Gestión de miembros (invitar, expulsar, compatibilidad de alineación) | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |
| 14.3 | Elecciones de líder | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |
| 14.4 | Guerras entre clanes | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |
| 14.5 | Alianzas entre clanes | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |
| 14.6 | Sistema de antifacción (validación periódica de alineación de miembros) | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |
| 14.7 | Codex, noticias y descripción del clan | [`09-CLANES.md`](../../legacy/legacy-server/docs/wiki/09-CLANES.md) |

---

### Fase 15 — Facciones

> Los jugadores pueden unirse al Ejército Real o la Legión Oscura.

| # | Feature | Referencia |
|---|---------|-----------|
| 15.1 | Alistamiento (Ejército Real: ciudadano + 0 civiles muertos + 30 criminales muertos; Legión: criminal + 70 civiles muertos) | [`11-FACCIONES-Y-PRETORIANOS.md`](../../legacy/legacy-server/docs/wiki/11-FACCIONES-Y-PRETORIANOS.md) |
| 15.2 | Sistema de 15 rangos basado en kills faccionarios | [`11-FACCIONES-Y-PRETORIANOS.md`](../../legacy/legacy-server/docs/wiki/11-FACCIONES-Y-PRETORIANOS.md) |
| 15.3 | Equipamiento exclusivo de facción como recompensa por rango | [`11-FACCIONES-Y-PRETORIANOS.md`](../../legacy/legacy-server/docs/wiki/11-FACCIONES-Y-PRETORIANOS.md) |
| 15.4 | Restricción permanente de cambio de bando | [`11-FACCIONES-Y-PRETORIANOS.md`](../../legacy/legacy-server/docs/wiki/11-FACCIONES-Y-PRETORIANOS.md) |
| 15.5 | Evento pretoriano (contenido PvE cooperativo de facción) | [`11-FACCIONES-Y-PRETORIANOS.md`](../../legacy/legacy-server/docs/wiki/11-FACCIONES-Y-PRETORIANOS.md) |

---

### Fase 16 — Persistencia Completa

> El estado del mundo sobrevive reinicios del servidor sin pérdida significativa.

| # | Feature | Referencia |
|---|---------|-----------|
| 16.1 | Write-behind async con dirty tracking para personajes | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |
| 16.2 | Persistencia de estado de mapas (objetos en el piso, puertas) | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |
| 16.3 | Persistencia de clanes | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |
| 16.4 | Save forzado en disconnect | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |
| 16.5 | Recuperación ante crash (máx. ~10s de pérdida) | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |

---

### Fase 17 — Administración y Seguridad

> Los GMs pueden gestionar el servidor y los jugadores en tiempo real.

| # | Feature | Referencia |
|---|---------|-----------|
| 17.1 | Niveles de privilegio (jugador, GM nivel 1-3, Owner) | [`14-ADMIN-Y-SEGURIDAD.md`](../../legacy/legacy-server/docs/wiki/14-ADMIN-Y-SEGURIDAD.md) |
| 17.2 | Comandos GM básicos (ban, kick, silence, teleport, summon, spawn NPC) | [`14-ADMIN-Y-SEGURIDAD.md`](../../legacy/legacy-server/docs/wiki/14-ADMIN-Y-SEGURIDAD.md) |
| 17.3 | IPs baneadas (lista cargada al inicio, actualizable en runtime) | [`14-ADMIN-Y-SEGURIDAD.md`](../../legacy/legacy-server/docs/wiki/14-ADMIN-Y-SEGURIDAD.md) |
| 17.4 | Rate limiting por cliente (máx. paquetes por segundo, circuit breaker) | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |
| 17.5 | Anti-piquete: encarcelamiento automático (10 min) tras 2.3 min parado en tile bloqueante | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 17.6 | Timeout de inactividad (desconexión automática de jugadores AFK) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |

---

### Fase 18 — Mundo Avanzado

> Mejoras al mundo que elevan la experiencia de juego.

| # | Feature | Referencia |
|---|---------|-----------|
| 18.1 | Sistema de clima (lluvia con probabilidad por minuto, efectos sobre stamina) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 18.2 | Efectos de tile: lava (daño por HP%), frío/nieve (daño o pérdida de stamina) | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 18.3 | Viaje a casa (/home): teletransporte a ciudad de origen tras 30s quieto | [`01-ARQUITECTURA-GENERAL.md`](../../legacy/legacy-server/docs/wiki/01-ARQUITECTURA-GENERAL.md) |
| 18.4 | World grid continuo (mapas como chunks con coordenadas globales, transiciones sin pantalla de carga) | [`context/consideraciones.md`](../../context/reimplementacion/consideraciones.md) |

---

## Dependencias entre Fases

```
0 (Fundación)
└── 1 (Conexión)
    └── 2 (Mundo / Movimiento)
        ├── 3 (Chat)
        ├── 4 (Personaje)
        │   └── 5 (Inventario)
        │       ├── 6 (NPCs Base)
        │       │   └── 7 (Combate PvE)
        │       │       ├── 8 (Magia)
        │       │       │   └── 9 (Combate PvP)
        │       │       │       └── 10 (IA Avanzada)
        │       │       └── 11 (Economía)
        │       │           └── 12 (Oficios)
        │       └── 13 (Party)
        │           ├── 14 (Clanes)
        │           │   └── 15 (Facciones)
        │           └── 16 (Persistencia Completa)
        └── 17 (Admin)
            └── 18 (Mundo Avanzado)
```

Las fases 3 (Chat) y 17 (Admin) pueden desarrollarse en paralelo con otras
una vez que las conexiones (Fase 1) estén funcionando.
