# Environment check: doctor report specification

Status: Draft. T02 defines a report contract, a reusable template and synthetic acceptance scenarios. There is no `doctor` executable or npm command. Live sign-in and harness compatibility have not been tested by this specification review.

## Agreed scope

Produce a human-readable report that answers: which selected tools and Construct resources are available, what permission evidence exists, and whether the selected service identity can sign in now? Use the [report template](../templates/doctor-report.md). A person or an agent can collect the evidence using [tool preflight](tool-preflight.md); this document does not implement collection.

Live verification is a required part of a requested live report, limited to sign-in. It checks connectivity and authenticated identity for the selected host/account using an existing connection. Repository read/write access, scope sufficiency and publication permission remain unverified. Offline reports remain useful but must say that live sign-in was not checked. Public documentation research is separate from testing a user's connection.

Release-operations owns the tool inventory, adapter discovery, local permission evidence and operational next steps. Security-privacy owns target/identity selection, authentication method/source, safe live-check selection and report sanitization. The collector records both responsibilities and discloses self-review if one person or agent covers them; a role assignment is not evidence of an independent review or live squad execution.

This task does not define private configuration storage, implement a general validation runner, change installations or credentials, or verify cross-agent communication. Those workflows remain outside T02.

## Intake and collection order

1. Record the intended project/global scope, selected harnesses, selected services and expected host/account references. Reuse agreed setup choices from a locally reviewed `.construct-setup/plan.json` when available, but treat it as input, not authentication evidence. Ask only for missing choices, one focused question at a time. Without saved choices, the report can still describe the user's selected targets.
2. Inventory required tools and their installed versions using documented local help/version commands. Establish safe command behavior before execution, including disabling documented update checks or telemetry where needed for offline collection. Do not run a tool whose local behavior cannot be established; record `unknown` and continue independent checks.
3. Inspect selected resource paths and permission metadata. Read only the fields needed for the report, not whole private directories, logs or credential stores. Separate source adapter consistency, installed resources and runtime discovery.
4. Establish the effective authentication method/source for each selected target from safe metadata and version-specific precedence. An environment variable's presence is not proof of its validity or account identity. If the host, account or method is missing or ambiguous, ask before dependent service checks; do not switch accounts automatically.
5. For a live report, run a documented, read-only sign-in check for the agreed host/account, with a 20-second timeout per check and no automatic retries. An assignment authorizing live sign-in checks supplies permission; do not ask again for the same settled target. For offline reports, or when live access is not authorized, make no service requests and report validity as `unverified`.

Each service is independent. A missing CLI, denied network request or unclear identity blocks that service's dependent check without preventing other local checks. If a check cannot enforce the time limit or avoid credential changes, leave it unverified and offer a supported alternative. Do not fall back to another host, identity, connector or transport without agreement.

## Report fields and states

The header records contract version `1`, observation date/time with timezone, Construct revision, installed snapshot ID if known, selected project/global scope, harnesses and services, requested mode (`live` or `offline`), and collector/review responsibility. Use logical path/host/account references in shareable output. Record `unknown` explicitly when a value is not safely observable.

Every check row contains a stable ID, subject, whether it is required for the selected workflow, state, sanitized observation and evidence source, and one actionable next step. Tool observations include the version; permission observations include the resource and operation; live observations include their own time, target reference and credential-source reference. Evidence distinguishes local metadata, runtime observation, live result and synthetic fixture. A report never treats a synthetic fixture as a live observation.

| Row state | Meaning |
| --- | --- |
| `pass` | The stated check succeeded with evidence; says nothing about other checks |
| `attention` | A nonblocking limitation or follow-up is known |
| `blocked` | A known unmet prerequisite, target mismatch or rejected sign-in prevents the selected check/workflow |
| `unknown` | The check was attempted or metadata inspected, but its result could not be established |
| `not-checked` | Applicable, but not attempted; give the reason |
| `not-applicable` | Not needed for the selected workflow; give the reason |

The summary lists blockers, unknowns and next steps, then states exactly what was verified. A requested live report is incomplete if any required sign-in check is blocked, unknown or not checked; it may still return useful partial results. An offline report can be complete as an offline inventory while all live validity remains unverified. Never use a single green result to claim the entire environment is ready. No process exit codes or JSON schema are promised by this document.

## Tool availability and adapter discovery

Inventory Node.js and Git for the current setup workflow (Node.js 22+ per [guided setup](guided-setup.md)), npm when using npm scripts, and each selected harness executable. Bash and `jq` are required for the selected Claude/Codex shell guard. Include `gh` or `glab` only when that service's chosen method uses that CLI; an available connector may be an agreed alternative. Custom services need their own supported tool contract. Report absent required tools as `blocked`, and unselected tools as `not-applicable`. An unknown compatibility range must remain unknown rather than recommending a guessed upgrade.

| Evidence layer | What to inspect | Limit of the result |
| --- | --- | --- |
| Source adapters | `npm run check` in the source checkout, when available | Generated consistency only; does not prove installation |
| Installed resources | The selected native paths from guided setup, including configuration-root overrides, resource readability and symlink resolution into the chosen snapshot | File presence only; report missing/broken links and conflicting targets |
| Harness discovery | Skills, agents and guard registration observed in the intended harness session, using that version's supported inspection mechanism | If not observed, use `not-checked`; do not launch a new trusted session or execute agents merely to get a green result |

Cover Claude's skills/agents/settings, OpenCode's skills/agents/commands/config, pi's package declaration/agents/guard extension, and Codex's `.agents/skills`, agents, rules and hooks. Use the [guided setup resource table](guided-setup.md#snapshots-and-installed-resources) for actual destinations. Existing installations may use other supported layouts: record the observed layout and evidence, not an automatic repair. pi's agent profiles do not prove its separate subagent extension is installed; Codex hook files do not prove hooks are enabled.

## Permission evidence

Record filesystem readability, directory traversal and reported writability of the selected destinations and snapshot. Use read-only metadata/access checks for the current user, noting ACL/sandbox uncertainty. Do not create probe files, change modes, request elevation or overwrite configuration as a diagnostic. A reported writable path is not a guarantee that a later write will succeed.

Record the selected harness's observable trust, sandbox, approval and guard settings separately from filesystem access. Note configuration precedence and unknown overrides. Shell-guard files without `jq`, a disabled hook or an unobserved runtime cannot receive an enforcement pass. Without an authorized runtime test, guard enforcement stays `not-checked`; T02 does not execute outbound actions to test it. A diagnostic can report that a setting is present without claiming the setting is enforced.

Remote repository permissions always say `not-checked (sign-in-only scope)`, even if a sign-in response incidentally mentions token scopes. Do not enumerate repositories, request broader scopes or attempt reads/writes to infer access.

## Authentication and live sign-in

For each selected service, record these separate observations:

| Field | Allowed observations |
| --- | --- |
| Expected target | Service, agreed host and expected account/workspace reference, or `unknown` |
| Effective connection | Observed host/account reference; target match `yes`, `no` or `unknown` |
| Configuration | `configured`, `not-configured` or `unknown`; absence requires evidence, not a failed network request |
| Method and source | Saved CLI login, environment credential, managed connector session or another documented method; record the source reference without its value; use `unknown` when opaque |
| Connectivity | `reachable`, `failed`, `unverified` or `unknown`, with a sanitized reason |
| Sign-in validity | `verified`, `rejected` or `unverified`, tied to the selected identity and observation time |
| Repository permissions | Always `not-checked` in this scope |

Offline configuration evidence yields `configured, validity unverified`, never `verified`. Git transport and forge API authentication remain separate: an SSH identity or successful Git fetch does not establish a `gh`, `glab` or connector sign-in. A connector listed as connected is configuration evidence unless its documented status actually verifies the current identity remotely. If it cannot reveal safe identity or method metadata, report that limit without inspecting its hidden credential store.

Before any live request, confirm the selected tool/version supports a check with no login, account switch, token refresh, credential-store update or other mutation. The documented `gh auth status --hostname <host>` and `glab auth status --hostname <host>` are candidates, not unconditional recipes. GitHub's current manual documents automatic token refresh and a `--no-refresh` option; use that option only when the installed help supports it. Otherwise establish that the chosen version does not refresh credentials or use another documented read-only identity check. If neither is established, leave validity unverified and explain why. Never use token-display flags, debug/HTTP tracing, verbose credential output or commands that print token values. Parse only the needed sanitized fields in memory; do not persist raw status output.

Interpret the selected account's structured result or documented status semantics, not the process exit code alone. Current GitHub documentation says JSON status output may exit zero despite authentication issues. Host-wide checks can include unrelated accounts; prefer a supported target-specific check and do not let unrelated account failures decide the selected identity's result. A successful response for a different account is a target mismatch, not verified sign-in for the intended account. Stop dependent actions and ask which account should be used.

A successful authenticated response identifying the expected account makes validity `verified` at that time. Explicit invalid/expired-credential evidence makes it `rejected`. A timeout, DNS/TLS failure, proxy denial, rate limit, ambiguous response or service outage leaves validity `unverified`; report the connectivity problem separately. A generic forbidden response alone does not prove a bad credential. Keep unknown evidence unknown; do not replace credentials to diagnose connectivity.

When authentication is absent or unclear, ask for the first unresolved choice, for example: “Which supported method should this service use: an existing CLI login, an environment credential, or an available connected integration?” Offer only methods supported by the selected tool/version. Ask for the host or account separately if still needed. Reuse settled answers. The user completes any sign-in through the service's secure flow outside the report; the report never requests secret values or launches login automatically.

## Privacy and retention

The working report is private and returned to the user; do not save it automatically. If the user explicitly chooses to save it, use their private destination. Use [project-private configuration](private-configuration.md) for remembered target preferences; diagnostic reports are separate and are not saved there automatically. Show actual host/account/path details privately only when needed to select or diagnose the connection. Use stable aliases in shareable summaries, and publish only independently written synthetic examples in Construct. Sanitizing names alone does not make real diagnostic context public-safe.

Exclude token values (including masked fragments), passwords, key material, credential-file contents, private URLs, internal architecture, real account names, raw stdout/stderr and environment dumps from public files, logs, fixtures and commit metadata. Environment credential names and fictional source references are sufficient. If unexpected output contains sensitive material, withhold it and report only the check ID and problem type. Never attach the raw output as evidence.

## Synthetic acceptance review

These are specification walkthroughs, not runnable tests or real connection results. Review each input against the required report behavior. The reusable template includes both a live sign-in example and an offline example.

| ID | Synthetic input | Required result |
| --- | --- | --- |
| S01 | Required CLI missing | `blocked`; dependent check not attempted; offer supported alternative or installation instructions without installing |
| S02 | Tool present with unknown compatibility | Record observed version; compatibility `unknown`, not a guessed pass or upgrade |
| S03 | Source consistency passes, native resources absent | Source row `pass`; installation `blocked`; runtime discovery not claimed |
| S04 | Resource link broken or points at a different snapshot | Record resource/target mismatch; no link replacement or deletion |
| S05 | Files installed; no harness session observation | Installation evidence only; discovery and guard enforcement `not-checked` |
| S06 | Permission metadata denied or sandbox ambiguous | Specific operation `blocked` or `unknown` as evidenced; no write/elevation probe |
| S07 | Hook configured but disabled, or shell guard lacks jq | Report unmet activation prerequisite; do not claim enforcement |
| S08 | Saved/environment credential configured; offline mode | Configuration `configured`, connectivity and sign-in `unverified`; no request |
| S09 | No safe local identity metadata | Account `unknown`; ask for intended account/method rather than assume authentication absent |
| S10 | Several accounts or environment credential overrides saved login | Apply documented version-specific precedence; record effective source; ask if target match unclear; no switch |
| S11 | Git SSH configured but no forge API connection | Report independently; Git success cannot verify forge API sign-in |
| S12 | Expected host/account returns authenticated success | Connectivity `reachable`, sign-in `verified` with time/source; repository permissions still `not-checked` |
| S13 | Authenticated response identifies another account | Target mismatch `blocked`; intended sign-in remains `unverified`; ask which account to use |
| S14 | Explicit invalid/expired credential response | Sign-in `rejected`, row `blocked`; ask for supported method, not secrets; no login/refresh |
| S15 | Timeout, DNS failure, proxy denial, rate limit or service outage | Connectivity problem recorded, validity `unverified`; partial live report; no credential diagnosis or automatic retry |
| S16 | Status returns zero with structured authentication failure | Use the selected account's result, not exit zero; do not report verified |
| S17 | Status may refresh credentials; safe suppression unsupported/unknown | Skip unsafe check; validity `unverified`; propose documented alternative |
| S18 | Connector hides method or offers only cached connected state | Record method `unknown` or cached configuration; live validity remains `unverified` unless fresh identity evidence exists |
| S19 | Authentication missing; supported method selected later | Ask one focused question at a time; after user secure setup, repeat target/status checks within existing authorization |
| S20 | Diagnostic output contains private identity or secret material | Withhold raw output; summarize by check ID/type; no automatic saving or publication |

T02 acceptance requires coverage of all five report concerns (tools, adapters, permissions, authentication and next questions), explicit live sign-in-only and offline behavior, a usable report template, scenario-by-scenario review, valid local links, current indexes and public-content review. Completing this specification does not establish that a future collector works.

Verification record (2026-11-09): manual contract walkthroughs S01 through S20 passed, including the live and offline template examples; required report fields, failure distinctions, one-question-at-a-time flow and privacy limits are covered. Local Markdown links/anchors and fenced blocks passed inspection, as did `npm run check` (68 files, 65 links). Public-content review found only independently written generic guidance, official public references and fictional examples. This is implementation self-review of a specification, not independent agent acceptance or live connection evidence.

Remaining implementation work is a collector/command and execution against live harnesses/services; neither is part of this agreed specification deliverable. T03 private configuration and T04 general validation remain separate unchecked tasks.

## Research and decisions

Reviewed 2026-11-09. References inform the contract; installed help and supported behavior must be rechecked when collecting a real report.

| Primary source | Decision for Construct |
| --- | --- |
| [npm doctor](https://docs.npmjs.com/cli/v11/commands/npm-doctor/) | Group tool, permission and connection checks separately; do not run npm doctor as a shortcut because it includes network checks |
| [GitHub authentication status](https://cli.github.com/manual/gh_auth_status) | Treat status as live verification, guard against automatic refresh and interpret account results rather than exit code alone |
| [GitHub CLI environment](https://cli.github.com/manual/gh_help_environment) | Record the effective source using documented credential precedence; suppress update notifications when needed for offline checks |
| [GitLab authentication status](https://docs.gitlab.com/cli/auth/status/) | Target the agreed hostname explicitly using supported flags; do not probe every configured host or display tokens |

The local research environment's GitHub CLI 2.46.0 help lacks newer JSON and no-refresh options. No GitLab CLI was available. These observations justify version checks; they do not establish live authentication or compatibility across installations.
