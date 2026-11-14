# Requirements to development and review

Status: Draft. This is an independently written synthetic contract walkthrough for [T08](../../docs/reference-comparison.md). All product decisions, files and revisions below are fictional. No application, test suite, model-backed exchange or product acceptance was executed. The expected outcomes are for manual inspection of the guidance.

Use the project's current issue format or [issue skeleton](../../templates/issue-description.md), the [assignment](../../templates/agent-assignment.md) and the [canonical acceptance table](../../templates/task-register.md#acceptance-evidence). Follow [project coordination](../../docs/project-coordination.md); delivery-lead remains the sole record writer.

## Understand the request

Request: "Let me rename a saved draft without losing its current title when saving fails."

Inspected fixture facts: draft `D-001` has title `First draft`; the store can report a write failure. These establish current behavior and available checks, not product policy.

Two decision-changing questions are asked in order, each after the previous answer:

1. What should surrounding whitespace or a whitespace-only title do? Fictional decision: trim surrounding whitespace; reject an empty result without writing anything.
2. When persistence fails, what should the user see and be able to retry? Fictional decision: report failure, preserve the stored and displayed title, and allow a manual retry. No automatic retry.

Accepted scope: rename one existing draft. Draft creation, title-length policy, autosave, accounts and collaboration are excluded. If one of those boundaries becomes necessary, return the decision to the owner. Do not infer a rule from a field name or add a limit without evidence.

## Accepted criteria: brief revision 1

| Criterion | Starting state and event | Observable outcome and relevant prohibited effect | Verification method and expected result |
| --- | --- | --- | --- |
| AC-01 | `D-001` exists; save `  Revised title  ` and persistence succeeds | Store and display show `Revised title`; another draft is unchanged | Integration check with two synthetic drafts; inspect saved/displayed values and the untouched draft |
| AC-02 | `D-001` exists; submit whitespace only | Validation message; stored/displayed title unchanged; no persistence write | Behavior check observes validation and unchanged state; store spy verifies no write |
| AC-03 | `D-001` exists; valid rename reaches a simulated persistence failure | Save failure is reported; stored/displayed title remain `First draft`; manual retry can succeed once the store recovers | Failure-injection integration check followed by retry; inspect both state and user-visible result |

The criteria do not prescribe internal methods or a one-test-per-criterion layout. AC-03 needs failure and recovery observations. Existing checks may cover several criteria. A type check alone cannot establish any of these behaviors.

## Development assignment and mapping

Example assignment `I-01` acknowledges brief revision 1, baseline `example-r0`, fixture inputs and the three criteria. Allowed writes are fictional `app/rename-draft` and its behavior checks. The engineer consults the product owner through delivery-lead if a criterion cannot be met. One initial attempt and one focused rework are allowed.

| Criterion | Planned change | Planned check | Actual product result |
| --- | --- | --- | --- |
| AC-01 | Trim the proposed title and publish it after persistence succeeds | Successful rename plus another-draft sentinel | Not run; illustrative mapping |
| AC-02 | Validate before calling persistence | Whitespace submission and no-write observation | Not run; illustrative mapping |
| AC-03 | Preserve current state until persistence succeeds; report failure and permit manual retry | Controlled store failure, unchanged stored/displayed values, then successful retry | Not run; illustrative mapping |

Expected implementation order:

```text
read current draft -> derive proposed title -> validate
-> persist proposed copy -> publish successful result
failure -> keep current title -> report failure -> await manual retry
```

For an existing defect, a reliable regression check should expose it before the fix. If the fixture cannot exercise persistence failure, record AC-03 as unverified and name the missing seam; do not substitute a passing happy-path check. No regression proof was executed in this document.

## Review, rejection and rework

Fictional candidate `example-r1` validates first but updates displayed state before persistence. A reviewer traces the failure path against AC-03, finds that the title changes even when the store rejects the save, and rejects that candidate. A passing AC-01 check does not cover this failure.

The blocking finding names AC-03/revision 1, the `example-r1` display-update step, the failed-save trigger and the visible state change. Expected disposition: **confirmed by the illustrated trace**, requiring correction; this is a walkthrough expectation, not an executed defect report. The engineer owns remediation; the assigned code reviewer and QA verifier own their respective rechecks.

Fictional `example-r2` publishes the new title only after persistence succeeds. Review must inspect the new ordering, and QA must rerun AC-03's failure/retry checks against `example-r2` before acceptance. The criteria remain unchanged. The expected corrected flow is not a recorded pass; actual application checks remain not run.

Another reviewer claims "trimming the title violates AC-01." Reading the accepted criterion refutes that claim: trimming is explicitly required. Record the reason and candidate. Do not change the accepted criterion, produce a duplicate finding, or use a confidence percentage as evidence.

If a material defect cannot be checked because the source or verifier is unavailable, label it unverified, retain its potential impact, and name the next check and owner. It is neither confirmed nor refuted by that failure. If the affected review/check is required, acceptance remains incomplete.

## Progress/completion handoff example

The engineer proposes these sections; delivery-lead integrates them into the existing canonical record. No second tracker is created.

| Section | Illustrative handoff at `example-r2` |
| --- | --- |
| Summary | Rename behavior proposed for AC-01–AC-03/brief revision 1; In Review, acceptance incomplete |
| What is built | Corrected ordering is described; no application behavior executed here |
| What needs building | Run the three behavior checks, failure/retry coverage and required independent review/QA |
| How to start servers | Not applicable to this document; a real assignment must supply verified commands for its application |
| How to test | Use the criteria table's fixtures and expected observations; actual runnable commands are unavailable in this walkthrough |
| Blockers | Application/check harness absent from the example; implementer supplies it, then reviewers run the required checks |

## Manual walkthrough checks

Read each case against the templates and role instructions. These are expected contract dispositions, not test-run output.

| Case | Expected disposition |
| --- | --- |
| W1: technical context exists but whitespace policy is unknown | Inspect context, ask the first policy question, and wait for its answer; do not infer policy from code |
| W2: a tiny edit already has clear criteria | Keep its record brief; do not introduce a full PRD, extra role or new test framework |
| W3: only successful-save checks are green | AC-03 remains unverified; missing failure/retry coverage prevents required acceptance |
| W4: candidate publishes state before failed persistence | Reject against AC-03; assign correction and revision-specific retest owners |
| W5: corrected ordering exists but checks were not executed | Record not run; do not mark product acceptance passed |
| W6: a required reviewer or a material finding's verifier is unavailable | Record incomplete review/unverified finding with owner and next action; do not silently approve or refute |
| W7: a finding contradicts the accepted whitespace criterion | Refute with the exact criterion and candidate, without changing the requirement |
| W8: a later scope decision adds automatic retries or changes failure behavior | Record an accepted criterion revision through the decision owner, reconsider affected checks/reviews, and retain the earlier evidence as historical |

Stop at this task. This example does not authorize creating a real rename feature, starting another backlog task, posting a review or installing an ECC runtime.
