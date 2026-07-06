# Godot Client - Migration Context

## What this project is

This project is the new **Argentum Online client in Godot**.

It is a gradual migration from the existing `apps/client-pixi` project to Godot, not a literal port line by line. The goal is to preserve the game behavior and existing asset/data formats where useful, while **rebuilding systems when Godot offers a better or more native approach**.

The priority is to get the game running step by step with solid foundations, starting from:
- graphics loading
- sprite rendering
- map rendering

UI is intentionally **not** the current focus.

## Migration principles

- **Migrate behavior, not abstractions**: do not copy React/Pixi patterns directly into Godot if Godot has a more natural equivalent.
- **Prefer native Godot solutions**: if Godot already solves a problem well, use that before building custom infrastructure.
- **Incremental slices**: each milestone should produce something visible and testable in the engine.
- **Keep the project runnable**: avoid large rewrites that leave the client in a broken intermediate state.
- **Use the existing Pixi client as reference**: `apps/client-pixi` is the main migration reference, especially for formats, rendering semantics, and asset workflows.

## Current migration scope

The current scope is the **world rendering foundation**, especially:
- loading raw world graphics
- parsing `sprites.bin`
- rendering static and animated AO graphics
- preparing the path toward map rendering

The current scope explicitly does **not** prioritize:
- full UI migration
- networking
- gameplay systems unrelated to world rendering
- premature optimization
- atlas rebuilding unless it becomes clearly necessary

## Asset and data context

At this stage, the Godot client uses:
- `assets/graphics/world/` for raw world PNG graphics
- `assets/inits/sprites.bin` as the source of truth for sprite definitions

Important semantic rule from AO data:
- A **static sprite** in `sprites.bin` defines:
  - a `texture_id`
  - a `region` inside that source texture
- An **animated sprite** defines:
  - a list of frame sprite ids
  - each frame points to another static sprite definition
  - each static frame carries the actual `texture_id + region`

This means rendering must follow the AO sprite model correctly, not assume that a sprite id is always the final PNG.

## Relationship with client-pixi

`apps/client-pixi` remains the primary reference implementation during migration.

Use it to understand:
- `sprites.bin` parsing
- map loading semantics
- sprite/frame behavior
- rendering expectations
- asset preparation history

But do **not** blindly copy:
- React hooks
- Pixi-specific rendering abstractions
- manual solutions that Godot already replaces with native engine features

## Godot-specific expectations

When implementing in this project:
- prefer `Sprite2D`, `AnimatedSprite2D`, `AtlasTexture`, `TileMapLayer`, `Camera2D`, and other native Godot primitives where appropriate
- keep scripts small and focused
- separate parsing/data concerns from rendering concerns
- avoid editor-only hacks becoming serialized scene data accidentally
- preserve pixel-art fidelity through project-level defaults and correct texture handling

## Godot tooling rule

For any operation that depends on the live Godot editor or the running game, use the `godot-ai` MCP tools by default.

This includes:
- opening or inspecting scenes in the editor
- reading or modifying nodes and properties through the editor
- running the project or current scene
- checking editor or game logs
- taking screenshots
- runtime inspection and input simulation
- running Godot-side tests

Use normal repository file editing tools for plain source or documentation changes when live editor state is not required.

## Current milestone

The first milestone is:

- choose a `graphic_id`
- parse it from `sprites.bin`
- render it correctly in Godot
- support both static and animated graphics

Only after this slice is stable should the migration move into map rendering.

## Decision rule

If there is a choice between:
- reproducing a Pixi workaround, or
- using a clean Godot-native solution

prefer the Godot-native solution unless there is a strong compatibility reason not to.

## Practical workflow

Before implementing a new piece:
1. Check how `client-pixi` currently behaves.
2. Verify the underlying AO data format and semantics.
3. Evaluate whether Godot already has a native solution.
4. Implement the smallest correct slice in Godot.
5. Validate visually in-engine before expanding scope.

## Godot AI plugin dependency

This project uses `godot_ai` as an external dependency via **git submodule**, not as vendored source code.

- Submodule path: `apps/client/.deps/godot-ai`
- Godot plugin path: `apps/client/addons/godot_ai` (symlink to `../.deps/godot-ai/plugin/addons/godot_ai`)
- Upstream: `https://github.com/hi-godot/godot-ai.git`
- Versioning rule: keep it pinned to an explicit tag or commit

Why this rule exists:
- do not mix third-party plugin source changes into normal client commits
- keep the plugin version reproducible across machines
- update the plugin only when intentionally changing the dependency version

Common commands:

```bash
git submodule update --init --recursive
git submodule status
test -f apps/client/addons/godot_ai/plugin.cfg
```

To update the plugin intentionally:

```bash
git -C apps/client/.deps/godot-ai fetch --tags
git -C apps/client/.deps/godot-ai checkout vX.Y.Z
git add apps/client/.deps/godot-ai
```

Important note:
- enabling or reconfiguring the plugin from the Godot editor may modify `apps/client/project.godot`
- treat those changes as explicit project-configuration changes, not as part of unrelated gameplay or rendering work
