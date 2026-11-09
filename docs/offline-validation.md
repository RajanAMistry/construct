# Offline validation specification

Status: Draft. T04 delivers this contract, a [JSON fixture catalog](../examples/offline-validation/fixtures.json) and a [report template](../templates/validation-report.md). There is no `validate` executable or npm script yet. Fixture expectations are specifications, not recorded test results.

## Agreed scope and ownership

Define repeatable offline validation of Construct's setup decisions, command/flag contracts, authentication-source selection, adapter generation and outbound guards. Use Markdown plus JSON. A required check that cannot run makes the run incomplete and nonzero; distinguish failures, unavailable prerequisites and optional skips.

QA-verifier owns requirement coverage, fixture expectations and acceptance evidence. Software-engineer implements the future runner and fixes defects. Release-operations supplies version/platform and adapter prerequisites; security-privacy reviews source selection, isolation and output sanitization. Technical-writer maintains this contract and report template. One person or agent covering several responsibilities must disclose self-review; role names alone do not establish independent review or agent coordination.

This deliverable does not implement the runner, doctor collector, private-configuration loader, live sign-in checks, harness activation or cross-agent communication. See [doctor](environment-check.md), [private configuration](private-configuration.md) and [tool preflight](tool-preflight.md) for their separate contracts. Completing T04's specification does not complete those implementations.

## Future command contract

The proposed entry points are `node scripts/validate.mjs` and `npm run validate`. They are reserved names, not working commands. The first implementation must document and test both before advertising them as available.

| Invocation | Required behavior |
| --- | --- |
| No arguments | Run every required case in all five coverage areas, plus report/isolation checks; print one summary and exit using the rules below |
| `--help` or `-h`, alone | Describe scope, prerequisites, states, exits and offline limits; exit 0 without running cases or creating files |
| Any other argument or combination | Sanitized usage error and exit 2, before cases or writes; never echo an untrusted argument |

No live mode, automatic repairs, login flows, installation, watch mode, network fallback or partial category selection belongs to this version. Pre/post npm hooks and update notices must not add side effects. A future npm wrapper must suppress those using supported npm options and verify the behavior; a direct Node entry point avoids relying on npm for isolation.

The runner reports Node, Git, Bash and jq versions where required. Use Node.js 22+ and Linux/macOS as the existing setup baseline. Missing required tools block dependent cases, without stopping independent checks. A compatible version is evidence-based; an unrecognized command contract is blocked pending review, not guessed from a version number.

## Offline execution boundary

1. Build every case in a new disposable root, with synthetic home/config directories, an allowlisted environment and explicit tool paths. Never read the user's configuration, token variables, credential stores, SSH agent or private folders. Remove inherited authentication, proxy, Git override and executable-injection settings from child environments; do not change the parent environment or user's settings. Use fictional hosts/accounts and presence booleans, never real credentials or secret-shaped samples.
2. Treat fixture data as inert input. Invoke only reviewed runner operations with argument arrays. Guard command strings are payloads to the hook or matcher, never shell commands to execute. Fake CLIs accept only declared arguments and return canned help/version/status metadata; unexpected invocation fails the case. No real `gh`/`glab` status, credential helper, SSH connection, harness session or package installer runs.
3. Disable outbound networking for the runner and descendants in a verified sandbox/CI execution boundary. Proxies, npm offline settings, test-process isolation and fake CLIs alone do not prove that arbitrary subprocesses cannot connect. Record the enforcement mechanism. If denial cannot be established, mark the isolation prerequisite blocked and do not execute cases that could escape it; never label the full run passed. A deliberately unexpected network request is intercepted/denied locally and fails its case, without contacting a real service.
4. Run real setup and adapter tooling only in disposable copies. Local Git fixtures disable external hooks, global/system config and credential helpers and use explicit local repositories without remotes. Copy only reviewed tracked public resources and preserve symlinks. Build/check negative controls never edit the source checkout. Check source status before/after; preserve pre-existing user edits. Write only inside the disposable root, then clean up that root; never follow a redirected cleanup target.
5. Give each case a 20-second timeout, no retries, and terminate/reap its child process tree on timeout. The runner records a failed case if a started check times out, crashes or produces unexpected output. Keep controlled fake calls and before/after filesystem evidence; do not emit raw subprocess output. Missing tools detected before starting are blocked instead. Cleanup failure fails the run and reports a logical artifact reference for private recovery, not an arbitrary host path.

These are requirements for the future runner. The existing setup tests use temporary directories but do not establish this complete isolation boundary. Public documentation research during authoring is separate from an offline validation run.

## Results and completion

Each case row records ID, category, required flag, state, expected/observed sanitized decision, evidence kind, and one next action or `none`. Evidence kinds are `specification-review` or `executed-synthetic`; neither proves live sign-in, installed discovery or harness enforcement. A real connection result is outside this contract.

| Case state | Meaning |
| --- | --- |
| `pass` | Executed case matched its expected observable outcome and side-effect limits |
| `fail` | Executed case differed, timed out, crashed, violated isolation or failed cleanup |
| `blocked` | A prerequisite or supported contract was unavailable before execution |
| `not-run` | Selected case never started, including interrupted runs |
| `skipped` | Optional case explicitly omitted with a reason; required cases cannot use this state |

An expected refusal is a passing case when observed correctly. For example, a synthetic missing-jq scenario can pass by matching the shell hook's empty output and the diagnostic's blocked decision. If jq is actually missing from the validation environment, cases needing the real hook are blocked, so the required suite is incomplete. Do not use a fake jq to claim the real shell hook was tested.

| Overall result | Exit | Rule, in precedence order |
| --- | --- | --- |
| `failed` | 1 | Any executed case fails, including optional cases that were run |
| `incomplete` | 2 | No failure, but any required case is blocked/not-run, the catalog/arguments are invalid, isolation is unavailable or a category lacks required coverage |
| `passed` | 0 | Every required case passes; optional skips/blocks are listed and cannot imply those checks passed |

All required catalog cases must be selected by default. Silence, zero collected cases, removing a required category or waiving a required case cannot produce success. On interruption, terminate descendants and clean up; report incomplete when possible, with no success claim if the process cannot emit a report. Case `skipped` is invalid for required cases and produces incomplete. Failures take precedence over incompleteness; report both counts.

Repeatability means identical fixture/catalog/source versions and prerequisites produce the same ordered IDs, decisions, states and exit classification. Timing and temporary names may differ and are excluded from comparisons. Record revision (and dirty-source status), catalog version, environment/tool versions, isolation mechanism, counts and self-review disclosure. Do not save reports automatically. The template is human-readable; machine-readable run output is not promised in this version.

## Fixture format

The catalog is UTF-8 JSON with exactly `version`, `synthetic`, `cases`; version is integer `1`, synthetic is `true`, cases is a nonempty ordered array. Each case has exactly `id`, `category`, `required`, `basis`, `input`, `expected`. IDs are unique and stable. Categories are `setup`, `command`, `authentication`, `adapter`, `guard`, `report`, `isolation`. `required` is boolean. `basis` is `existing-behavior` or `proposed-contract`; the latter must not be reported as tested against an implementation that does not exist. Input/expected are nonempty objects whose typed fields define the specific case; missing or unexpected fields require catalog review before execution, not guessed defaults.

Expected objects describe observable decisions, not execution results. They never prepopulate a case's `pass` state. The independent check must derive an actual result and compare it with these literal expectations. Do not import the implementation's matcher or precedence table to generate expected values. The future runner must register an explicit per-case input/expected shape and reject unrecognized IDs or fields; adding cases requires a reviewed contract and runner update. JSON is never evaluated, sourced or used to select arbitrary executables/files.

Paths such as `project/config.json` in the catalog are logical fixture references under the disposable root. `EXAMPLE_FORGE_TOKEN` is a fictional source name, not a value. Canned help is tied to a fixture version; it does not prove that every installed CLI supports those flags. Unknown/malformed catalog versions, duplicate IDs, invalid types and missing required categories yield incomplete before running cases.

Report fixtures are unit scenarios for the future aggregator. Their `results` arrays contain the rows relevant to that scenario; `requiredCategoriesCovered: true` stands for a complete remaining roster of passing required cases. Expand that roster in a runner test. In a real run, derive coverage and isolation from observed evidence and the full catalog; never accept those fixture booleans as proof from a caller. `isolationVerified` in a report fixture is synthetic aggregation input, not an assertion about this authoring environment.

## Coverage and scenario review

The JSON contains concrete input and expected output for each ID below. Review every row against its requirement before automation. All listed cases are required. Each category must retain positive and refusal/error controls where applicable.

| Cases | Requirement and observable outcome |
| --- | --- |
| SETUP-01–05 | Consent refusal writes nothing; an identical rerun changes nothing; stale plans reject before writes; approved replacement preserves original backup; setup preserves private config |
| COMMAND-01–06 | Help creates nothing; setup/validation unknown flags use their distinct documented exits; supported canned host flag is selected; unsupported no-refresh flag is never invented and unsafe check is withheld; status-shaped data does not prove live validity |
| AUTH-01–06 | Versioned source precedence; unresolved account asks one question; host mismatch blocks; Git transport is separate from API auth; absent source asks for a supported method; opaque connector remains unknown |
| ADAPTER-01–03 | Clean generation/check is idempotent; changed generated file is detected without repair; broken generated symlink is detected |
| GUARD-01–10 | Read-only payload produces no decision; Claude push asks; Codex API mutation denies; read-only GitLab note list is ignored; missing jq never establishes enforcement; Codex prefix rule asks separately from hook; pi with no UI blocks, declined UI blocks and accepted UI returns control; OpenCode's generated push permission asks |
| REPORT-01–08 | Required blocked/not-run is incomplete; mismatch fails; optional skip allows required success; failure wins over blocked; zero required coverage and a required skip are incomplete; executed optional failure fails the run |
| ISOLATION-01–03 | Unexpected attempted network use fails locally; malformed catalog is rejected before execution; unavailable network isolation prevents unsafe execution and success |

Setup cases extend the existing [setup tests](../test/setup.test.mjs); they do not replace their 17 checks. Adapter checks use the real generator in a disposable complete copy, compare bytes/link targets before/after a second build, and introduce stale-file/link controls there. Guard cases pass literal strings to the real shell hook where relevant, inspect generated Codex/OpenCode rules, and use a local pi callback/UI stub without launching pi. No guarded payload is executed. Generated text inspection proves configuration consistency only, never runtime activation. The missing-jq case isolates PATH without invoking a real forge command.

The ten guard cases are representative controls, not a complete shell parser or proof that every spelling, wrapper, option order or obfuscated command is caught. Record bypasses as defects with minimal synthetic reproductions; do not broaden guard behavior silently under this specification task. OpenCode coverage in the future runner must compare its generated patterns/ordered permissions with the canonical list; its runtime permission matching remains unverified.

## Acceptance and remaining work

T04 specification acceptance requires the agreed scope, command/result/exit contract, isolation and privacy boundaries, all five coverage areas, a parseable versioned JSON catalog with unique IDs and typed input/expectations, scenario-by-scenario review, a usable report template, current indexes, working local links, existing checks and public-content review. Mark the task complete only for this specification scope, explicitly preserving the implementation remainder.

Remaining work: implement `scripts/validate.mjs`/npm wiring and strict fixture parsing, fake executables, network/process isolation, actual-versus-expected checks, timeouts/cleanup, deterministic report aggregation and negative controls. Run all catalog cases against that implementation, including failure/incomplete exit paths, then record revision-specific evidence. Doctor collection, private-config loading and live harness/service testing remain separate work. No runner or live effectiveness claim follows from reviewing this specification.

Verification record (2026-11-09): self-review walked all 41 catalog cases against the requirements and existing sources, including each negative result and the report template's distinction between review and execution. JSON parsing, duplicate-key/ID checks, ordered category coverage and top-level/record types passed. Local Markdown links and fenced blocks passed inspection. All 17 existing setup tests and adapter consistency checks passed. Targeted secret scanning and contextual public-content review found no unresolved findings. The scanner's match in `construct.md` was the unchanged existing exclusion policy, not imported private content. The 41 executable catalog cases remain `not-run`; no runner, network-isolation enforcement or live harness/service outcome was tested. This completes the specification acceptance only, with the implementation remainder above.

## Research and decisions

Reviewed 2026-11-09 using official documentation/source and installed help:

| Source | Decision |
| --- | --- |
| [Node.js 22 test runner](https://nodejs.org/docs/latest-v22.x/api/test.html) | Reuse built-in testing/mocks and process isolation; do not equate test-file isolation with blocked network or filesystem access |
| [npm 11.9.0 configuration definitions](https://github.com/npm/cli/blob/v11.9.0/workspaces/config/lib/definitions/definitions.js) | Offline install mode does not constrain arbitrary scripts; suppress update notices and verify lifecycle behavior separately |
| [GitHub CLI environment](https://cli.github.com/manual/gh_help_environment), checked with local `gh help environment` for 2.46.0 | Source precedence is version/host-specific; synthetic metadata identifies source presence without inspecting tokens or validating sign-in |

The direct npm/GitHub manual pages were unavailable during this research; npm's pinned official source and installed GitHub CLI help supplied the relevant evidence. These references inform design; the future suite itself must use only checked-in synthetic fixtures and no online documentation fetches.
