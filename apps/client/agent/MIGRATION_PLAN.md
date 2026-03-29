# 🚀 PLAN DE MIGRACIÓN EXHAUSTIVO - Cliente AO

**Objetivo:** Migrar de forma iterativa y controlada TODAS las funcionalidades del Cliente Viejo (ArgentumJK - Java/libGDX) al Cliente Nuevo (Argentum - TypeScript/React/PixiJS), empezando por lo visual y siguiendo arquitectura React moderna.

---

## 📊 ESTADO ACTUAL - ¿QUÉ YA FUNCIONA?

### ✅ **Sistema de Assets (COMPLETO - NO TOCAR)**
- Sistema de sprites (grhs → sprites) funcionando completamente
- Texturas con atlas optimizadas
- Loaders para: sprites, character parts, special effects
- Hook useSprite() para sprites animados/estáticos
- TextureManager con cache
- Sistema de índices ya migrado y funcional
- **🚫 NO necesita cambios**

### ✅ **Arquitectura Base (CONFIGURADA)**
- React + PixiJS v8 + Redux Toolkit configurado
- Sistema de build con asset generation
- **🚫 NO necesita cambios arquitecturales**

---

## ⚠️ REGLAS DE DESARROLLO

### 📋 **Reglas Generales:**
1. **🎯 Visual primero:** Empezar por funcionalidades que se ven, luego conectividad
2. **🔄 Desarrollo iterativo por fase:** Cada fase será desarrollada paso a paso con input tuyo para definir HOW implementar cada paso
3. **🚫 No sobreingeniería:** Usar patrones React/Redux modernos, NO clases abstractas ni patterns de Java
4. **📱 Multiplataforma desde inicio:** Considerar web/mobile en cada implementación
5. **📚 Usar versiones actuales:** PixiJS v8, React-Pixi v8, React 19 - revisar documentación oficial antes de implementar
6. **🏗️ Nueva arquitectura:** Tomar SOLO ideas y algoritmos del Cliente Viejo, implementar con React patterns
7. **🧪 Probar cada paso:** Verificar funcionalidad antes de continuar al siguiente paso

### 📦 **Reglas de Migración:**
- **NO migrar TAL CUAL:** Adaptar a React, eliminar antipatterns de Java
- **Componentes React:** UI con componentes funcionales + hooks, estado con Redux Toolkit
- **Reutilización:** Manejar personaje propio y otros jugadores con la misma lógica (preparar para modo espectador)

---

## 📋 PLAN DE MIGRACIÓN EXHAUSTIVO

### **FASE 1: SISTEMA DE MAPAS VISUAL** 🗺️
*Implementar carga y renderizado de mapas (SIN conexión servidor)*

#### **1.1 Estructuras de Datos**
- [ ] **1.1.1** Crear types para Map, MapTile (`src/types/map.ts`)
- [ ] **1.1.2** Crear types para posiciones y direcciones
- [ ] **1.1.3** **🧪 PRUEBA:** Types compilando correctamente

#### **1.2 Loader de Mapas**
- [ ] **1.2.1** Crear mapLoader para formato .map binario (`src/loaders/mapLoader.ts`)
- [ ] **1.2.2** Parser de tiles con 4 capas gráficas + flags + triggers
- [ ] **1.2.3** Integrar con sistema de sprites existente
- [ ] **1.2.4** **🧪 PRUEBA:** Cargar un mapa simple (ej. Mapa1.map)

#### **1.3 Renderizado Básico**
- [x] **1.3.1** Componente MapRenderer (`src/components/game/MapRenderer.tsx`)
- [x] **1.3.2** Renderizado de las 4 capas por tile
- [x] **1.3.3** Sistema básico de viewport (mostrar área visible)
- [x] **1.3.4** **🧪 PRUEBA:** Ver mapa estático renderizado correctamente

#### **1.4 Sistema de Cámara/Viewport**
- [x] **1.4.1** Implementar cámara desplazable
- [x] **1.4.2** Límites del mapa (no salir de bordes)
- [x] **1.4.3** Controles con teclado/mouse para mover cámara
- [x] **1.4.4** **🧪 PRUEBA:** Navegar libremente por todo el mapa

#### **1.5 Optimizaciones de Renderizado**
- [x] **1.5.1** Culling de tiles fuera del viewport
- [x] **1.5.2** Sistema de chunks/areas para mapas grandes (implementado via culling)
- [x] **1.5.3** **🧪 PRUEBA:** Performance fluida en mapas grandes

### **FASE 2: SISTEMA DE PERSONAJES UNIFICADO** 👤
*Un solo sistema para manejar TODOS los personajes (propio y ajenos)*

#### **2.1 Estructura de Personajes**
- [ ] **2.1.1** Crear types para Character (`src/types/character.ts`)
- [ ] **2.1.2** Sistema de stats, atributos y estados del personaje
- [ ] **2.1.3** **🧪 PRUEBA:** Types de personaje definidos

#### **2.2 Renderizado de Personajes**
- [ ] **2.2.1** Componente Character (`src/components/game/Character.tsx`)
- [ ] **2.2.2** Sistema de capas (body, head, helmet, weapon, shield)
- [ ] **2.2.3** Animaciones direccionales (8 direcciones)
- [ ] **2.2.4** **🧪 PRUEBA:** Renderizar un personaje estático

#### **2.3 Animaciones y Estados**
- [ ] **2.3.1** Animaciones de movimiento suave
- [ ] **2.3.2** Estados visuales (muerto, invisible, meditando, etc.)
- [ ] **2.3.3** Sistema de interpolación de movimiento
- [ ] **2.3.4** **🧪 PRUEBA:** Personaje con animaciones funcionando

#### **2.4 Integración con Mapas**
- [ ] **2.4.1** Posicionar personajes en el mapa
- [ ] **2.4.2** Sistema de referencia al personaje propio
- [ ] **2.4.3** Lista de todos los personajes en el mapa
- [ ] **2.4.4** **🧪 PRUEBA:** Ver personaje propio en el mundo

### **FASE 3: MOVIMIENTO Y CONTROLES** 🕹️
*Implementar movimiento del personaje (SIN servidor)*

#### **3.1 Input Handling**
- [ ] **3.1.1** Controles de teclado (WASD, flechas)
- [ ] **3.1.2** Click to move con mouse
- [ ] **3.1.3** Controles táctiles para móviles
- [ ] **3.1.4** **🧪 PRUEBA:** Detectar input correctamente

#### **3.2 Validación de Movimiento**
- [ ] **3.2.1** Sistema de detección de colisiones
- [ ] **3.2.2** Validación de tiles bloqueados
- [ ] **3.2.3** Lógica de agua vs tierra (navegación)
- [ ] **3.2.4** **🧪 PRUEBA:** Movimiento respeta obstáculos

#### **3.3 Movimiento Fluido**
- [ ] **3.3.1** Smooth movement entre tiles
- [ ] **3.3.2** Seguimiento de cámara al personaje
- [ ] **3.3.3** Estados de movimiento y animaciones
- [ ] **3.3.4** **🧪 PRUEBA:** Movimiento fluido y natural

### **FASE 4: PANTALLAS PRINCIPALES** 🖥️
*UI básica para navegar entre screens principales*

#### **4.1 Sistema de Navegación**
- [ ] **4.1.1** Routing simple entre screens (React Router o Context)
- [ ] **4.1.2** Estados de la aplicación en Redux
- [ ] **4.1.3** **🧪 PRUEBA:** Navegación básica entre screens

#### **4.2 Screen de Login**
- [ ] **4.2.1** LoginScreen básico (`src/screens/LoginScreen.tsx`)
- [ ] **4.2.2** Campos usuario/contraseña
- [ ] **4.2.3** Botones: Conectar, Crear Personaje
- [ ] **4.2.4** Validación básica de campos
- [ ] **4.2.5** **🧪 PRUEBA:** UI de login funcional

#### **4.3 Screen de Creación de Personaje**
- [ ] **4.3.1** CreateCharacterScreen (`src/screens/CreateCharacterScreen.tsx`)
- [ ] **4.3.2** Formulario: Nombre, Raza, Clase, Atributos
- [ ] **4.3.3** Preview visual del personaje
- [ ] **4.3.4** Validaciones cliente-side
- [ ] **4.3.5** **🧪 PRUEBA:** Crear personaje sin servidor

#### **4.4 Screen Principal del Juego**
- [ ] **4.4.1** GameScreen (`src/screens/GameScreen.tsx`)
- [ ] **4.4.2** Integrar MapRenderer y Character
- [ ] **4.4.3** Layout básico del juego
- [ ] **4.4.4** **🧪 PRUEBA:** Flujo completo Login → CrearPJ → Juego

### **FASE 5: LIMPIEZA DE CÓDIGO EJEMPLO** 🧹
*Eliminar código de ejemplo ahora que ya no lo necesitamos*

- [ ] **5.1** Eliminar userSlice de ejemplo (`src/store/slices/userSlice.ts`)
- [ ] **5.2** Eliminar componente Example y scenes directory completo
- [ ] **5.3** Limpiar referencias en App.tsx y store.ts
- [ ] **5.4** **🧪 PRUEBA:** Proyecto funciona sin código de ejemplo

### **FASE 6: COMUNICACIÓN CON SERVIDOR** 🌐
*Implementar TODOS los paquetes de red implementados en el cliente viejo*

#### **6.1 Investigación y Setup**
- [ ] **6.1.1** Investigar mejores librerías WebSocket multiplataforma
- [ ] **6.1.2** Setup básico de conexión
- [ ] **6.1.3** **🧪 PRUEBA:** Conexión WebSocket básica

#### **6.2 Protocolo de Comunicación**
- [ ] **6.2.1** Adaptar protocolo binario a WebSockets
- [ ] **6.2.2** Sistema de cola de paquetes
- [ ] **6.2.3** Manejo de reconexión automática
- [ ] **6.2.4** **🧪 PRUEBA:** Envío/recepción de paquetes básicos

#### **6.3 ClientPackages - SOLO los implementados en cliente viejo**
- [ ] **6.3.1** **Conexión básica:** LoginExistingChar, ThrowDices, LoginNewChar
- [ ] **6.3.2** **Chat:** Talk, Yell, Whisper
- [ ] **6.3.3** **Movimiento:** Walk, RequestPositionUpdate, Attack, PickUp
- [ ] **6.3.4** **Usuario básico:** RequestAtributes, RequestFame, RequestSkills, RequestMiniStats
- [ ] **6.3.5** **Interacciones:** LeftClick, DoubleClick, UseItem, EquipItem, ChangeHeading
- [ ] **6.3.6** **Comandos Generales:** Online, Quit, Rest, Meditate, Help, RequestStats, Ping
- [ ] **6.3.7** **GM Commands básicos:** Solo los que están realmente implementados
- [ ] **6.3.8** **🧪 PRUEBA:** Paquetes implementados (con TODOs para conectar los no usados)

#### **6.4 ServerPackages - SOLO los implementados en cliente viejo**
- [ ] **6.4.1** **Conexión:** Logged, Disconnect
- [ ] **6.4.2** **Estados:** Pong
- [ ] **6.4.3** **Stats:** UpdateSta, UpdateMana, UpdateHP, UpdateGold, UpdateExp, UpdateUserStats, Atributes, Fame, MiniStats, LevelUp
- [ ] **6.4.4** **Mundo:** ChangeMap, PosUpdate, PlayMidi, PlayWave, CreateFX, ObjectCreate, ObjectDelete
- [ ] **6.4.5** **Personajes:** UserIndexInServer, UserCharIndexInServer, CharacterCreate, CharacterRemove, CharacterMove, CharacterChange, ChatOverHead, SetInvisible
- [ ] **6.4.6** **Inventario:** ChangeInventorySlot
- [ ] **6.4.7** **Mensajes:** ConsoleMsg, ShowMessageBox, ErrorMsg
- [ ] **6.4.8** **Estados Especiales:** RestOK, MeditateToggle
- [ ] **6.4.9** **🧪 PRUEBA:** Paquetes implementados (con TODOs para conectar los no usados)

#### **6.5 Estados de Conexión**
- [ ] **6.5.1** Redux slice para estado de conexión
- [ ] **6.5.2** Manejo de errores y reconexión
- [ ] **6.5.3** **🧪 PRUEBA:** Estados de conexión funcionando

### **FASE 7: INTEGRACIÓN LOGIN Y CREACIÓN** 🔐
*Conectar pantallas con servidor*

#### **7.1 Login Funcional**
- [ ] **7.1.1** Conectar LoginScreen con servidor
- [ ] **7.1.2** Manejo de respuestas de autenticación
- [ ] **7.1.3** Transición automática al juego tras login exitoso
- [ ] **7.1.4** **🧪 PRUEBA:** Login completo end-to-end

#### **7.2 Creación de Personaje Funcional**
- [ ] **7.2.1** Conectar CreateCharacterScreen con servidor
- [ ] **7.2.2** Validación server-side completa
- [ ] **7.2.3** **🧪 PRUEBA:** Crear personaje funcional

### **FASE 8: MUNDO DEL JUEGO CONECTADO** 🌍
*Integrar mundo visual con servidor*

#### **8.1 Carga de Mundo**
- [ ] **8.1.1** Recibir mapa actual del servidor
- [ ] **8.1.2** Posicionar personaje según servidor
- [ ] **8.1.3** **🧪 PRUEBA:** Entrar al mundo correctamente

#### **8.2 Movimiento Sincronizado**
- [ ] **8.2.1** Enviar movimientos al servidor
- [ ] **8.2.2** Recibir correcciones de posición
- [ ] **8.2.3** **🧪 PRUEBA:** Movimiento sincronizado

#### **8.3 Otros Personajes**
- [ ] **8.3.1** Recibir otros personajes del servidor
- [ ] **8.3.2** Mostrar otros jugadores moviéndose
- [ ] **8.3.3** **🧪 PRUEBA:** Ver otros jugadores en tiempo real

### **FASE 9: SISTEMA DE INTERACCIONES** 🎯
*Objetos, NPCs, clicks en el mundo*

#### **9.1 Objetos en el Mundo**
- [ ] **9.1.1** Renderizado de objetos en tiles
- [ ] **9.1.2** Sistema de click en objetos
- [ ] **9.1.3** **🧪 PRUEBA:** Click en objetos funcional

#### **9.2 NPCs**
- [ ] **9.2.1** Renderizado de NPCs
- [ ] **9.2.2** Interacciones con NPCs
- [ ] **9.2.3** **🧪 PRUEBA:** Hablar con NPCs

#### **9.3 Triggers y Eventos**
- [ ] **9.3.1** Sistema de triggers en tiles
- [ ] **9.3.2** Eventos especiales (puertas, teleports)
- [ ] **9.3.3** **🧪 PRUEBA:** Triggers funcionando

### **FASE 10: INVENTARIO BÁSICO** 🎒
*Sistema básico de inventario*

#### **10.1 UI de Inventario**
- [ ] **10.1.1** Componente Inventory básico
- [ ] **10.1.2** Mostrar items del inventario
- [ ] **10.1.3** **🧪 PRUEBA:** Ver inventario

#### **10.2 Integración con Servidor**
- [ ] **10.2.1** Sincronizar inventario con servidor
- [ ] **10.2.2** Usar/equipar items básico
- [ ] **10.2.3** **🧪 PRUEBA:** Inventario sincronizado

### **FASE 11: SISTEMA DE CHAT COMPLETO** 💬
*Chat y comandos tal como en cliente viejo*

#### **11.1 UI de Chat**
- [ ] **11.1.1** Componente Chat básico
- [ ] **11.1.2** Input y scroll de mensajes
- [ ] **11.1.3** **🧪 PRUEBA:** UI de chat funcional

#### **11.2 Tipos de Chat**
- [ ] **11.2.1** Normal, Whisper, Yell
- [ ] **11.2.2** Chat sobre cabeza de personajes
- [ ] **11.2.3** **🧪 PRUEBA:** Tipos básicos de chat

#### **11.3 Sistema de Comandos**
- [ ] **11.3.1** Comandos básicos implementados en cliente viejo
- [ ] **11.3.2** Parser de comandos
- [ ] **11.3.3** **🧪 PRUEBA:** Comandos funcionando

### **FASE 12: EFECTOS ESPECIALES** ✨
*FX y efectos visuales*

#### **12.1 Sistema de Efectos**
- [ ] **12.1.1** Componente FX para efectos especiales
- [ ] **12.1.2** Loop de animaciones de efectos
- [ ] **12.1.3** **🧪 PRUEBA:** Efectos renderizando

### **FASE 13: SISTEMA DE AUDIO** 🎵
*Música y sonidos*

#### **13.1 Música**
- [ ] **13.1.1** Sistema de música MIDI/MP3
- [ ] **13.1.2** Cambio automático según área
- [ ] **13.1.3** **🧪 PRUEBA:** Música funcionando

#### **13.2 Efectos de Sonido**
- [ ] **13.2.1** Sonidos de acciones
- [ ] **13.2.2** **🧪 PRUEBA:** Sonidos funcionando

### **FASE 14: OPTIMIZACIONES FINALES** 🚀
*Performance y pulido*

#### **14.1 Performance**
- [ ] **14.1.1** Profiling completo de rendimiento
- [ ] **14.1.2** Optimizaciones de renderizado
- [ ] **14.1.3** **🧪 PRUEBA:** Performance óptima

#### **14.2 Pulido Final**
- [ ] **14.2.1** Eliminar TODOs y conectar funcionalidades pendientes
- [ ] **14.2.2** Testing exhaustivo de todas las features
- [ ] **14.2.3** **🧪 PRUEBA:** Cliente completamente funcional

---

## 📊 PROGRESO

**Fase Actual:** 1 - Sistema de Mapas Visual
**Siguiente Paso:** 1.1.1 - Crear types para Map y MapTile
**Completado:** 0/110+ pasos (0%)

### 🎯 **METODOLOGÍA DE TRABAJO:**
Cada fase será desarrollada paso a paso. Antes de implementar cada paso, me pedirás input sobre:
- **CÓMO** implementar específicamente
- **QUÉ** tecnologías/librerías usar
- **DÓNDE** ubicar los archivos
- **CUÁNDO** hacer las pruebas intermedias

---

**📅 Última actualización:** 2025-09-13
**📝 Próxima revisión:** [Después de cada sesión de trabajo]