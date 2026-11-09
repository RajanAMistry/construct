# Guided terminal setup

Run the dependency-free terminal wizard before installing Construct resources:

```sh
# From the Construct checkout:
npm run setup

# From another project, preserving that project as the current target:
npm --prefix /path/to/construct run setup
# Or:
node /path/to/construct/scripts/setup.mjs
```

Requires Node.js 22 or later, Git, and Linux or macOS. Harness executables need not be installed to prepare their resource files. Setup does not download dependencies, run login flows, inspect credential stores, contact services or edit shell profiles. `--help` prints the command contract without prompting or writing.

## Choices and review

1. Choose where Construct is needed: current project, other project folders, global for this user, or both global and project folders. Project targets must already exist. Enter `current` or leave the project-path answer empty for the current directory; otherwise enter comma-separated paths. Relative paths and `~/` are supported; spaces are preserved, but comma characters in paths are not supported. Duplicate paths are collapsed.
2. Select one or several numbered harnesses, separated by commas, or enter `all`: Claude Code, OpenCode, pi and Codex.
3. Select GitHub, GitLab, custom service names or none. Record optional existing repository folders and other working folders. These are references only; setup does not clone, traverse or synchronize them. Never enter credentials or private notes.
4. Review the snapshot destination, native destinations, CREATE/UNCHANGED/OVERWRITE labels, replacement configuration contents, saved choices and activation notes. OVERWRITE replaces the entire listed file, directory or link; settings are not merged. Files outside the displayed destinations remain untouched.
5. Answer Yes to apply. Existing overwritten entries are backed up first. No, an empty confirmation, Ctrl+C or EOF cancels the entire setup without applying changes. If nothing changed, the wizard reports that without writing or asking for approval.

Declining an overwrite cancels all selected targets. Changes made by another process between planning and applying invalidate the plan. Symlinked destination parent directories are refused, since writing through them could affect another installation; choose a plain directory rather than replacing such a directory automatically.

## Snapshots and installed resources

Each target holds its own `.construct-setup/snapshots/<content-id>/`. Global setup uses the user's home as its target. Only tracked files under the library's explicit resource allowlist enter the snapshot; `.git`, untracked files, `.obsidian`, private folders and local environment files are excluded. A tracked credential is still a publication defect: the allowlist is not a secret scanner.

The snapshot preserves the canonical layout and its relative links. Native resource links point into this copied snapshot, never into the source checkout. Updating, moving or removing the source checkout does not change the installation. Run setup again to review and adopt a new snapshot. Identical resources and choices cause no writes or backups. Setup does not remove resources belonging to a harness deselected on a later run or delete older snapshots.

| Harness | Project resources | Global resources and limits |
| --- | --- | --- |
| Claude Code | `.claude/skills/`, `.claude/agents/`, `.claude/settings.json` with bound hook commands | Same resources under `~/.claude/`, respecting `CLAUDE_CONFIG_DIR`; installed as native resources rather than registering a marketplace plugin |
| OpenCode | `.opencode/agents/`, `commands/`, `skills/`, `opencode.json` | `~/.config/opencode/`, respecting `OPENCODE_CONFIG_DIR` or `XDG_CONFIG_HOME`; higher-precedence configuration can affect permissions |
| pi | `.pi/settings.json` declaring the snapshot as a local package, plus `.pi/agents/` profiles | `~/.pi/agent/`, respecting `PI_CODING_AGENT_DIR`; agent invocation requires pi's separate subagent extension, which this wizard does not install |
| Codex | `.agents/skills/`, `.codex/agents/`, `.codex/rules/construct.rules`, `.codex/hooks.json` | `~/.agents/skills/` and `~/.codex/` (respecting `CODEX_HOME` for Codex resources); existing `config.toml` stays untouched, so enable `features.hooks = true` yourself if needed |

No harness CLI is invoked during apply. Restart the selected harness, complete any project-trust review, and inspect its discovered skills/agents. Bash and `jq` are prerequisites for the Claude/Codex shell guard; absence does not prevent file installation and the existing guard skips checking without `jq`. A successful file install is not evidence that a guard is active. Do not rely on it until verified in the intended harness. See [adapter guidance](harness-adapters.md) and [tool preflight](tool-preflight.md).

Service selection records intent, not a connection. For GitHub, inspect `gh --help` and `gh auth login --help`; for GitLab, inspect `glab --help` and `glab auth login --help` and confirm the hostname. Alternatively choose an appropriate connected integration. Custom services require their own supported instructions. The user completes sign-in through a secure flow. Live authentication remains unverified.

## Local records, backups and recovery

`.construct-setup/plan.json` records the source revision, content ID, target, harness/service choices, repository/folder references and activation limits. It contains no credential values. Its directory includes a wildcard `.gitignore`; keep it, snapshots and backups local. Native resource paths contain local snapshot references too: review your project's Git status before committing any setup-generated files. Do not publish real hosts, accounts, private paths, backups or setup transcripts.

Before overwriting, setup moves the original entry into a unique `.construct-setup/backups/<run>/` directory. This preserves file contents, permissions and symlinks themselves, without changing symlink referents. New directories use owner-only permissions; existing parent permissions are preserved. A successful overwrite run prints the path to `restore.json`, mapping original paths to backup paths; it also lists newly created entries with a null backup.

For manual recovery, stop the relevant harness and read that mapping locally. Preserve any newer edits first. Restore only the listed original entries from their backup locations, and remove only reviewed newly created entries when undoing a run. Do not delete a snapshot still referenced by another installed resource. Setup does not offer an automatic restore command in T01.

On an apply error, setup attempts to remove its newly written entries and restore all originals changed by this run. If restoration fails, it reports the affected paths and backup locations; keep those backups for manual recovery. A forced process kill or power loss can interrupt that recovery, so apply is not a filesystem-wide atomic transaction. A recovery mapping is written before the first overwrite. In an interrupted run, some mapped entries may not have been processed: check whether each backup actually exists before restoring it. Do not run competing setup processes against the same targets.

For project-specific hosts, account references, paths and remembered common preferences, use the separate [private configuration example](private-configuration.md). Setup does not collect or consume it; reruns preserve it.

## T01 responsibilities and evidence

Delivery-lead owns the intake, agreed acceptance criteria, plan review and handoff. Software-engineer owns plan construction, conflict checks, backup/apply and verification. Technical-writer owns the walkthrough, destinations, recovery guidance and accurate limitations. The executable carries the repeatable mechanics; it does not launch these agents or claim their participation in a live squad run.

Agreed acceptance: all four harnesses can be selected together or separately; project/global/both scopes and multiple existing paths work; services and folders are collected without authentication; a snapshot plan is reviewable before writing; Yes applies, No/EOF/Ctrl+C cancels; approved overwrites preserve backups; identical reruns preserve existing configuration; failures and concurrent edits have explicit outcomes. Overwrites require explicit review and backups.

Run the focused offline checks:

```sh
npm run test:setup
npm run check
```

Verification: all 17 synthetic checks passed, along with the adapter consistency check; an all-four terminal walkthrough applied its reviewed plan in a disposable project. These were implementation self-checks, not independent agent acceptance.

The synthetic tests use disposable projects and home directories. They cover all four resource layouts, selected harnesses, global plus multiple projects, cancellation, reruns, backed-up file/directory/link replacement, stale-plan rejection, destination-symlink refusal, source allowlisting and apply-failure recovery. They verify filesystem outcomes; live harness discovery, hook enforcement, authentication and cross-agent communication remain unverified. The harness/agent statuses remain Draft. Environment diagnostics, private-configuration design, general validation and the full update/removal workflow remain separate backlog tasks.

## References consulted

- [Node readline](https://nodejs.org/api/readline.html): line-based terminal input without dependencies.
- [Claude Code settings](https://code.claude.com/docs/en/settings): native project/global settings and resource scope.
- [OpenCode configuration](https://opencode.ai/docs/config/): project/global resource locations and ordered permissions.
- [pi packages](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md): local package declarations and project/global settings.
- [Codex skills](https://developers.openai.com/codex/skills/) and [configuration reference](https://developers.openai.com/codex/config-reference/): skill discovery and hooks activation.

These are public documentation references, not proof of installed harness compatibility. The runnable contract is the local setup implementation and its recorded offline tests.
