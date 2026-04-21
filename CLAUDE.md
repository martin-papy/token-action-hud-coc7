# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Superpowers

Always use the superpowers skill system for every task in this project. Invoke the `using-superpowers` skill at the start of each session and follow the skill lookup flow — check for a relevant skill before any response or action, even for seemingly simple tasks.

## Project Context

This is a FoundryVTT module that adds a Token Action HUD for the **Call of Cthulhu 7th edition (CoC7)** game system. It is a system adapter that plugs into **Token Action HUD Core** — it cannot run standalone.

**Migration goals for this branch of work:**
- Update to the latest Token Action HUD Core API (currently `2.1.0` in `../fvtt-token-action-hud-core`)
- Update to the latest CoC7 system data model
- Migrate CI/CD from GitLab (`.gitlab-ci.yml`, `.gitlab-scripts/`) to GitHub Actions
- Update `module.json` URLs from GitLab to GitHub (manifest, download, url, readme fields)

## Build Commands

```bash
npm install        # Install dependencies
npm run build      # Bundle scripts/ → token-action-hud-coc7.min.js (production)
npm run dev        # Watch mode with source maps
```

Linting (mirrors the GitLab CI lint step):
```bash
npx eslint ./scripts/
```

There is no test framework. Validation is done by loading the module in a live FoundryVTT instance.

## Architecture

### How TAH system modules work

All classes are lazy-initialised inside a `Hooks.once('tokenActionHudCoreApiReady', (coreModule) => { ... })` callback. The `coreModule.api` object exposes base classes that the system module must extend:

| Base class | Extended in | Purpose |
|---|---|---|
| `coreModule.api.SystemManager` | `scripts/system-manager.js` | Wires everything together; entry point for TAH Core |
| `coreModule.api.ActionHandler` | `scripts/action-handler.js` | Builds the action list displayed in the HUD |
| `coreModule.api.RollHandler` | `scripts/roll-handler.js` | Handles clicks/events on HUD actions |

### Boot sequence

1. `scripts/init.js` — listens for `tokenActionHudCoreApiReady`, then sets `module.api = { requiredCoreModuleVersion, SystemManager }` and fires `tokenActionHudSystemReady`. This is the handshake TAH Core expects.
2. TAH Core calls `SystemManager` methods: `getActionHandler()`, `getRollHandler()`, `registerDefaults()`, `registerSettings()`.
3. `ActionHandler.buildSystemActions()` populates the HUD categories for each selected token.

### Action categories (defined in `scripts/constants.js` → `GROUP`)

- **Characteristics** — STR, DEX, INT, etc. (`actor.system.characteristics`)
- **Attributes** — SAN, HP, MP, Luck with +/− increment actions (`actor.system.attribs`)
- **Skills** — all `item.type === 'skill'` items
- **Combat** — weapons (`item.type === 'weapon'`) split into melee/ranged, plus combat skills

### Key files

| File | Role |
|---|---|
| `scripts/constants.js` | `MODULE`, `CORE_MODULE`, `REQUIRED_CORE_MODULE_VERSION`, `GROUP` definitions |
| `scripts/defaults.js` | Default HUD layout (`DEFAULTS`) consumed by `SystemManager.registerDefaults()` |
| `scripts/settings.js` | Module settings registration (currently empty) |
| `scripts/utils.js` | `Utils.getSetting` / `setSetting` wrappers |
| `module.json` | FoundryVTT manifest — version, compatibility, relationships, download URLs |
| `languages/en.json` | i18n strings (namespace: `tokenActionHud.coc7`) |
| `rollup.config.js` | Bundles all `scripts/*.js` and `scripts/*/*.js` into one minified ESM file |

### TAH Core reference

The sibling project at `../fvtt-token-action-hud-core` is the upstream. When updating API compatibility, compare method signatures in `../fvtt-token-action-hud-core/module/core/` against what this module calls on `coreModule.api`.

## Updating `module.json` for GitHub

When migrating to GitHub, update these fields:
- `url` → GitHub repo URL
- `manifest` → raw GitHub URL to `module.json` on the release tag
- `download` → GitHub release asset zip URL
- `readme` → GitHub repo URL
- `REQUIRED_CORE_MODULE_VERSION` in `scripts/constants.js` if bumping TAH Core version

## CoC7 System Data Model

The action handler accesses these paths on the actor — verify against the current CoC7 system when updating:
- `actor.system.characteristics[key].value` / `.short`
- `actor.system.attribs.{san,hp,mp,lck}.value` / `.max`
- `actor.system.skills[skillName].value`
- `actor.items` — items of type `skill` and `weapon`
- `item.system.skill.main.{id,name}` — skill linkage on weapons
- `item.system.properties.{rngd,combat,fighting,firearm,ranged}` — weapon/skill flags
- Actor methods called directly: `actor.characteristicCheck()`, `actor.attributeCheck()`, `actor.skillCheck()`, `actor.weaponCheck()`

## Code Exploration

If installed and available, use `codebase-memory-mcp` tools **first** for any structural code exploration:

- `search_graph(name_pattern/label/qn_pattern)` — find functions, classes, modules by name
- `trace_path(function_name, mode=calls|data_flow)` — follow call chains
- `get_code_snippet(qualified_name)` — read source for a specific symbol
- `get_architecture(aspects)` — understand project structure
- `search_code(pattern)` — graph-augmented text search

If the project is not yet indexed, run `index_repository` first. Fall back to `Grep`/`Glob`/`Read` only for config values, non-code files, or plain text content.

## External Documentation

If the **Context7 MCP server** is available, when working with FoundryVTT APIs, use it to fetch up-to-date documentation rather than relying on training data:

```
mcp__plugin_context7_context7__resolve-library-id({ libraryName: "foundryvtt" })
mcp__plugin_context7_context7__query-docs({ context7CompatibleLibraryID: "...", query: "..." })
```

Use this for: ApplicationV2, DocumentSheet, Hooks API, canvas/scene APIs, compendium packs, data models, and any other FoundryVTT or CoC7 system APIs.