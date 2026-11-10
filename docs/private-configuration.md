# Project-private configuration

Status: Draft. T03 supplies a JSON example and a manual workflow. No setup integration, configuration loader or automatic preference application is implemented.

## Location and scope

Keep each project's choices in `<project>/.construct-setup/config.json`. Start from the [synthetic example](../templates/project-config.example.json). Only that fictional template belongs in the public repository; the filled-in copy stays ignored and local to its project. There is no Construct-wide preference store in this scope.

The existing `.construct-setup/plan.json` is a setup-generated installation record. It continues to own selected harnesses, service names, installation targets and snapshot metadata. `config.json` adds private host/account references, working paths and user preferences. Do not edit generated plan fields to store these choices. Setup does not read or write `config.json`; ordinary setup reruns leave it alone.

When plan and configuration disagree about a service or project, ask which intent is current before dependent work. Do not merge them silently. Global installation choices in a setup plan do not make project preferences global.

## Create a local copy

From the target project's root, first check for an existing configuration. Review and preserve it rather than replacing it with the example. Before creating a new file, ensure `.construct-setup/` is ignored: add that directory to the project's reviewed `.gitignore`, or use `.git/info/exclude` if the exclusion should stay local. Construct itself already ignores the directory. In a project without Git, explicitly arrange private storage and exclusion from sharing/backups as appropriate; Git ignore protection is unavailable.

Verify the intended exclusion before filling in private values:

```sh
git check-ignore --no-index .construct-setup/config.json
git ls-files -- .construct-setup
```

The first command must show the ignored path; the second must show no tracked private configuration, snapshots or backups. An ignore rule does not protect already tracked files or forced additions. If private files are tracked, stop publication and agree remediation; ignoring them alone does not remove them from history.

Create the directory and copy the template only if neither already exists as a conflicting file or symlink. Use owner-only directory/file permissions (0700/0600 on POSIX), without changing existing parent permissions or following a redirected directory. On other systems, use equivalent access controls. Do not copy actual configuration back into `templates/`, logs, issues or commits. The template's fictional service is illustrative: replace it with agreed targets or use an empty `services` array.

## Fields

| Field | Contract |
| --- | --- |
| `version` | Example contract version `1`; unknown versions require clarification, not guessed conversion |
| `paths.project` | `.` identifies the containing project; moving the file to another project requires review |
| `paths.repositories`, `paths.workingFolders` | User-selected path references; relative paths resolve from the project root, not the configuration directory; absolute paths are allowed only in the private copy; no automatic traversal or synchronization |
| `services[].id` | Unique local alias; use it in shareable summaries instead of real target details |
| `services[].host`, `accountReference` | Agreed hostname without scheme, path or embedded credentials, and intended account/workspace reference; `null` means ask before dependent access |
| `services[].authentication` | Supported method and credential-source reference, never a credential value; unresolved fields are `null` |
| `commonPreferences.git` | Separate identity and transport-authentication choices, remembered for this project only |
| `commonPreferences.coordination` | Chosen task-record kind/location and optional planning-document reference, remembered for this project only; see below |

JSON is data, never executable configuration. Do not source it into a shell, evaluate fields, expand command substitutions, or invoke a credential manager from a stored reference. Unexpected fields, duplicate service IDs, invalid JSON or a wrong field type require correction before dependent work; there is no executable validator in T03. No timestamps or previous connection results are stored: remembered intent is not fresh authentication evidence.

Supported method labels describe intent: `saved-cli`, `environment`, `connector`, `credential-helper` or `ssh`. Offer a label only when the selected tool/version supports it. `sourceReference` is a variable name, connector alias, credential-manager entry alias or SSH identity alias. For example, `EXAMPLE_FORGE_TOKEN` names a variable supplied through the user's secure environment; it is not its value. Do not store passwords, tokens, private keys, credential-bearing URLs, secret-manager payloads or shell commands. A saved CLI login should use the tool's secure credential storage; never copy its credential file. Git transport authentication and forge API sign-in are separate choices and require separate evidence.

## Ask once and remember

Ask one focused question at a time for each unresolved common preference. For Git identity: “Should this project use your existing Git identity, or a project-specific identity?” Then ask the corresponding question for Git authentication. Do not bundle identity, host, account and method into one prompt.

`choice` starts as `ask`. Record `existing` when the user chooses their current effective configuration, or `project` for an explicit project-specific preference. With `existing`, leave identity values and authentication references `null`; the native tool remains authoritative. With `project`, collect only the needed name/email or supported authentication method/source reference, one missing choice at a time. Names, email addresses and paths remain private even though they are not credentials. The two Git choices are independent. Other shared tools follow the same ask-and-remember rule when introduced; do not add guessed preferences.

Once the user answers, update only the agreed fields in this project's private file, preserving other choices. Review the change privately before saving; never overwrite malformed or concurrently changed content. A subsequent session reuses the recorded choice without asking again. Ask again only when the choice is absent/unresolved, the user requests a change, or observed configuration conflicts with the intended target. A timeout alone does not invalidate the preference or authorize switching credentials.

This file does not override native tool precedence. For example, an environment credential can override a saved CLI login. Compare the selected source and target with safe observed metadata under [tool preflight](tool-preflight.md); report conflicts rather than silently changing the environment. Offline checks leave connection validity unverified.

Remembering a preference is not permission to edit `.git/config`, global Git configuration, shell profiles, credential stores or harness settings. If a project-specific native change is needed, present the exact proposed local change for separate agreement and follow the tool's supported procedure. Do not change shared/global settings automatically. Follow the [doctor specification](environment-check.md) for current connection evidence, and its separate report retention rules.

## Coordination preferences

Apply the [coordination contract](project-coordination.md) manually; no loader or interactive collector is implemented. Add these fields under `commonPreferences.coordination` in the existing private copy, preserving other choices:

```json
{
  "recordKind": "markdown",
  "recordLocation": "./coordination",
  "planningDocument": null
}
```

The synthetic template starts with `recordKind: "ask"` and null references. At project intake, ask one question for the task-record kind: `markdown`, `github-issue`, `gitlab-issue` or `jira`. After the user explicitly expresses no preference, record `markdown`; silence is unresolved. Then resolve the location one focused question at a time. `recordLocation` is a project-relative folder for Markdown or an agreed repository/project reference for external tickets, never a credential-bearing URL. Resolve relative folders from the project root. Each task gets its own canonical file/issue/ticket reference in its task record and assignments. Do not overwrite the preference with the most recent task's issue URL.

`planningDocument` is an optional Google Doc reference or `null` when none is needed. Ask for it only when planning calls for a document. The plan and current task record link to each other; the task record remains authoritative for accepted decisions, progress and acceptance. Keep real private document links and project targets only in the ignored configuration and the approved project records, never in public examples.

Reuse the settled kind/location without asking again. Ask when missing, conflicting, or the user requests a change. Read the latest private copy, update only agreed fields and preserve concurrent edits and unrelated preferences. Remembered location is neither current connection evidence nor external-write permission. Missing access preserves the choice: report a blocker and retain a clearly labelled pending local draft rather than switching the canonical source silently. Reconcile the draft with the latest canonical record once permitted access returns.

Manual contract scenarios for T06: unresolved kind asks once; explicit no preference selects Markdown; a later session reuses the selected folder; a new task gets a distinct record; GitHub/GitLab/Jira selection retains its project reference; optional planning is linked without duplicating status; inaccessible external target leaves a pending draft and blocker; concurrent edits are preserved or explicitly reconciled. These are expected outcomes, not executed service-integration results. Actual T06 checks belong to its [execution record](../examples/project-coordination/run.md).

## Acceptance and evidence

Security-privacy owns credential-reference boundaries, private retention and target selection. Software-engineer owns the example structure, relationship to setup records and checks that the local copy is excluded. This deliverable is implementation self-review, not evidence of independent agent participation.

| Scenario | Required result |
| --- | --- |
| New project, no preferences | Ask one unresolved question at a time; create only a reviewed private copy |
| Existing Git identity/authentication selected | Record `existing` separately for each; leave native configuration unchanged |
| Project-specific preference selected | Record `project` and agreed non-secret fields locally; native edits need separate agreement |
| Later session, settled choices | Reuse them without asking; verify current evidence only as needed for the requested operation |
| Different project | Use that project's own choices; do not inherit another project's answers |
| Plan disagreement, source override or account mismatch | Ask about the specific conflict; no automatic merge, host/account switch or credential changes |
| Offline or failed connectivity | Preserve preferences; sign-in validity remains unverified |
| Existing/malformed file, unknown version or concurrent edit | Preserve contents; resolve ambiguity before saving |
| Ignored synthetic copy and setup rerun | Git excludes the copy; setup leaves it unchanged |
| Secret value or tracked private file found | Stop publication; report path/type without values and resolve before publishing |

Acceptance requires parseable synthetic JSON covering project paths, hosts, account and credential-source references; project-only storage; ask-once independent common preferences; verified ignore behavior; preservation across setup reruns; current links/indexes and public-content review. No live credentials or sign-in are needed.

Remaining work: executable loading/validation, interactive preference collection and applying agreed native-tool changes are outside this example-and-guidance scope. General validation remains T04.

Verification record (2026-11-09): the synthetic JSON parsed and its required references and independent initial Git choices passed inspection. A disposable Git project confirmed the copy was ignored and untracked, initial setup preserved it, remembered choices survived an unchanged rerun, and native Git configuration remained byte-for-byte unchanged. All ten contract scenarios above were manually reviewed. `npm run test:setup` passed all 17 checks; `npm run check` and local Markdown link checks passed. Public-content self-review found only fictional targets and credential-source names. No live authentication or interactive collector was tested.

## Research

Reviewed 2026-11-09 against official references: [Git configuration scopes](https://git-scm.com/docs/git-config) support keeping native shared/local configuration separate from this preference record; [Git ignore rules](https://git-scm.com/docs/gitignore) explain why already tracked files need separate handling; [Git credential helpers](https://git-scm.com/docs/gitcredentials) support references to secure native storage; [GitHub CLI environment precedence](https://cli.github.com/manual/gh_help_environment) explains why remembered intent cannot guarantee the effective credential source.
