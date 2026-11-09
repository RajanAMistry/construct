# Synthetic project coordination walkthrough

Status: Draft. This is a fictional manual workflow, not an executed application, real agent transcript or proof of live messaging. All paths and revision labels below describe a hypothetical disposable project. `example-r0` through `example-r3` are logical revisions, not Git SHAs. Results below are expected decisions to walk through; they are not test runs.

## Complete task brief

Task S01: prevent invalid draft titles from being saved in a local note editor. Acceptance: AC1, a title trimmed to 1–80 ASCII characters saves exactly once; AC2, an empty or longer title shows an associated error and makes no storage write; AC3, invalid submission retains the draft and moves focus to the title input; AC4, the runbook describes reverting the validation change while preserving existing drafts. ASCII is a synthetic scope limit, not a recommendation for real products. No accounts, network, provider calls, deployment or publication are included.

Baseline `example-r0`: `src/editor.js` writes every submitted title, `test/editor.test.js` covers valid save only, `docs/editor-flow.md` describes the form, and `docs/recovery.md` describes local draft preservation. Settled interface: `validateTitle(raw)` returns `{ valid: true, title: trimmed }` or `{ valid: false, error: message }`; the storage API remains `saveDraft({ title, body })`. Product owner H1 accepts the criteria; product-manager PM1 maintains their meaning. Delivery-lead EM1 is engineering manager, sole writer of `coordination/S01.md` and release-approval collector; authorized implementer E1 integrates. H1 retains scope/risk decisions. No release action is requested.

For this walkthrough, assume the assignment runner can delegate and relay replies, and provides local file read/write, search, Git, a DOM test runner and local browser/UI inspection in an agreed disposable workspace only. Native peer messaging is unknown, so EM1 relays. External-service authentication is unnecessary. Use `construct` for all assignments; choose the additional skills below. Budget: initial attempt plus one focused rework attempt per assignment, then block/escalate; no spending. Only EM1 writes the register. Participants acknowledge their assignments before starting. No shared implementation-file writers run concurrently.

The people/model-instance references below denote hypothetical participants whose stated capabilities must be checked in a real run. Choosing a different model name would not prove capability or independence. Required gates are code review, QA, UX and operational recovery review; security review is not applicable here because the hypothetical change adds no account, network, dependency or trust boundary. Public-content review still applies to any published documentation. In a real task, security applicability must be reassessed from the actual diff.

## Assignments with enough context to start

The fictional assignments assume that each recipient receives the brief, settled interface and read access to the source files described in the baseline summaries above. This document provides the full coordination scenario, not runnable source files. In a real execution handoff, actual source contents or confirmed accessible file locations must be supplied before acknowledgment; a summary alone is insufficient. Outputs go to EM1 with assignment/revision, criteria covered, exact checks/results, defects, independence disclosure and next action. Read-only reviewers return replies; they do not update the register.

| ID / responsibility / owner | Required capability and input | Allowed writes / skills and tools | Output and checks / dependency |
| --- | --- | --- | --- |
| A1, UX artifact implementer U1 via authorized writer W1 | Form accessibility and error-state design; brief at r0, AC1–AC3 and unchanged storage interface | W1 alone writes `docs/editor-flow.md`; U1 read-only; `ux-validation`, `plain-voice`; read/search and W1 file editing | Exact error association, retained draft and title focus for invalid submit; U2 reviews the integrated state table against AC1–AC3 as A1 artifact reviewer; Ready initially |
| A2, operational artifact implementer O1 via W2 | Safe local recovery; brief at r0, AC4, no storage schema change | W2 alone writes `docs/recovery.md`; O1 read-only; `plain-voice`; read/search and W2 file editing | Revert procedure preserving drafts and a before/after draft-content check; O2 is A2 artifact reviewer; Ready initially, parallel with A1 |
| A3, software implementer E1 / integration owner | Input validation, persistence boundaries and DOM tests; brief plus acknowledged A1/A2 handoffs, integrated r1 | `src/editor.js`, `test/editor.test.js`; `git-workflow`; local read/edit/search, Git and test runner | AC1–AC3 implementation and tests at lengths 0, 1, 80, 81 after trimming; verify invalid paths have zero saves and retain draft/focus; depends on verified A1/A2 integration |
| A4, principal-engineer reviewer C1 | Validation/data integrity and test-quality review; did not implement/design A3; brief and integrated candidate r2 | None; `code-review`, `git-workflow`; read/search, read-only Git and agreed disposable test execution | Revision-specific code verdict, boundary/side-effect findings and retest list; depends on A3 handoff |
| A5, QA reviewer Q1 | Independent requirement-derived DOM/storage checks; did not implement A3 or author its tests; brief and candidate r2 | None in source; `construct`; local read/search and agreed disposable test execution | AC1–AC3 coverage including whitespace-only, 80/81 boundaries, save count, draft retention and focus; depends on A3 handoff |
| A6, UX reviewer U2 | Accessibility/form-state review; separate from U1/W1/E1; brief, flow and candidate | None; `ux-validation`; read and permitted UI inspection | AC2/AC3 associated error and focus/retention checks on integrated candidate; depends on A3, not just design artifact |
| A7, operational reviewer O2 | Safe rollback/draft preservation; separate from O1/W2/E1; brief, recovery guide and candidate | None in source; `construct`; read and disposable recovery checks | AC4 recovery go/no-go with draft-content comparison; depends on A3 integrated candidate |

Each recipient acknowledges the objective, exact baseline, boundaries, checks and budget, or blocks on missing context/tools. Reviewers may create disposable test output only within an agreed test workspace. In this fictional sequence, no permission or context blocker occurs. The responsibilities can be filled by qualified people or capable model instances; the read-only UX/operations profiles do not gain write permission because they were called implementers.

## Register and consultation sequence

| Event | Message / acknowledgment / evidence input | EM1 record and next action |
| --- | --- | --- |
| E01, intake r0 | H1 accepts S01/AC1–AC4 and stop boundary. PM1 confirms no storage schema change. EM1 assigns A1/A2; U1/W1 and O1/W2 acknowledge separate paths and interface. | S01 In Progress; A1/A2 In Progress in parallel. A3 Backlog until their contracts are verified/integrated. Register contains owners, capabilities, budget, gates and relay route from this brief. |
| E02, consultation r0 | U1 → EM1 → E1: “A1/r0: Does trimmed validation happen before `saveDraft`? AC2 requires zero writes.” E1 acknowledges and answers yes, using the agreed return contract. EM1 relays the answer; U1 acknowledges. | Record decision D1: validation precedes storage, E1 owns implementation; no criteria change. If peer messaging were available, the same exchange could be direct with D1 reported back to EM1. |
| E03, parallel handoffs | A1 returns the explicit state table; A2 returns restore steps and preservation check. EM1 acknowledges both. E1 integrates both nonconflicting files as r1 and confirms the interface unchanged. Within A1/A2, U2 reviews the integrated artifact for AC2/AC3 and O2 reviews AC4 steps, each disclosing no authorship. These are artifact reviews, separate from their later runtime assignments A6/A7. | After those r1 reviews, EM1 marks A1/A2 Verified as documentation assignments. A3 becomes Ready; A4–A7 remain Backlog pending a runnable candidate. |
| E04, implementation r2 | E1 acknowledges A3/r1, implements validation and tests, and returns r2. The handoff claims AC1–AC3 covered and supplies hypothetical test evidence for review. EM1 checks that the diff is integrated and identifies the candidate. | A3 In Review. A4–A7 Ready, then In Progress after acknowledgments. EM1 does not mark S01 Verified from E1's claim. |
| E05, rejection r2 | C1 traces whitespace-only input and finds the implementation checks raw length before trimming (F1). Q1 independently derives AC2's whitespace-only case and reports one unexpected save (F2), with steps: enter spaces, submit, inspect save count. U2 reports a focus failure (F3) under AC3. O2 reports expected AC4 recovery pass on r2. All are fictional observations for this walkthrough. | Code/QA/UX no-go; S01 and A3 return In Progress. E1 owns F1/F2/F3 fixes. C1 owns code retest, Q1 QA retest, U2 UX retest. Preserve rejected r2 evidence and count one rework attempt. A7's r2 evidence does not silently approve r3. |
| E06, fix consultation | E1 → EM1 → U2: “A3/r2, F3: focus title after showing its associated error, while keeping the body?” U2 acknowledges yes under AC3; EM1 records D2 and relays it. E1 confirms both trim-before-length and focus fixes. | D2 clarifies existing criteria; PM1 need not change scope. If the fix required dropping draft retention, EM1 would block for PM1/H1 instead of weakening AC3. |
| E07, retest r3 | E1 returns integrated r3 and changed files/checks. EM1 sends the new candidate to C1/Q1/U2/O2. C1 rechecks validation order, save side effects and tests; Q1 reruns all AC1–AC3 cases; U2 rechecks error/focus/retention; O2 reruns recovery and compares draft contents because the reverted implementation changed. Each returns a separate verdict and disclosure; EM1 acknowledges. | Hypothetical code/QA/UX/operations go at r3. F1/F2/F3 closed only after reviewer retest. No stale r2 approval reused. If another focused rework failed, EM1 would mark Blocked and ask H1 for a decision rather than spawning an unlimited retry loop. |
| E08, closure | EM1 collects A4–A7 gate records, confirms AC1–AC4, and hands H1 the r3 acceptance record with “no release requested; no unresolved blockers or accepted risks.” H1 receives the handoff. | S01 Verified, not Released. EM1 stops. It does not select the next backlog task, push or deploy. |

## Final synthetic register snapshot

Current task S01; sole writer EM1; integrated candidate `example-r3`; interface D1/D2 settled; one initial implementation attempt plus one rework used. No budget overrun. Integration owner E1; release collector EM1; scope/risk authority H1. Assignment records A1–A7 above remain linked in the record with E01–E08 events and preserved r2 rejection.

| Assignment | Final state | Candidate / evidence | Next action |
| --- | --- | --- | --- |
| A1/A2 | Verified (artifact checks only) | r1; state table/recovery guide review at E03 | No further writes; runtime acceptance is A6/A7 |
| A3 | Verified | r3; AC1–AC3 coverage after fixes F1/F2/F3 | Stop implementation |
| A4/A5 | Verified | r3; C1 code go, Q1 QA go at E07; separate independent passes assumed in this fiction | No open defect; stop |
| A6/A7 | Verified | r3; U2 UX go, O2 recovery go at E07 | Stop; no deployment |

| Required gate | Candidate/context | Expected evidence and result | Remediation → retest / independence |
| --- | --- | --- | --- |
| Code review | r3, disposable local editor/test environment | Trim before length, no invalid save, relevant test-quality review; go | E1 → C1; separate author/reviewer assumed |
| QA quality | r3, same candidate/environment | Trimmed lengths 0/1/80/81, whitespace-only, valid one save, invalid zero saves, retained draft/focus; go | E1 → Q1; requirement-derived independent pass assumed |
| UX acceptance | r3, same editor UI | Associated error, title focus and retained body; go | E1 → U2; separate from design and implementation assumed |
| Operational readiness | r3, disposable recovery workspace | Revert validation and compare preserved draft content; go | E1/W2 → O2; separate review assumed |
| Security/privacy | r3, scope/diff review | Domain gate not applicable under stated synthetic boundary; publication privacy review still required if publishing | Reassess applicability if actual diff crosses a trust boundary |

Every result in this snapshot is a synthetic expectation. In a real run, replace labels with exact revisions, environment/tool versions, actual evidence locations and observed results. If one person/model instance fills implementer and reviewer, record self-review instead of the independence assumptions above; a required independent gate remains blocked pending the accountable human's explicit decision. No approval or risk acceptance is inferred from silence.

## Decision branches to check manually

| Variation to the sequence | Required result |
| --- | --- |
| A1/A2 propose writes to the same file or change the shared interface | EM1 serializes/reassigns work and settles the contract before parallel dispatch |
| Recipient cannot read supplied inputs, lacks a required tool or has unknown capability | Mark Blocked; record owner and resume trigger; use an agreed supported fallback or escalate |
| H1 requests a scope change while A3 runs | PM1 records revised criteria for H1's decision; EM1 reconciles assignments/evidence before resuming |
| Required independent reviewer is unavailable | Record self-review limits and blocked gate; H1 explicitly decides how to address the limitation |
| O2 returns no-go or not-run while other gates pass | Release collector retains the blocker; fix/retest or accountable risk decision, never a fabricated pass |
| H1 accepts a residual operational risk | Record approver H1, reason/impact, remediation owner and revisit trigger; failed checks remain failed and unchanged unmet acceptance remains unmet |
| New r4 edits arrive after r3 gate approvals | Identify affected evidence and rerun checks, or document why specific retained evidence is unaffected; no blanket approval transfer |
| All S01 criteria pass and another backlog task is Ready | Close S01 and stop; ask only when separately authorized to begin another task |

## Verification limits

Walk E01–E08 in order and verify the final snapshot follows from the brief, assignments and returned evidence. Then walk each variation above. See the [coordination contract](../../docs/project-coordination.md) and reusable [register](../../templates/task-register.md) / [assignment](../../templates/agent-assignment.md) templates. Checking this document establishes contract coverage only. There is no runnable editor, executed gate result, independent participant session or tested harness message transport in this example.
