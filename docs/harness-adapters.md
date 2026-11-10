# Harness adapters

This library ships one canonical source for skills, agents and the push/post guard. Four adapters are generated from it by `scripts/build-adapters.mjs`; they are never edited by hand.

## Canonical sources

| Source | Format | What it is |
| --- | --- | --- |
| `agents/<name>.md` | Claude Code agent Markdown | System prompt, model, tools, skills, permissions |
| `skills/<category>/<name>/SKILL.md` | OpenCode / agent-skills standard | Instructions, description, optional scripts and references |
| `hooks/outbound.json` | JSON | One pattern list for "ask before push or post": shell regexes, prefix rules, MCP write tool patterns, reason text |
| `package.json` | JSON | Version, pi manifest (skills root + guard extension) |

Run `node scripts/build-adapters.mjs` after any change to the sources. `node scripts/build-adapters.mjs --check` fails if any generated file is stale; use it in CI.

The builder excludes `agents/README.md` and the supporting `agents/learning_checklist.md` from agent discovery. Other `agents/*.md` files must be profiles with frontmatter. Structural checks verify generated consistency, not that a role or workflow has been exercised successfully.

The [coordination contract](project-coordination.md) adds delivery-lead record writing and specialist consultation. Agent profiles express allowed capabilities and instructions; they do not create a message transport or guarantee that an invocation tool is available. Direct messaging uses native harness support when observed; otherwise the coordinator relays. Delivery-lead's Edit/Write capability is restricted to approved coordination records by instruction, not by a generated per-path sandbox. See the [T07 behavior report](harness-behavior.md) for source evidence, the unresolved OpenCode permission-format discrepancy, relay procedure and remaining live checks. Live/version-specific verification remains incomplete.

## Generated adapters

```
adapters/
├── opencode/              # OpenCode V2
│   ├── agents/*.md        # Subagent profiles with ordered permission rules
│   ├── commands/*.md      # Slash commands (one per workflow skill)
│   └── opencode.json      # Global permission rules (the guard)
├── pi/                    # pi coding agent
│   ├── agents/*.md        # Agents for pi's example subagent extension
│   ├── extensions/
│   │   └── construct-guard.ts  # Prime directive 1 extension
│   └── skills/            # Symlinks to canonical skills
├── codex/                 # Codex CLI
│   ├── agents/*.toml      # Custom agents (sandbox_mode + developer_instructions)
│   ├── skills/            # Symlinks to canonical skills
│   ├── rules/
│   │   └── construct.rules    # Prompt rules for forge prefix commands
│   └── hooks.json         # Backstop: deny raw API mutations and MCP writes
└── claude/                # Claude Code plugin
    ├── .claude-plugin/
    │   └── plugin.json    # Plugin manifest
    ├── agents/            # Symlinks to canonical agents
    ├── skills/            # Symlinks to canonical skills
    └── hooks/             # Symlink to hooks/ (confirm-outbound.sh + hooks.json)
hooks/
├── outbound.json          # Canonical pattern list
├── confirm-outbound.sh    # PreToolUse guard for Claude Code ("ask") and Codex ("deny")
└── hooks.json             # Generated Claude hook config
```

## Installing each harness

Before using external-service tools in any harness, follow [tool preflight](tool-preflight.md). Check the tool, reuse an existing connection for the correct host/account, and ask for the authentication method when none is configured or the selection is unclear. Offline checks do not establish live authentication validity.

### Claude Code

```bash
claude plugin install <this checkout>
```
The plugin brings the skills (via `skills/` symlinks), the agents (via `agents/` symlinks) and the push/post guard (via `hooks/` symlink). A local plugin for development:

```bash
claude --plugin-dir <this checkout>
```

### OpenCode

Point OpenCode's extra config folder at the adapter. It brings the agents, the commands and the guard permissions:

```bash
export OPENCODE_CONFIG_DIR=<this checkout>/adapters/opencode
```
Add that to your shell profile. If you already use `OPENCODE_CONFIG_DIR`, link the files into your own folder instead and copy the `permission.bash` rules from `opencode.json`.

Run: `opencode`, then `/code-review 123`, `@reviewer look at this branch`.

### pi

```bash
pi install <this checkout>
```
pi asks you to trust the skills folder (the canonical skills). For the crew, install pi's example subagent extension, then link the agents:

```bash
PI_EX="$(npm root -g)/@earendil-works/pi-coding-agent/examples/extensions/subagent"
mkdir -p ~/.pi/agent/extensions/subagent ~/.pi/agent/agents
ln -sf "$PI_EX/index.ts" "$PI_EX/agents.ts" ~/.pi/agent/extensions/subagent/
ln -sf <this checkout>/adapters/pi/agents/*.md ~/.pi/agent/agents/
```

Run: `pi /skill:code-review 123`, or ask for the reviewer subagent.

### Codex

Codex discovers project-local skills under `.codex/skills/` (compatibility) and custom agents under `.codex/agents/`. The adapter symlinks them:

```bash
# From the repo root, the adapter is already at .codex/:
codex
```

Or for a clean project-local setup without the full checkout:

```bash
mkdir -p .codex/skills .codex/agents .codex/rules
ln -sf <this checkout>/adapters/codex/skills/* .codex/skills/
ln -sf <this checkout>/adapters/codex/agents/*.toml .codex/agents/
ln -sf <this checkout>/adapters/codex/rules/construct.rules .codex/rules/
ln -sf <this checkout>/adapters/codex/hooks.json .codex/hooks.json
# Also set CONSTRUCT_DIR so the hook backstop finds confirm-outbound.sh:
export CONSTRUCT_DIR=<this checkout>
```

The Codex guard has two layers:
1. **Prefix rules** (`.codex/rules/construct.rules`): `git push`, `gh pr create`, `glab mr note`, etc. — prompt before running outside the sandbox.
2. **Hook backstop** (`.codex/hooks.json`): raw forge API mutations (`gh api -X POST`) and forge MCP write tools are denied with a reason, because Codex hooks cannot prompt yet. The user runs the command themselves or disables the hook in `/hooks` for the session.

Run: `codex "review #123"`, `$skill:til`, `$skill:feature-doc`.

## The guard: one pattern list, four expressions

`hooks/outbound.json` is the single source. It contains:

- `bash_regex` — ERE/JS compatible, used by the Claude/Codex hook script.
- `bash_ignore` — read-only `glab note list` calls.
- `codex_hook_regex` — subset for the Codex hook backstop (raw mutations, MCP writes).
- `opencode_shell_ask` — literal glob patterns for OpenCode's `permission.bash`.
- `codex_rules` — argv prefixes for Codex's `prefix_rule` (the prompt layer).
- `mcp_write_tools` — regex for forge MCP write tool names.

Every adapter consumes the same `reason` string, so the user sees the same message in every harness.

## Baselines and tagged rules

The `learn-from-fixes` skill audits local rules against the project's docs. Rules the docs do not cover yet are kept in a local file, each tagged:

| Tag | Meaning |
| --- | --- |
| `baseline` | Candidate for an upstream docs change. When confirmed twice in real reviews, `learn-from-fixes` drafts the docs change. |
| `preference` | Stricter house style than the docs; stays local. |

A skill that writes local rules (`learn-from-fixes`, `feature-doc`) writes to the user's construct checkout, never the installed plugin or adapter copy. The source checkout is the write target.
