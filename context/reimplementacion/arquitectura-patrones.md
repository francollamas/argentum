# Arquitectura: Patrones Recomendados para la Reimplementacion

## Diagnostico del Dominio

El dominio de Argentum Online tiene estas caracteristicas clave que hacen que el codigo imperativo clasico sea un desastre:

1. **~50+ flags booleanos** por personaje que se chequean en combinaciones distintas por cada accion
2. **Precondiciones apiladas** (hasta 25 guards en un solo ataque PvP)
3. **Cascadas de side-effects** (la muerte dispara 10+ efectos; matar a un ciudadano puede causar cascadas recursivas en clanes)
4. **Comportamiento variable por clase** (12 clases x ~20 multiplicadores)
5. **Comportamiento variable por zona** (8+ tipos de trigger de mapa)
6. **Cross-cutting concerns** (estar muerto bloquea casi todo, zona segura bloquea combate/robo/domar, cooldowns cruzan combate/magia/items)

---

## Patron Recomendado: Arquitectura Hibrida basada en Rules + Events + Specifications

No existe UN solo patron que resuelva todo, pero hay una combinacion que calza muy bien con este dominio.

### 1. Specification Pattern (para precondiciones/guards)

En vez de 25 `if` anidados antes de atacar:

```csharp
// MAL - imperativo, spaguetti, imposible de testear
public void Attack(Player attacker, Entity target) {
    if (attacker.IsDead) return;
    if (attacker.IsParalyzed) return;
    if (attacker.Stamina < 10) return;
    if (!IsAdjacent(attacker, target)) return;
    if (IsInSafeZone(attacker)) return;
    // ...25 ifs mas
}

// BIEN - Specification Pattern
public class CanAttackSpec : CompositeSpecification<AttackContext>
{
    public CanAttackSpec()
    {
        Add(new IsAlive());
        Add(new IsNotParalyzed());
        Add(new HasMinStamina(10));
        Add(new IsAdjacentTo()); 
        Add(new NotInSafeZone());
        Add(new PvPSafetyCheck());
        Add(new FactionCompatibility());
        Add(new NpcOwnershipCheck());
        // cada spec es testeable individualmente
    }
}
```

Cada `Specification` es una clase pequena, testeable, reutilizable. `NotInSafeZone` se usa en ataque, robo, domar, invocar. Se escribe una vez.

### 2. Domain Events + Handlers (para cascadas de side-effects)

En vez de meter toda la cascada de muerte en un metodo gigante:

```csharp
// La accion de morir solo publica el evento
public void Die(Character character)
{
    character.IsAlive = false;
    Publish(new CharacterDied(character));
}

// Cada consecuencia es un handler independiente
public class DropInventoryOnDeath : IHandle<CharacterDied> { ... }
public class ClearStatusEffectsOnDeath : IHandle<CharacterDied> { ... }
public class KillPetsOnDeath : IHandle<CharacterDied> { ... }
public class SetGhostAppearanceOnDeath : IHandle<CharacterDied> { ... }
public class CancelTradeOnDeath : IHandle<CharacterDied> { ... }
public class NotifyPartyOnDeath : IHandle<CharacterDied> { ... }
```

Cada handler es independiente, testeable, y se puede agregar/quitar sin tocar los otros. La cascada de "matar ciudadano -> criminal -> expulsion de faccion -> antifaccion de clan -> downgrade de clan" se modela naturalmente: cada handler puede publicar nuevos eventos que otros handlers consumen.

### 3. Strategy Pattern (para variacion por clase)

En vez de un `switch` con 12 cases en cada formula:

```csharp
// Cada clase define su propio comportamiento
public interface IClassProfile
{
    float MeleeDamageModifier { get; }
    float EvasionModifier { get; }
    int HpPerLevel(int level, int constitution);
    int ManaPerLevel(int level, int intelligence);
    bool CanSteal { get; }          // solo Ladron
    bool CanBackstabWithRanged { get; } // solo Pirata
    // etc.
}
```

### 4. Zone Rules como estrategias inyectables

```csharp
public interface IZoneRules
{
    bool AllowsCombat { get; }
    bool AllowsMagic { get; }
    bool AllowsTheft { get; }
    bool DropsItemsOnDeath { get; }
    bool AffectsReputation { get; }
}
// SafeZone, ArenaZone, PkZone, AntiPiqueteZone implementan esto
```

### 5. State Machine para estados del personaje

Para manejar los ~50 flags y sus transiciones validas (meditando -> recibe dano -> sale de meditacion; invisible -> ataca -> pierde invisibilidad):

```csharp
// Los estados definen que acciones bloquean y que transiciones son validas
public class MeditatingState : ICharacterState
{
    public bool Blocks(ActionType action) => 
        action is ActionType.Move or ActionType.Attack or ActionType.Cast;
    
    public void OnEvent(CharacterEvent evt)
    {
        if (evt is DamageTaken dmg && dmg.Amount > threshold)
            TransitionTo<IdleState>();
    }
}
```

---

## Como se compone todo

```
Accion del jugador (ej: Atacar)
    |
    v
+---------------------+
|  Specification Chain |  <-- Guards/precondiciones (reutilizables)
|  (puede hacerlo?)    |
+---------+-----------+
          | OK
          v
+---------------------+
|  Action Execution   |  <-- Strategy por clase + Zone rules
|  (resolver accion)  |
+---------+-----------+
          |
          v
+---------------------+
|  Domain Events      |  <-- Publicar lo que paso
|  (AttackLanded,     |
|   DamageTaken, etc) |
+---------+-----------+
          |
          v
+---------------------+
|  Event Handlers     |  <-- Cascadas de side-effects
|  (independientes,   |      Pueden publicar mas eventos
|   testeables)       |
+---------------------+
```

---

## Beneficios concretos para AO

- **Las ~50 precondiciones de combate** se vuelven una lista de specs que se pueden componer, reordenar, y testear individualmente
- **La cascada de muerte** (10 side-effects) se vuelven 10 handlers independientes con tests unitarios
- **"Zona segura bloquea X"** se escribe UNA vez como spec y se reutiliza en combate, robo, domar, invocar
- **Agregar una clase nueva** es implementar `IClassProfile`, no tocar 40 switches
- **La cascada recursiva de antifaccion** se modela naturalmente con eventos que disparan eventos
- **Cada regla de negocio de la wiki mapea 1:1** a una clase con nombre descriptivo, lo que hace la wiki auditable contra el codigo

---

## Por que esta combinacion y no otra cosa

| Alternativa | Por que no calza bien aca |
|---|---|
| **Solo CQRS/Event Sourcing** | Overkill para un game server con tick loop. Agrega latencia innecesaria y complejidad de infraestructura |
| **Solo Rules Engine (Drools-style)** | Demasiado opaco para debugging de un juego. Cuando un ataque falla, queres saber exactamente QUE spec fallo |
| **Entity Component System (ECS)** | Bueno para rendering/physics, pero las reglas de negocio de AO son demasiado ricas en logica condicional para encajar bien en systems puros de ECS (ver seccion dedicada mas abajo) |
| **Puro imperativo con "clean code"** | Exactamente lo que queremos evitar. Con 25 precondiciones y 10 side-effects por accion, no hay forma de mantenerlo limpio |

---

## Por que NO Entity Component System (ECS)

ECS no es "malo" en general — es que el tipo de logica de AO tiene caracteristicas especificas que lo hacen friccionar con ECS puro.

### Que es ECS en resumen

En ECS:
- **Entity** = un ID (nada mas)
- **Component** = datos puros, sin logica (`HealthComponent { HP, MaxHP }`)
- **System** = logica que opera sobre entidades que tienen ciertos componentes

La regla de oro de ECS es: **los components no tienen logica, los systems no tienen estado**. La data fluye por systems que filtran entidades por sus componentes.

### Donde ECS es brillante

Motores de fisica, rendering, particulas, movimiento — cosas donde hay miles de entidades que se procesan de forma homogenea:

```csharp
// System tipico de ECS — simple, elegante, masivamente paralelizable
public class MovementSystem : ISystem
{
    public void Update(Query<Position, Velocity> entities)
    {
        foreach (var (pos, vel) in entities)
            pos.Value += vel.Value * deltaTime;
    }
}
```

Esto escala espectacularmente. Pero cuando se intenta modelar las reglas de AO, aparecen los problemas.

### Problema 1: Las precondiciones explotan en complejidad condicional

El ataque fisico PvP en ECS necesita un `CombatSystem` que procese ataques. Pero la cantidad de componentes que se necesitan consultar es enorme:

```csharp
public class MeleeAttackSystem : ISystem
{
    public void Update(
        Query<AttackIntent, Position, Facing, Stamina, AliveFlag, 
              ParalysisState, ClassProfile, FactionMembership, 
              ReputationCounters, SafetyLock, CooldownTimers,
              NavigationState, NewbieFlag> attackers,
        Query<Position, AliveFlag, HealthPoints, ArmorSlot, ShieldSlot,
              HelmetSlot, ClassProfile, FactionMembership, 
              ReputationCounters, NpcOwnership, PartyMembership,
              NavigationState, MeditationState, InvisibilityState> targets,
        Query<MapTriggers, ZoneType> maps)
    {
        foreach (var attacker in attackers)
        {
            // Ahora necesitas los 25 ifs de vuelta,
            // pero distribuidos entre 15+ componentes
            // que hay que cruzar manualmente
        }
    }
}
```

El system termina siendo un metodo gigante con toda la logica condicional adentro igual, pero ahora ademas con queries complejas sobre multiples componentes. **No se gana nada** — el spaguetti se mudo de lugar.

En ECS, los systems funcionan bien cuando la logica es **uniform**: "a toda entidad con Position y Velocity, aplicale movimiento". Las reglas de AO son lo opuesto: **altamente condicional y contextual**.

### Problema 2: Las cascadas de side-effects rompen el modelo de flujo de datos

ECS asume que los systems corren en un orden definido y cada uno hace su parte. Pero la cascada de muerte:

```
CharacterDied ->
  |-- DropInventory (toca InventoryComponent, genera entidades en el piso)
  |-- ClearStatusEffects (toca 8+ components: Poison, Paralysis, Invisibility...)
  |-- KillPets (destruye otras entidades que referencian a esta)
  |-- SetGhostAppearance (toca BodyComponent, HeadComponent)
  |-- CancelTrade (toca TradeSession — que referencia OTRA entidad)
  |-- RestoreBuffs (toca AttributeBuffComponent)
  +-- NotifyParty (toca PartyComponent de OTROS jugadores)
```

En ECS puro, un system no deberia tocar componentes que no le corresponden. Pero aca, la muerte toca **inventario, status, pets, apariencia, comercio, atributos y party**. Las dos opciones son malas:

**Opcion A**: Un `DeathSystem` gigante que tiene acceso a todo (rompe la filosofia de ECS de systems enfocados)

**Opcion B**: Encadenar 7 systems separados que corren en orden — pero entonces se necesita un mecanismo de senalizacion entre systems (flags, command buffers, etc.) que en la practica es reinventar un event bus adentro de ECS.

### Problema 3: La logica de clase necesita polimorfismo, ECS lo evita por diseno

AO tiene 12 clases con comportamiento cualitativamente distinto. No es solo "modificar un numero":

| Clase | Comportamiento unico |
|-------|---------------------|
| Ladron | Puede robar items (no solo oro), puede desarmar, puede paralizar con guantes |
| Druida | Mimetismo con NPCs (IA hostil lo ignora), descuento de mana con flauta |
| Cazador | Ocultarse permanente con skill>90 + armadura especifica |
| Pirata | Backstab con armas a distancia, galeon fantasma al ocultarse navegando |
| Bandido | Golpe critico con Espada Vikinga, desequipar con Guantes de Hurto |

En ECS, esto se modelaria con components opcionales:

```csharp
// Components condicionales por clase
entity.Add<CanStealItems>();       // solo Ladron
entity.Add<CanMimicNpc>();         // solo Druida  
entity.Add<PermanentHide>();       // solo Cazador con skill>90
entity.Add<RangedBackstab>();      // solo Pirata
entity.Add<CriticalStrike>();      // solo Bandido con Espada Vikinga
```

Y despues en cada system, hay que chequear si el component existe:

```csharp
public class BackstabSystem : ISystem
{
    public void Update(Query<AttackResult, ClassProfile> entities)
    {
        foreach (var entity in entities)
        {
            if (entity.Has<RangedBackstab>())
                // logica pirata
            else
                // logica normal (pero con curva cubica distinta por clase)
                // pero esa curva depende de ClassProfile
                // y el multiplicador es distinto PvP vs PvE
                // y el Asesino tiene probabilidad mas alta pero dano mas bajo
        }
    }
}
```

Esto es **polimorfismo reimplementado con ifs y flags** — exactamente lo que ECS fuerza a hacer porque sus components son datos puros sin comportamiento. Con un `IClassProfile` y Strategy Pattern, cada clase define su curva de backstab en una clase propia y no se necesita ningun `if`.

### Problema 4: Las queries multi-entidad son incomodas

Muchas reglas de AO necesitan cruzar datos de **dos o mas entidades simultaneamente**:

- Atacar: datos del atacante + defensor + mapa + NPC ownership + party de ambos
- Robar: datos del ladron + victima + faccion de ambos + inventario de la victima
- Resurreccion: datos del caster + target + mapa + instrumento/baston equipado

ECS esta optimizado para procesar **una entidad a la vez** con sus componentes. Cuando se necesita resolver logica que depende del estado de 2-3 entidades distintas mas el contexto del mapa, las queries se vuelven forzadas y el code termina pareciendose a codigo imperativo normal pero con mas indireccion.

### Donde SI se podria usar ECS en este proyecto

Para los subsistemas que **si** son homogeneos y de alto volumen:

- **Movimiento de NPCs** (pathfinding, patrullas)
- **Timers y ticks** (regeneracion, duracion de veneno/paralisis/buff)
- **Areas de vision** (calcular que ve cada jugador)
- **Respawn de NPCs** (contadores de tiempo, spawn positions)

Esos subsistemas si procesan muchas entidades de forma uniforme. Pero son aproximadamente el 15-20% del codebase — el 80% restante es logica de negocio condicional donde ECS agrega friccion sin dar beneficio real.

---

## Comparativa final: ECS vs Specs + Events + Strategy

| Aspecto | ECS | Specs + Events + Strategy |
|---------|-----|---------------------------|
| 25 precondiciones de combate | Se mudan al system como ifs | Cada una es una spec reutilizable y testeable |
| Cascada de muerte (10 effects) | System gigante o reinventas events dentro de ECS | Handlers independientes, cada uno testeable |
| 12 clases con logica distinta | Flags + ifs en los systems | Polimorfismo real con Strategy |
| Reglas cruzadas entre 2-3 entidades | Queries incomodas | Metodo recibe las entidades directamente |
| Debugging "por que no puedo atacar?" | Rastrear que component falta o que system no proceso | La spec que fallo dice exactamente cual fue |
| Procesamiento masivo homogeneo | Excelente (movimiento, timers, vision) | No aplica (no es su objetivo) |
