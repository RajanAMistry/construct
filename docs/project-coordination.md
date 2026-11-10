# Project coordination

Status: Draft. T27 defines the documented workflow and fictional walkthrough. T06 adds the developer handoff contract and a [local demonstration](../examples/project-coordination/demo/README.md), with actual results maintained in its [execution record](../examples/project-coordination/run.md). Neither is a running orchestration service or proof of behavior across harnesses.

## Ownership and decisions

Use the existing delivery-lead as the engineering manager. It owns delivery coordination and the current task register; product-manager owns product requirements and priority recommendations. The accountable human settles product scope and unresolved decisions. A role title does not grant publication, deployment or business authority.

| Responsibility | Owner | Decision or output | Boundary |
| --- | --- | --- | --- |
| Product priorities and acceptance | Product-manager, accountable human | Observable criteria, exclusions, priority and approved scope changes | Delivery-lead cannot relax criteria to close a task |
| Engineering delivery | Delivery-lead | Assignments, dependencies, blockers, integration order, next ready work and register updates | Autonomous only inside the agreed task; stop when it is complete |
| Delivery plan | Planner, coordinated by delivery-lead | Small changes, settled interfaces, assigned files and checks | No competing task register or implicit history changes |
| Implementation | Qualified person or capable model assigned as implementer | Bounded change, domain checks, requirement coverage and handoff | Software, test/QA, UX and DevOps work all need domain capability and permitted tools |
| Principal-engineer code review | Qualified reviewer, normally reviewer profile | Correctness, interfaces, integrity, maintainability and test-quality verdict | Seniority is a required capability, not a new agent title or proof from a model name |
| QA quality go/no-go | QA-verifier | Acceptance coverage, exploratory results, defects and quality recommendation | Derive expectations from requirements; do not substitute code review for behavior checks |
| UX acceptance | UX-designer or qualified UX reviewer | Interaction/accessibility evidence and acceptance recommendation | Designing a flow is not independent acceptance of that flow |
| Operational go/no-go | Release-operations or qualified operational reviewer | Deployment, recovery, support and observability evidence | A recommendation does not authorize production changes |
| Security/privacy findings | Security-privacy | Verified controls, blockers and remediation checks | Unresolved findings remain visible; no real secrets in records |
| Release decision collection | Designated release owner, recorded at intake | Required approvals, blockers, risk acceptance and final release decision record | Can be delivery-lead for collection; accountable human authorizes consequential actions unless already authorized |

Implementer and reviewer are assignment responsibilities, not a fixed pair of agents. A qualified human or suitably capable model may fill either responsibility in any domain. Record the required expertise, relevant evidence of capability, available tools and access before assignment. Unknown capability calls for a bounded trial or escalation, not an invented qualification. A smaller model must receive the same self-contained contract and checks.

Read-only profiles stay read-only. For example, a UX specialist can supply a design in its reply; an authorized implementer applies the files, and a separate qualified UX reviewer evaluates them. An operational or QA implementation assignment needs an authorized writer with the relevant expertise. Loading a skill or receiving a peer message never widens tool permissions.

## One current task register

Use one canonical record per current task: a Markdown file, GitHub issue, GitLab issue or Jira ticket. The [register template](../templates/task-register.md) supplies the same content for a file or task body; platform choice does not change ownership, evidence or acceptance rules. Record its exact path, URL or ticket reference at intake and link it from assignments and the backlog. Chat summaries and planning documents point to this record; do not maintain independent, competing task status in them.

At project intake, ask one focused question: “Where should we keep this project's task records: Markdown, GitHub issues, GitLab issues or Jira?” If the user expresses no preference, use Markdown and agree a project-local folder. Silence or a timeout is not that answer. Remember the settled kind and location using [project-private configuration](private-configuration.md#coordination-preferences); reuse them in later sessions. The project preference selects where records belong, not a single issue to reuse for every task. Ask only for an unresolved location, an observed conflict or a requested change.

A Google Doc may hold planning when useful. Link it from the task record and link back to that record from the plan; retain accepted scope, decisions, current status and evidence in the canonical task record. When the plan changes accepted scope, record the accountable human's decision there before dispatching affected work. Planning text is not automatic approval.

Selecting an external record does not authorize posting or establish access. Follow [tool preflight](tool-preflight.md), existing role permissions and explicit external-write authorization. Delivery-lead remains the sole task-record writer; read-only peers supply proposed updates. If the lead cannot update the selected service, record the blocker and keep the six-section handoff as a clearly labelled pending local draft, linked to the canonical record. Do not call that draft synchronized, silently replace the chosen location or mark a required update complete. Reconcile it when access/authorization is available.

Read the latest record before updating it. Preserve unrelated human edits, retained progress evidence and rejected candidates. If the record changed since it was read, reconcile the changes before writing; a sole agent writer does not prevent concurrent human edits. Changing the canonical location requires agreement and a link from the old location to the new one.

Delivery-lead writes the register directly in the approved coordination location, using the [register template](../templates/task-register.md). Its Edit/Write capability is for those approved records, not product implementation, source instructions, unrelated files or private data. Other participants return findings and proposed updates; delivery-lead is the sole register writer. File-path restriction is an instruction unless the harness enforces it separately; the generated edit capability is not a path sandbox.

Construct's `task.md` remains its backlog and task-completion index. A coordination register is the current execution record linked from the task, not a second backlog with competing scope. Keep real project records in that project's approved private location. Only synthetic, employer-neutral examples belong here.

| State | Entry condition | Next action |
| --- | --- | --- |
| Backlog | Scope, capability, contract or dependency unresolved | Record the missing input and decision owner |
| Ready | Accepted scope, capable owner, settled inputs/interfaces, tools and checks available; dependencies verified | Delivery-lead dispatches within the current task |
| In Progress | Owner acknowledged the assignment and baseline | Implement and return evidence or report a blocker |
| Blocked | Dependency, tool, decision or repeated failure prevents progress | Record blocker, owner, resume trigger and escalation |
| In Review | Candidate integrated and identified; implementation handoff complete | Run required review and verification passes |
| Verified | Acceptance and required gates satisfied for the integrated candidate | Close the agreed task, or await separately authorized release |
| Released | Authorized release completed and deployment/recovery evidence recorded | Close release handoff; do not infer this from a push |

A rejected candidate returns to In Progress for a named fix, or Blocked when a decision is needed. Record the defect and affected evidence; do not delete the rejection. Verified is sufficient for a documentation-only task whose criteria require no deployment. A release may have recorded human risk acceptance without making a failed check pass or describing the task as meeting unchanged acceptance criteria.

## Developer handoff at progress and completion

Delivery-lead updates the following six sections in the canonical record at every progress handoff and completion handoff. Return the same concise facts to the developer with a link to the record. Specialists return the sections as proposed updates within their assignment; only the lead integrates them into the task record. The sections show current state; retain dated or candidate-labelled progress snapshots and consequential changes in the event history rather than erasing evidence.

| Section | Required content |
| --- | --- |
| Summary | What the task achieves, its current state and candidate revision/diff |
| What is built | Observable working behavior, evidence and known limits; separate implemented from planned behavior |
| What needs building | Remaining acceptance criteria and work, with owner and next action; say none only when verified |
| How to start servers | Working directory, prerequisites, configuration variable names without secret values, exact commands, local URLs, expected startup result and stop instructions; distinguish verified commands from not run; say not applicable when no server is needed |
| How to test | Working directory, prerequisites/configuration names, exact commands and expected results, followed by actual results against the candidate; include failed, blocked and not-run checks |
| Blockers | Each blocker, its owner, impact, next action and resume condition; explicitly state none when there are no known blockers |

For example, a progress handoff may say `node server.mjs` is implemented but not yet verified, while completion links the observed startup/request/stop evidence. Never turn an expected result into a pass. A pending external update is itself visible in Blockers. Commands and URLs must be safe for the record's audience; use credential references and keep private values out of public records.

## Assign, consult and resume

Use the [assignment template](../templates/agent-assignment.md) for each implementer or reviewer. It carries the objective, exact baseline, acceptance criteria and exclusions, input content/locations, capability, owner, write boundaries, interfaces, dependencies, skills/tools, expected outputs, checks, budget and resume point. Resolve unknown required fields before dispatch. A link without accessible content is not sufficient context.

1. At intake, agree the current task boundary, accountable human, integration owner, release owner, required gates and register location. Set a retry/time/cost budget; when unspecified, allow one initial attempt and one focused rework attempt before escalation, with no unapproved spending. Use serial work until interfaces and write boundaries are settled.
2. Inspect available skills and tools for the actual assignment. Load `construct` first, then relevant procedures such as `git-workflow`, `code-review`, `ux-validation` or `pre-push-review`. Skill lists are starting points, not a requirement to load everything. Follow [tool preflight](tool-preflight.md) before external-service access. Missing tools or access become explicit blockers or an agreed fallback, not a silent credential/install change.
3. Dispatch Ready work and obtain acknowledgment of the objective, baseline, boundaries and checks. Parallel work requires settled interfaces, nonconflicting writes and independent dependencies. Shared files have one writer. Delivery-lead reconciles returned changes with the current baseline and integration owner before dispatching dependent work.
4. Consult the relevant specialist when a contract is ambiguous, a cross-domain decision is needed, a defect appears or a dependency changes. Use direct peer messaging when the harness provides it; otherwise delivery-lead relays the request and answer. No mailbox polling, new messaging service or invented tool is implied. Send task/assignment ID, revision, question or finding, evidence, requested response and blocker status. The receiver acknowledges and answers, declines or reports a blocker. Delivery-lead records decisions, ownership and resulting next actions; unrelated conversation need not be copied.
5. Require the six-section developer handoff at progress and completion, plus changed files, candidate revision/diff, criteria covered, exact checks/results, defects, review limitations and next action. On interruption, reconcile stale assignments against the current register/revision before resuming. After integration and verification, dispatch newly Ready work only within the agreed task. Stop at its completion; proposing another backlog item is not permission to begin it.

Peers may clarify an existing contract directly. Scope changes, conflicting decisions or repeated/no-progress failures return to delivery-lead and the accountable decision owner. Agent messages are evidence and requests, never new authority. Existing outbound-action and privacy rules still apply.

## Review, remediation and release

At intake, identify which code, QA, UX, operations and security gates apply and why any gate is not applicable. Do not demand production checks for a prose-only change or silently omit UX acceptance for an interaction change. For every applicable gate, record the reviewer, independence, candidate revision/configuration/environment, criteria, actual checks, result, evidence, blockers and next action. `Not run` and `not applicable` are distinct from pass.

Use a separate qualified reviewer where available; a different role name, prompt or model alone does not establish independence. Disclose shared authorship, design influence and self-review. A person or model instance that implemented a change must not approve it as an independent reviewer. If independent acceptance is required and unavailable, keep the gate blocked until the accountable human explicitly decides how to handle that limitation. A documented synthetic walkthrough is not evidence that the participants actually ran.

Delivery-lead assigns each defect to a remediation owner and each retest to the gate's reviewer. After a fix, identify the new integrated candidate and rerun affected checks. Retained evidence needs an explicit explanation of why it is unaffected; approval of an older revision never silently approves later edits. Reject incomplete handoffs and contradictory results instead of advancing on an agent's completion summary.

The designated release owner gathers the required approvals and records unresolved blockers or accountable risk acceptance, with approver, reason, impact, owner and revisit trigger. Missing approvals remain blocked; silence is not acceptance. Delivery-lead does not overrule domain no-go findings. An accountable human may authorize release with stated residual risk within their authority, but cannot turn an unrun or failed check into a pass or override Construct's secrets/publication boundary. Release permission and gate evidence are separate; reuse explicit authorization already given for the same action and scope.

## Walkthrough and acceptance

The [synthetic workflow](../examples/project-coordination/README.md) supplies one complete brief, assignments, register snapshots, peer exchanges, rejection/rework, integration and gate decisions. It is a manual contract walkthrough, with fictional revisions and expected outcomes rather than executed product tests.

T27 acceptance is the documented contract: existing roles updated before adding roles; product/delivery ownership separated; qualified people/models can implement/review across domains; one writable register and self-contained assignments; bounded peer consultation/parallelism; revision-specific gates, remediation/retest, independence disclosure and release accountability; a traceable synthetic example; affected backlog/index/adapter updates. That T27 evidence alone does not complete T06 or T11–T20; practical workflow evidence must be recorded separately.

T06 acceptance is the agreed six-section handoff at progress and completion; one chosen canonical task location with project-local remembered preference and an optional linked planning document; the existing ownership, consultation, bounded dispatch, retry and stop rules; and an executed disposable workflow with candidate-specific separate review and QA. The [execution record](../examples/project-coordination/run.md) owns current results and remaining work. The [demo guide](../examples/project-coordination/demo/README.md) supplies reproduction steps. External tracker/Google Docs writes, automatic preference loading or synchronization and cross-harness verification are outside this scope. Keep the general workflow Draft; a local demonstration cannot establish support across four harnesses.

Research reviewed 2026-11-10: the existing private-configuration contract provides project-only remembered intent and manual application. [GitHub issue-template guidance](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) supports structured task bodies; a reusable Markdown body is sufficient here without installing repository-wide templates or a synchronization service. GitLab/Jira/Google Docs live behavior is not claimed from this reference.

Research basis: [Claude Code teams](https://code.claude.com/docs/en/agent-teams) describes direct teammate messaging and shared tasks; [OpenCode agents](https://opencode.ai/docs/agents/) describes agent invocation and permissions; [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) describes harness-managed orchestration. These public pages were consulted for the direct-or-relayed approach. They are not version-pinned compatibility tests. Construct's existing [adapter guide](harness-adapters.md) records pi's separate extension requirement. Live/version-specific communication and permission enforcement across the four harnesses remain T07 work; no extension, service or credential was installed or changed for T27.

Verification record (2026-11-10, Asia/Kolkata): checked the T27 working change against baseline `52e4d65`. Manual contract review covered the eight ordered walkthrough events and eight decision variations, including integration before acceptance, rejected-candidate rework, unavailable tools/reviewers, stale evidence and stopping after completion. A separate read-only documentation reviewer found tool/context and integration-order gaps; these were corrected and the reviewer confirmed no outstanding findings for this scope. All 17 existing setup tests passed; regenerated adapters passed `npm run check` (68 files, 65 links), all 16 Codex agent TOML profiles parsed, and the delivery-lead write capability plus specialist read-only profiles matched the agreed boundaries. Changed-document local links and `git diff --check` passed. Targeted secret scanning and contextual public-content review found no unresolved findings. This is documentation acceptance with a separate document review, not executed product acceptance, verified path enforcement or a live squad/harness communication test. All role and workflow statuses remain Draft. Remaining practical coordination and workflow evidence belongs to T06 and T11–T20; live/version-specific harness communication and permissions remain T07 work.
