# Current task register

Follow [project coordination](../docs/project-coordination.md). Copy into the approved project location; keep real private records outside public Construct. Delivery-lead is the sole writer. This is the canonical execution record for one agreed task, not a replacement backlog. Use the same body in a chosen Markdown file, GitHub/GitLab issue or Jira ticket. Update the six developer sections at progress and completion; keep earlier evidence in the event history.

Canonical task record: `<exact file path, issue URL or ticket reference>`. Remembered project preference: `<kind and folder/repository/project reference; private configuration location>`. Planning document: `<optional Google Doc reference or none; link back to this record>`. Update state: `<current, or pending external update with draft location/blocker; never imply synchronization>`.

## Summary

`<Task purpose, state and candidate revision/diff; progress or completion handoff>`.

## What is built

`<Observable implemented behavior, evidence and limits; distinguish planned behavior>`.

## What needs building

`<Unmet criteria/work, owner and next action; none only when verified>`.

## How to start servers

`<Working directory, prerequisites, configuration names only, exact commands, URLs, expected startup result, stop instructions and verified/not-run status; or not applicable with reason>`.

## How to test

`<Working directory, prerequisites/configuration names, exact commands, expected results, actual candidate-specific results and failed/blocked/not-run checks>`.

## Blockers

`<Each blocker, owner, impact, next action and resume condition; explicitly none if no known blockers>`.

## Coordination details

Task/backlog reference: `<ID, objective and approved scope>`. Acceptance criteria: `<IDs and observable checks>`. Exclusions/stop boundary: `<scope and stop after this task>`.

Accountable human/product decision owner: `<reference>`. Delivery-lead/register writer: `<reference>`. Integration owner: `<reference>`. Designated release owner/authority: `<reference and limits>`. Approved canonical record location: `<file path, issue URL or ticket reference>`.

Current baseline/integrated candidate: `<exact revision and dirty diff reference if needed>`. Budget: `<attempt/time/cost limits; escalation trigger>`. Coordination mode: `<direct messaging tool or lead relay; observed capability and limits>`.

| Assignment | Objective/criteria | Owner, responsibility and capability | State | Dependencies/interface/write boundaries | Baseline → candidate | Evidence/defect references | Blocker/decision owner | Next action/resume trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<ID; link to full assignment>` | `<goal; criteria IDs>` | `<person/model instance; implementer/reviewer; domain evidence>` | `<Backlog/Ready/In Progress/Blocked/In Review/Verified/Released>` | `<verified prerequisites; contract; named paths>` | `<revisions/diff>` | `<actual checks or not run; defects>` | `<issue and owner or none>` | `<owner; action; required acknowledgment>` |

## Gates for the integrated candidate

| Gate | Applicable? Why? | Reviewer/capability/independence | Revision/configuration/environment | Checks and evidence | Result/blocker | Remediation owner → retest owner |
| --- | --- | --- | --- | --- | --- | --- |
| Principal-engineer code review | `<yes/no and reason>` | `<reference; self-review/design involvement>` | `<candidate>` | `<check and result, or not run>` | `<go/no-go/not run/not applicable>` | `<references>` |
| QA quality | `<yes/no and reason>` | `<reference; independence>` | `<candidate>` | `<criteria coverage>` | `<result>` | `<references>` |
| UX acceptance | `<yes/no and reason>` | `<reference; independence>` | `<candidate>` | `<interaction/accessibility checks>` | `<result>` | `<references>` |
| Operational readiness | `<yes/no and reason>` | `<reference; independence>` | `<candidate>` | `<deployment/recovery checks>` | `<result>` | `<references>` |
| Security/privacy | `<yes/no and reason>` | `<reference; independence>` | `<candidate>` | `<controls and public-content review>` | `<result>` | `<references>` |

## Decisions, exchanges and rework

| Event | Assignment/revision | Request/finding → acknowledgment/response | Decision and accountable owner | Register change/next action |
| --- | --- | --- | --- | --- |
| `<ordered event ID>` | `<ID; revision>` | `<sender; recipient; question; evidence; answer or blocker>` | `<decision; owner; authority; or pending>` | `<state; fix owner; retest owner; resume point>` |

Before each update, read the latest canonical record and reconcile concurrent edits. Retain candidate-labelled progress snapshots of the six developer sections here. Preserve rejected evidence and superseded revisions. For evidence retained after changes, record why it remains applicable. Record retry count and stop on the agreed escalation trigger.

## Closure or release handoff

Acceptance: `<met/unmet criteria and candidate>`. Required approvals: `<gate references or blockers>`. Residual risks: `<none or approver, reason, impact, owner and revisit trigger>`. Independence limits: `<disclosure and decision>`.

Release action/authorization: `<not requested, existing scoped authorization, or pending>`. Actual deployment/publication evidence: `<not run or observed outcome; a push is not deployment>`. Final state: `<state and reason>`. Remaining work: `<tracked references>`. Next action: `<stop at this task or separately authorized action>`.
