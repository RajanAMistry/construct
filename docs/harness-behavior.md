# Harness behavior and verification

Status: Draft. T07 is incomplete. This report separates upstream source evidence, local CLI observations and unrun behavior checks. Generated adapters do not prove runtime support.

## Scope and observed environment

Initial inspection on 2026-11-10 against Construct `04d984a`. Scope: agent invocation, peer messaging, shared state, tool access and permissions for Claude Code, OpenCode, pi and Codex. That inspection made no installations, credential changes, provider calls or live external tracker writes. Review is self-review. No independent release-operations or QA run was performed.

`command -v` found only Codex. `codex --version` returned `codex-cli 0.167.0-alpha.4`. Local `codex --help`, `codex exec --help`, `codex agents --help` and `codex features --help` succeeded, with a read-only-filesystem warning about PATH aliases. Help confirms CLI options, not working model access or adapter discovery. Claude Code, OpenCode and pi were absent from PATH; their installed versions and authentication are unknown. No login was started.

The managed session exposes delegation/messaging tools and a shared workspace in its tool contracts. These tools were not invoked for this inspection. Their presence does not establish that the installed Codex CLI discovers Construct profiles or provides the same transport. T06's [executed workflow](../examples/project-coordination/run.md) is prior evidence for that session, not a compatibility test of all four harnesses.

The VM follow-up on 2026-11-10 against `4f0d85a` prioritized Codex and OpenCode. An authorized, isolated OpenCode installation reported `opencode v2.2.6`; the official `@opencode/cli` latest tag and upstream `v2.2.6` tag agreed at inspection time. OpenCode v1's older `opencode-ai` package is not the v2 installation target. No global installation, credentials or canonical adapters were changed. Model-backed tests were deferred for local execution after the VM sign-in/model endpoints returned proxy 403 responses and Codex initialization failed on read-only runtime storage. No model response or successful sign-in is claimed.

## Capability matrix

**Source** means the cited upstream text or code describes the behavior; **local** means observed CLI output. Neither is a live behavior pass. **Unknown** is not unsupported.

| Harness / evidence | Agent invocation | Peer messaging | Shared state | Tool access | Permissions and limits |
| --- | --- | --- | --- | --- | --- |
| Claude Code / source changelog only; CLI absent | Changelog refers to subagents and teams; Construct supplies canonical agent profiles. Discovery/invocation unrun. | Changelog describes `SendMessage` and team fixes. Availability, routing and acknowledgment unrun. | Team task-list persistence fixes are documented; consistency and single-writer behavior unrun. | Construct frontmatter lists tools. Actual tool availability and inheritance unrun. | Changelog describes permission behavior in subagents/teammates. Enforcement of Construct profiles/hooks unrun; read-only prose is insufficient. |
| OpenCode / v2.2.6 source and VM configuration loading | `debug agents --standalone` discovered all 16 Construct profiles, including planner/reviewer. Actual assignment invocation and return are unrun. V2 documents foreground/background child sessions. | No peer mailbox verified. Use lead relay until a direct route is observed. | No canonical shared task register, locking or stale-baseline handling verified. | V2 actions include `read`, `edit`, `shell` and `subagent`. Loaded profiles expose the expected mode and permission rules; actual tool use is unrun. | V2 uses plural `permissions` with action/resource/effect arrays and last-match precedence, matching Construct. Reviewer edit denial and push ask rules load; actual denial/prompt behavior, including shell writes, is unrun. |
| pi / source example extension; CLI absent | Example extension launches separate pi processes; single, parallel and chain modes are documented. It must be installed/trusted separately. | Example returns results to the caller and supports chain handoff; no peer mailbox established by this source. Use lead relay. | Isolated context windows; task cwd and supplied inputs determine context. No shared register service established. | Example agent `tools` selects tools. Construct drops unmapped tools, including WebFetch, from pi profiles. Confirm substitutes before accepting assignments. | Project agent trust/confirmation is documented. Tool omission does not prove OS isolation; allowing `bash` can still permit writes. Test negative cases. |
| Codex / source, local CLI help and blocked VM preflight | Upstream collaboration handler implements spawn/resume/wait; local `agents` is a session command center, not proof of profile activation. CLI initialization failed before the acknowledgment request could run. | Upstream handler exports send-input support. Exact session routing and peer delivery unrun. | Source describes inherited cwd/config; no automatic canonical task register established. Use one approved record. | Source describes runtime inheritance and optional role config layers. Actual exposed tools and role loading unrun. | Local help exposes sandbox and approval options; source describes inheritance. Construct emits `sandbox_mode = "read-only"` for reviewers. Actual denial and hook activation unrun. |

The initial OpenCode discrepancy came from comparing v1 documentation with a v2 adapter. Version-pinned v2 source and runtime loading resolve the format question without a generator migration. Loading rules does not verify their enforcement. Likewise, do not infer Codex CLI behavior from managed-session tool names.

## VM checks and local handoff

OpenCode's wrapper installation initially failed to locate its optional executable. Installing the official Linux x64 platform package `@opencode/cli-linux-x64@2.2.6` in a temporary directory succeeded. Temporary XDG config/data/state/cache directories kept runtime files outside existing installations. With `OPENCODE_CONFIG_DIR` pointing to Construct's `adapters/opencode`, `OPENCODE_DISABLE_MODELS_FETCH=1` and `OPENCODE_DISABLE_AUTOUPDATE=1`, the following checks ran in a disposable project:

| Command/check | Observed result | Limit |
| --- | --- | --- |
| `opencode --version` | `opencode v2.2.6` | Exact tested release, not a promise about future latest versions |
| `opencode debug config --standalone` | Loaded the adapter's `opencode.json` and directory | Configuration discovery only |
| `opencode debug agents --standalone` | All 16 canonical profiles discovered; no missing IDs; planner, reviewer, delivery-lead and software-engineer had `subagent` mode | No specialist received an assignment |
| Inspect resolved reviewer/global rules | Reviewer `edit/*` denial and `shell/git push*` ask rules present | No write or outbound operation attempted; not an enforcement pass |
| `opencode auth list --format json --standalone` | Empty connection list in the isolated VM runtime | Local metadata, not a remote sign-in test |

For a local rerun, use an existing authorized OpenCode v2 installation in a disposable project. Set `OPENCODE_CONFIG_DIR` to the absolute Construct `adapters/opencode` path, then run the discovery commands above. Recheck `opencode --version` and the current upstream release before testing a newer version; pin the observed version in evidence rather than relying on a moving `latest` label. Inspect resolved rule order and compare discovered IDs against canonical `agents/*.md`, excluding `README.md` and `learning_checklist.md`. Keep raw configuration/session output private.

Codex `0.167.0-alpha.4` reported existing ChatGPT sign-in metadata. A bounded `codex exec --ephemeral --json --skip-git-repo-check --sandbox read-only` acknowledgment preflight in the disposable project failed while initializing its in-process app-server. Redirecting documented SQLite/log locations into temporary directories did not fix the failure. A file-operation trace located a refused runtime `installation_id` creation under the read-only Codex home; a scoped per-command filesystem grant did not resolve it. No credentials or installed executables were changed to work around the blocker. This is an environment initialization failure, not evidence against Construct profile support or provider validity.

Read-only HTTP probes to `auth.openai.com` and `chatgpt.com` received proxy 403 responses. No OAuth flow was started and no account tokens were copied from Codex into OpenCode. Live OpenAI/ChatGPT authentication and model-backed checks are deferred to the local environment using its supported sign-in flow and existing connections under [tool preflight](tool-preflight.md). Before H1–H6, resolve the local runtime storage/access, confirm the exact installed versions and active adapter, and use only synthetic inputs. Follow the acceptance table below; profile discovery alone does not close T07. Desktop-app integration was not tested.

## Codex-first follow-up (2026-11-14, Asia/Kolkata)

The agreed follow-up scope was Codex H1–H5 in a disposable project, using the existing installation and authentication. Construct baseline: `70674e9`. This was a new execution attempt, not a rerun of the four-harness acceptance suite.

Local inspection found Codex `0.167.0-alpha.4`; Claude Code, OpenCode and pi were absent from PATH. `codex login status` reported existing ChatGPT sign-in metadata. This does not verify model access. The checkout had no project-local `.codex` directory, so the generated profiles were not activated there by that discovery path. The adapter directory alone does not establish activation through another configuration source.

A disposable project was prepared outside the repository with copies of the generated planner/reviewer TOML profiles in `.codex/agents/` and a synthetic `scratch/brief.md` identifying baseline `sample-r1`. No credentials were copied, configuration stores edited or installations changed. A bounded preflight used the installed CLI:

```bash
codex exec --ephemeral --json --skip-git-repo-check \
  --sandbox read-only -C <disposable-project> \
  'Read scratch/brief.md and return only ACK sample-r1. Do not invoke tools other than reading the brief. Do not write files or contact external services beyond the configured model.'
```

The command exited 1 before the 45-second limit, with zero stdout bytes and `failed to initialize in-process app-server client: Read-only file system (os error 30)`. It also warned that PATH aliases could not be created. Profile discovery, a model response and a specialist acknowledgment were not observed. The test stopped at initialization rather than repeating the previously unsuccessful storage overrides or changing the existing runtime.

| Check | Follow-up result | Remaining execution |
| --- | --- | --- |
| H1 | Blocked before invocation; placing profiles is not discovery evidence | On a working authorized runtime, observe planner/reviewer discovery, then exact-baseline acknowledgment and return |
| H2 | Not run; dependent on H1 | Deliver a synthetic question, answer and acknowledgment directly if available, otherwise through the lead |
| H3 | Not run; dependent on H1 | Exercise lead-only register updates, a stale worker baseline, disjoint integration and interruption recovery |
| H4 | Not run; read-only CLI option is not enforcement evidence | Observe effective tools and separately test harmless reviewer and shell-write negatives against disposable sentinel files |
| H5 | Not run; dependent on H1 | Exercise a missing tool and failed handoff, one rework, escalation and stopping before the next task |

Next owner: release-operations establishes a working Codex runtime without changing existing credentials; QA then observes H1–H5 against the exact version and candidate. Use the already documented acceptance table, preserve raw logs outside Construct and obtain independent QA. This follow-up is self-review only. T07 remains incomplete, and the other three harnesses remain outside this follow-up scope.

## Coordinator-mediated handoff

Use the existing [coordination contract](project-coordination.md), [assignment](../templates/agent-assignment.md) and [register](../templates/task-register.md). Delivery-lead remains the sole register writer. Native messaging is optional; acknowledgment and traceable decisions are required.

1. Record the exact harness version, active adapter/config, observed tools, permissions, approved workspace and communication route. If invocation is unavailable, block or agree a human-mediated handoff; never invent a successful specialist run.
2. Dispatch a self-contained assignment with ID, baseline, accessible inputs, criteria, exclusions, allowed writes, dependencies and budget. The recipient acknowledges these before work. Serialize shared-file writes.
3. Relay a consultation as `assignment / revision / sender / recipient / question or finding / evidence / requested answer / blocker`. Preserve the recipient's actual response and acknowledgment. Return only relevant public or synthetic content to Construct.
4. Record the decision owner, resulting action and integration revision in the canonical register. Obtain a handoff with changed paths, criteria, actual checks, limitations and next action. Rerun affected gates on the integrated candidate; stale or missing responses stay blocked.
5. Stop on an exhausted budget, missing access, contradictory evidence or a scope change. Default to one initial attempt plus one focused rework, then escalate. Stop at the current task boundary; no new messaging service, polling loop or next backlog task is implied.

Synthetic relay example (procedure illustration, not an executed exchange):

```text
Lead -> QA: H1 / sample-r1 / verify no writes outside scratch/;
inputs scratch/brief.md; read-only assignment; one attempt + one rework.
QA -> Lead: acknowledged H1/sample-r1, boundary and checks;
question to Operations: does scratch/cleanup.md preserve the input fixture?
Lead -> Operations: relay H1/sample-r1, question above, read-only inspection.
Operations -> Lead: acknowledged; proposed cleanup removes fixture; block.
Lead -> QA: relay finding; keep H1 Blocked; implementer owns correction.
QA -> Lead: acknowledged; retest after integrated sample-r2, not before.
```

## Required live checks and remaining work

Run in an approved disposable project with synthetic inputs, using existing authentication after [tool preflight](tool-preflight.md). Record version/configuration, exact invocation, candidate, actual output summary, result, reviewer and independence. Keep raw session logs and credentials outside public Construct. Do not execute destructive or outbound operations to test a guard; use harmless fixtures and intercepted requests.

| Check | Observable acceptance | Current result / next owner |
| --- | --- | --- |
| H1: discovery and invocation, each harness | Planner/reviewer profiles discovered; correct bounded specialist receives and acknowledges exact baseline and inputs; returns a result to lead. | Partial: OpenCode v2.2.6 discovered all 16 profiles. Actual assignment/acknowledgment/return unrun; Codex blocked at initialization; Claude Code/pi pending. Release-operations establishes runtimes; QA observes. |
| H2: communication, each harness | Test direct delivery only when exposed. Otherwise actually relay a question, answer and acknowledgment through lead. Record route and missing native capabilities. | Not run. Lead coordinates; QA verifies no invented responses. |
| H3: state and concurrency, each harness | One lead-written register; worker cannot silently overwrite a stale baseline; disjoint work integrates before dependent dispatch; interruption resumes from recorded state. | Not run. Lead/integration owner supplies fixture; QA checks state transitions. |
| H4: tools and permission negatives, each harness | Required tools observed; harmless write outside assigned scratch area refused by the applicable sandbox/guard, or documented as instruction-only with serial fallback. Reviewer/tool/guard restrictions checked separately, including shell writes. | Not run. Release-operations records effective controls; QA checks observed denial, not just intent. |
| H5: failure and stop, each harness | Missing tool and failed handoff remain blocked; one focused rework maximum before escalation; no unauthorized side effect or next task starts. | Not run. QA exercises synthetic failure; lead records outcome. |
| H6: OpenCode adapter compatibility | Choose exact target release; validate generated config against its schema and run discovery/permission checks. Correct canonical generator and regenerate only after target is established. | Partial: v2.2.6 runtime accepts current config/profiles and resolves expected rules; v2 source confirms the schema. Permission negatives and runtime invocation remain unrun. No generator change indicated by current evidence. |

T07 remains unchecked until the map and actual direct-or-relayed workflows have version-specific evidence for all four harnesses. A supported fallback can satisfy communication acceptance; an unavailable harness or unrun permission check cannot be counted as pass. Obtain independent QA where required; this report has only self-review. The VM follow-up changed only documentation in Construct; the temporary OpenCode runtime is not part of the repository or an adapter change. Live tests are deferred, not waived or passed.

## Research sources

Read the following public upstream files at pinned revisions. Except for OpenCode v2.2.6, whose release was installed for the VM follow-up, these are research snapshots rather than tested installed versions. Official documentation hosts were denied by the environment proxy, so source documentation/changelog was used; those network failures say nothing about harness authentication.

- Claude Code [changelog at 6e1e44f](https://github.com/anthropics/claude-code/blob/6e1e44f6433bfa17d198e932bff53373aa229eea/CHANGELOG.md): `SendMessage`, team task-list persistence and subagent/teammate permission entries. Changelog alone is insufficient to establish full contracts.
- OpenCode v2.2.6 at `dc2ffcf8bf26f9e669b6aa22b95f50e12be15e06`: [installation/package](https://github.com/anomalyco/opencode/blob/dc2ffcf8bf26f9e669b6aa22b95f50e12be15e06/README.md), [agents](https://github.com/anomalyco/opencode/blob/dc2ffcf8bf26f9e669b6aa22b95f50e12be15e06/services/site/src/docs/content/agents.mdx), [permissions](https://github.com/anomalyco/opencode/blob/dc2ffcf8bf26f9e669b6aa22b95f50e12be15e06/services/site/src/docs/content/permissions.mdx), [configuration discovery](https://github.com/anomalyco/opencode/blob/dc2ffcf8bf26f9e669b6aa22b95f50e12be15e06/packages/core/src/config/discovery.ts) and [OpenAI OAuth](https://github.com/anomalyco/opencode/blob/dc2ffcf8bf26f9e669b6aa22b95f50e12be15e06/packages/core/src/plugin/provider/openai.ts). These replace the initial v1 documentation comparison for the v2 target; source descriptions remain separate from VM observations.
- pi [subagent example](https://github.com/badlogic/pi-mono/blob/602b8d1cb98035d52c4c360d0d95c65503b989ae/packages/coding-agent/examples/extensions/subagent/README.md): isolated processes, extension setup, tool selection, trust, modes and failure behavior.
- Codex [collaboration handler](https://github.com/openai/codex/blob/d15bf1deb77e0b43dd73ee7dbf7fd6487e6c5837/codex-rs/core/src/tools/handlers/multi_agents.rs): spawn/resume/send-input/wait exports and runtime/config inheritance. Installed alpha CLI may differ from this upstream revision.

Local source inspection: `scripts/build-adapters.mjs`, canonical role frontmatter and generated OpenCode/Codex/pi profiles. No upstream text was copied into repository fixtures.

## Local verification record

`npm run check` passed (68 files, 65 links). All 17 existing setup tests passed outside the sandbox after its subprocess restriction caused `spawnSync git EPERM` inside it. These checks cover adapter consistency and existing setup behavior, not H1–H6. Changed-document relative file links and `git diff --check` passed. Complete proposed-file/staged-diff review and targeted secret scanning found no unresolved secrets or private information; that is self-review, not an independent audit.

VM follow-up verification (2026-11-10, Asia/Kolkata): `npm run check` passed again (68 files, 65 links), all 17 setup tests passed in the current command sandbox, and all 94 relative file links in the five changed documents resolved. Assertions against the captured OpenCode output confirmed all 16 canonical profile IDs, the four inspected profiles' subagent modes, reviewer edit denial and push ask rules. `git diff --check`, targeted credential-pattern/environment-value scanning and contextual public-content self-review found no unresolved findings. Raw runtime/configuration traces remain outside the repository. This evidence verifies the documentation's discovery claims and existing setup behavior; H1–H6 acceptance, independent QA and desktop-app behavior remain incomplete.
