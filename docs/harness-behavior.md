# Harness behavior and verification

Status: Draft. T07 is incomplete. This report separates upstream source evidence, local CLI observations and unrun behavior checks. Generated adapters do not prove runtime support.

## Scope and observed environment

Inspected on 2026-11-10 against Construct `04d984a`. Scope: agent invocation, peer messaging, shared state, tool access and permissions for Claude Code, OpenCode, pi and Codex. No installations, credential changes, provider calls or live external tracker writes were made. Review is self-review. No independent release-operations or QA run was performed.

`command -v` found only Codex. `codex --version` returned `codex-cli 0.167.0-alpha.4`. Local `codex --help`, `codex exec --help`, `codex agents --help` and `codex features --help` succeeded, with a read-only-filesystem warning about PATH aliases. Help confirms CLI options, not working model access or adapter discovery. Claude Code, OpenCode and pi were absent from PATH; their installed versions and authentication are unknown. No login was started.

The managed session exposes delegation/messaging tools and a shared workspace in its tool contracts. These tools were not invoked for this inspection. Their presence does not establish that the installed Codex CLI discovers Construct profiles or provides the same transport. T06's [executed workflow](../examples/project-coordination/run.md) is prior evidence for that session, not a compatibility test of all four harnesses.

## Capability matrix

**Source** means the cited upstream text or code describes the behavior; **local** means observed CLI output. Neither is a live behavior pass. **Unknown** is not unsupported.

| Harness / evidence | Agent invocation | Peer messaging | Shared state | Tool access | Permissions and limits |
| --- | --- | --- | --- | --- | --- |
| Claude Code / source changelog only; CLI absent | Changelog refers to subagents and teams; Construct supplies canonical agent profiles. Discovery/invocation unrun. | Changelog describes `SendMessage` and team fixes. Availability, routing and acknowledgment unrun. | Team task-list persistence fixes are documented; consistency and single-writer behavior unrun. | Construct frontmatter lists tools. Actual tool availability and inheritance unrun. | Changelog describes permission behavior in subagents/teammates. Enforcement of Construct profiles/hooks unrun; read-only prose is insufficient. |
| OpenCode / source documentation; CLI absent | Primary agents invoke subagents; users can use `@` mentions; child sessions are documented. | The inspected pages do not establish peer-to-peer messaging. Use lead relay until verified. | Child-session navigation is documented; no canonical shared task register or locking verified. | Tool permissions include `read`, `edit`, `bash` and `task`; inspect actual enabled tools before dispatch. | Current source documents singular `permission`, tool-keyed rules and last-match precedence. Construct currently emits plural `permissions` with action/resource/effect arrays: compatibility is unresolved. Do not rely on its generated guard until validated. |
| pi / source example extension; CLI absent | Example extension launches separate pi processes; single, parallel and chain modes are documented. It must be installed/trusted separately. | Example returns results to the caller and supports chain handoff; no peer mailbox established by this source. Use lead relay. | Isolated context windows; task cwd and supplied inputs determine context. No shared register service established. | Example agent `tools` selects tools. Construct drops unmapped tools, including WebFetch, from pi profiles. Confirm substitutes before accepting assignments. | Project agent trust/confirmation is documented. Tool omission does not prove OS isolation; allowing `bash` can still permit writes. Test negative cases. |
| Codex / source plus local CLI help | Upstream collaboration handler implements spawn/resume/wait; local `agents` is a session command center, not proof of profile activation. | Upstream handler exports send-input support. Exact session routing and peer delivery unrun. | Source describes inherited cwd/config; no automatic canonical task register established. Use one approved record. | Source describes runtime inheritance and optional role config layers. Actual exposed tools and role loading unrun. | Local help exposes sandbox and approval options; source describes inheritance. Construct emits `sandbox_mode = "read-only"` for reviewers. Actual denial and hook activation unrun. |

The OpenCode discrepancy is an observed source/config difference, not proof of how an installed release handles it. Resolve the target release and validate its schema before changing the generator. Do not mix a speculative adapter migration into this evidence report. Likewise, do not infer Codex CLI behavior from managed-session tool names.

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
| H1: discovery and invocation, each harness | Planner/reviewer profiles discovered; correct bounded specialist receives and acknowledges exact baseline and inputs; returns a result to lead. | Not run for all four. Release-operations establishes approved runtime/config; QA observes. |
| H2: communication, each harness | Test direct delivery only when exposed. Otherwise actually relay a question, answer and acknowledgment through lead. Record route and missing native capabilities. | Not run. Lead coordinates; QA verifies no invented responses. |
| H3: state and concurrency, each harness | One lead-written register; worker cannot silently overwrite a stale baseline; disjoint work integrates before dependent dispatch; interruption resumes from recorded state. | Not run. Lead/integration owner supplies fixture; QA checks state transitions. |
| H4: tools and permission negatives, each harness | Required tools observed; harmless write outside assigned scratch area refused by the applicable sandbox/guard, or documented as instruction-only with serial fallback. Reviewer/tool/guard restrictions checked separately, including shell writes. | Not run. Release-operations records effective controls; QA checks observed denial, not just intent. |
| H5: failure and stop, each harness | Missing tool and failed handoff remain blocked; one focused rework maximum before escalation; no unauthorized side effect or next task starts. | Not run. QA exercises synthetic failure; lead records outcome. |
| H6: OpenCode adapter compatibility | Choose exact target release; validate generated config against its schema and run discovery/permission checks. Correct canonical generator and regenerate only after target is established. | Blocked on installed target/version and schema/runtime verification. Release-operations owns target; authorized engineer fixes any confirmed mismatch. |

T07 remains unchecked until the map and actual direct-or-relayed workflows have version-specific evidence for all four harnesses. A supported fallback can satisfy communication acceptance; an unavailable harness or unrun permission check cannot be counted as pass. Obtain independent QA where required; this report has only self-review. No changes to agents, adapters or installations are claimed here.

## Research sources

Read the following public upstream files at pinned revisions. These are research snapshots, not installed release versions. Official documentation hosts were denied by the environment proxy, so source documentation/changelog was used; those network failures say nothing about harness authentication.

- Claude Code [changelog at 6e1e44f](https://github.com/anthropics/claude-code/blob/6e1e44f6433bfa17d198e932bff53373aa229eea/CHANGELOG.md): `SendMessage`, team task-list persistence and subagent/teammate permission entries. Changelog alone is insufficient to establish full contracts.
- OpenCode [agents](https://github.com/anomalyco/opencode/blob/51ce52546c603f5455489592dfc7845c70712057/packages/web/src/content/docs/agents.mdx) and [permissions](https://github.com/anomalyco/opencode/blob/51ce52546c603f5455489592dfc7845c70712057/packages/web/src/content/docs/permissions.mdx): invocation, child sessions, tool-keyed permissions and defaults.
- pi [subagent example](https://github.com/badlogic/pi-mono/blob/602b8d1cb98035d52c4c360d0d95c65503b989ae/packages/coding-agent/examples/extensions/subagent/README.md): isolated processes, extension setup, tool selection, trust, modes and failure behavior.
- Codex [collaboration handler](https://github.com/openai/codex/blob/d15bf1deb77e0b43dd73ee7dbf7fd6487e6c5837/codex-rs/core/src/tools/handlers/multi_agents.rs): spawn/resume/send-input/wait exports and runtime/config inheritance. Installed alpha CLI may differ from this upstream revision.

Local source inspection: `scripts/build-adapters.mjs`, canonical role frontmatter and generated OpenCode/Codex/pi profiles. No upstream text was copied into repository fixtures.

## Local verification record

`npm run check` passed (68 files, 65 links). All 17 existing setup tests passed outside the sandbox after its subprocess restriction caused `spawnSync git EPERM` inside it. These checks cover adapter consistency and existing setup behavior, not H1–H6. Changed-document relative file links and `git diff --check` passed. Complete proposed-file/staged-diff review and targeted secret scanning found no unresolved secrets or private information; that is self-review, not an independent audit.
