# T06 coordination execution record

Status: Verified for the agreed local T06 scope; publication is tracked separately below. This is the canonical task record for the public, synthetic T06 demonstration. Delivery-lead is its sole writer. The scenario is synthetic; agent exchanges and checks recorded as executed below must be observed. No private project records belong here.

## Summary

T06 meets C1–C3/D1–D3: the coordination contract now requires a canonical task record and six-section developer handoffs, demonstrated through an executed local agent workflow with separate review and QA. Candidate I1 is identified below. Stop after T06; do not start T07.

## What is built

Integrated I1 adds the six-section contract/templates, remembered task-location guidance and a working synthetic localhost server with tests and startup guide. E1/W1 self-checks were followed by separate R1 code/document review and Q1 requirement-derived QA, both go. The runnable fixture passes 13 checks; independent default/ephemeral/boundary/invalid/occupied-port and shutdown checks passed. See the exact manifest below.

## What needs building

No implementation remains in the agreed local scope. Automatic preference loading, tracker/Google Docs synchronization, cross-harness support and deployment remain excluded and unverified. R1 has approved closure content. Root owns the final staged review, commit and authorized Git publication, with credential clarification pending as recorded below.

## How to start servers

From repository root: `node examples/project-coordination/demo/server.mjs`, using Node 24 and no installs/credentials. Default address: `http://127.0.0.1:3000`; optional `PORT=0` prints the actual available port. Ctrl-C stops. W1 and independent Q1 verified default startup, health request, 404, stop and connection refusal in disposable copies. See [guide](demo/README.md) for exact copy/curl/stop instructions.

## How to test

From repository root: `node --test examples/project-coordination/demo/server.test.mjs` (expected exit 0; E1/W1, independent Q1 and R1 each observed 13 pass). Root ran `npm run test:setup` (17 pass) and `npm run check` (68 files, 65 links consistent). Socket/child-process checks require approved execution outside the default sandbox here. Q1 independently verified the README startup/test/stop instructions and additional port/method cases. R1 parsed all 16 Codex TOML profiles and checked 147 local links. Expectations and executed results remain distinguished in the guide.

## Blockers

Publication only: the GitHub API identity check returned Forbidden; root asked the user to confirm the existing environment credential and verified repository/main target. Resume on clarified authentication and an ordinary Git transport check. No implementation blocker. External issue/Jira/Google Docs writes and cross-harness communication are excluded.

## Scope and acceptance

- C1: Contract and templates require all six sections at progress and completion, evidence tied to candidate, exact startup/test commands or explicit not-applicable/unverified status.
- C2: Ask once per project for Markdown/GitHub issue/GitLab issue/Jira task location; use Markdown on no preference; remember privately and reuse; optional linked Google planning document does not compete for task status. No loader or synchronizer is implied.
- C3: One delivery-lead writer; acknowledged self-contained assignments, verified dependencies before dispatch, direct-or-relayed consultation, bounded parallel writes, retry/escalation budget and stop boundary.
- D1: Built-in Node HTTP server binds to 127.0.0.1, GET /health returns 200 JSON {"status":"ok"}; unknown route returns 404 JSON. No persistence/authentication/UI/provider calls/deployment.
- D2: Default port 3000; PORT accepts integer 0–65535, rejects invalid values; exported createServer permits ephemeral-port tests. Direct invocation prints the listening URL. Ctrl-C stops the process.
- D3: Startup and test instructions work in a disposable copy with no installs; requirement-derived independent QA checks and separate code/document review identify exact candidates and limitations.

Accountable human: repository user. Delivery-lead/register writer: root session. Integration owner: root session. Release owner: root session, limited to the user's authorized Git commit/push; no deployment. Canonical record: this file. Planning input: [contract](../../docs/project-coordination.md). Budget: one initial attempt plus one focused rework per assignment, then escalate; no spending, installs or new services. Coordination route: available agent delegation/messaging tools; direct or lead-relayed consultation. State is instruction-enforced, not a path sandbox. Updates require checking current contents before writing.

## Assignments

| ID | Owner/responsibility and boundary | Dependencies/state | Checks/output |
| --- | --- | --- | --- |
| P1 | Planner; read-only plan against baseline | Verified planning handoff; no dependencies | Acknowledge scope, settle interface, return assignment/dependency plan |
| C1 | Contract implementer; docs/templates/canonical role instructions and affected indexes only; never this record or demo files | Verified after R1/Q1; separate doc paths | C1–C3, manual preference scenarios, generated adapters |
| E1 | Software implementer; demo/server.mjs and demo/server.test.mjs only | Verified after R1/Q1; server/test files only | D1–D2, actual tests, handoff and startup facts |
| W1 | Technical writer; demo/README.md only | Verified after R1/Q1; README only | D3 startup/test/stop guide; consult E1 about startup/cleanup |
| Q1 | Independent QA; read-only, disposable checks only | Verified I1; distinct instance | C1–C3 and D1–D3 requirement-derived checks, go/no-go |
| R1 | Separate code/document reviewer; read-only | Verified I1; distinct instance | Correctness, contract consistency, privacy and test quality; disclose design involvement |

### Self-contained dispatch details

All assignments receive baseline `016d7a17bb89900609584198724f1cad7290df49`, this record, the C1–C3/D1–D3 criteria above and accessible repository source files. Required skills: construct then plain-voice; Git inspection uses git-workflow; reviewer additionally code-review. Observed tools are local shell/file inspection/editing and native agent delegation/messaging. Local socket/process operations may require approved execution outside the sandbox; no install or service login is implied. Capability is assessed through the bounded planning/implementation/writing/review trial and returned artifacts/checks, not from model or role names. Root supplies design and integration, so root checks are self-review. Reviewers are distinct instances with no implementation/design assignment.

C1 allowed writes: `docs/project-coordination.md`, `docs/private-configuration.md`, the register/assignment/config templates, `agents/delivery-lead.md`, `skills/shared/construct/SKILL.md`, and affected README/index text. Root alone generates adapters after the handoff and writes this record and task-completion entry. E1 writes only `demo/server.mjs` and `demo/server.test.mjs`; W1 only `demo/README.md`. C1 has no shared files with E1/W1. Q1/R1 may inspect all proposed content and run disposable checks but never edit product, record or Git state. All participants must return changed paths/candidate, six-section facts, actual checks, defects/limits and exact next action. Budget and escalation are the shared one-initial/one-rework limit above; missing inputs or exhausted budget block rather than widen scope.

## Events and evidence

| Event | Observed exchange/decision | Next action |
| --- | --- | --- |
| E01 | User approved handoff format at progress/completion, remembered task-record choice/default Markdown, and both contract changes and practical demonstration. Root inspected current repository; clean local work equals fetched origin/main. | Planner received baseline, boundaries, checks and budget; acknowledged read-only planning. |
| E02 | P1 returned scope/dependency plan, explicit manual preference limits and disposable demo approach. Root acknowledged and settled GET-only health, all other methods/paths 404, loopback, PORT 0–65535 and Ctrl-C cleanup. | C1, E1 and W1 dispatched with accessible inputs, exact paths, criteria and one-rework budget; no write overlaps. |
| E03 | E1 and W1 acknowledged objective, baseline, boundaries, checks and budget before edits. E1 supplied startup/port/cleanup consultation facts; root confirmed W1 direct route. | E1 and W1 run in bounded parallel; Q1/R1 remain undispatched until integration. |
| E04 | W1 asked E1 directly about startup line, invalid/occupied port errors, test cleanup and HEAD behavior. E1 answered; W1 acknowledged. HEAD returns 404 with JSON content type and no body, as HTTP requires. Root flagged the draft body wording for correction before handoff. | W1 owns guide correction; QA will verify final guide against runtime. |
| E05 | C1 returned 12 canonical docs/templates/index changes with JSON/link/diff checks and manual preference-contract review; root acknowledged. E1 returned the two server files, SHA256 values and 13 passing Node checks after approved execution outside the socket/process sandbox; root acknowledged implementation self-review. | Root integrates handoffs and regenerates adapters. W1 guide and independent gates remain pending; no completion inferred from implementer reports. |
| E06 | W1 returned corrected guide and actual disposable-copy startup/curl/test/Ctrl-C/connection-refusal evidence; root acknowledged. Server/test hashes match E1 handoff. Root regenerated adapters (3 changed generated profiles) and ran 17 existing setup checks outside sandbox after child-process EPERM; all passed. Adapter consistency passed (68 files, 65 links). | Integrated candidate identified below; dispatch separate R1/Q1 only now. |
| E07 | Root identified the integrated I1 manifest and dispatched distinct R1 and Q1 instances only after C1/E1/W1 integration. Both acknowledged baseline, boundaries, checks and retry budget. R1 disclosed inherited conversation context and no implementation/planning participation; Q1 disclosed no design/implementation participation. | Reviewers inspect the stable candidate and return separate findings/evidence; root is sole record writer. |
| E08 | Q1 returned QA go for C1–C3/D1–D3 on unchanged I1. It ran disposable default startup, health/404/POST/HEAD, occupied-port error, ports 0 and 65535, nine invalid values, SIGINT exit 0 and curl-after-stop exit 7; documented suite passed 13/13. Its stale-summary observation was resolved by root refreshing the current six sections while retaining P01. | Root acknowledged Q1; no implementation defect or source changes. Q1 retains retest ownership if behavior changes. |
| E09 | R1 returned code/document go on unchanged I1: 13/13 server checks, 68-file/65-link adapter consistency, 16 TOML parses, 147 local links, syntax/JSON/diff and contextual privacy review. Root fixed event-table spacing in this record as requested. | Root acknowledged R1; final record/task closure needs a separate content review. No I1 source edits or implementation rework were needed. |

## Progress snapshot P01

- Summary: contract and runnable fixture drafted; integration/review pending at baseline plus uncommitted changes.
- What is built: canonical-record/preference/six-section instructions and local server/test files exist; draft artifacts are not acceptance evidence.
- What needs building: finalize handoffs, regenerate adapters, identify integrated candidate and run separate review/QA; root owns integration and dispatch.
- How to start servers: repository-root `node examples/project-coordination/demo/server.mjs`; localhost port 3000, `PORT` override, Ctrl-C stop; independent verification pending.
- How to test: repository-root `node --test examples/project-coordination/demo/server.test.mjs`; expected pass/exit 0. Sandbox socket/process checks were blocked; approved local execution retry is pending. Existing setup/adapter regressions remain to run.
- Blockers: GitHub identity API check returned Forbidden; final push credential/target clarification requested privately, no token values recorded. Root owns publication; resume on clarified method/target and transport check. No implementation blocker established by sandbox restrictions.

## Gates and closure

| Gate | Candidate/evidence | Decision and ownership |
| --- | --- | --- |
| Code/document review | I1; R1 inspected full source/new files and meaningful tests, 13/13 runtime checks, JSON/syntax, 16 TOML, 147 links, adapters 68/65 | Go; separate instance, no design/implementation assignment, inherited context visible. C1/E1/W1 fix their files; R1 retests code/docs. |
| QA quality | I1; Q1 requirement-derived C1–C3/D1–D3 inspection and independent disposable startup/request/test/stop/port checks | Go; no design/implementation participation. Preference scenarios are manual contract review, not executed loader/tracker tests. Relevant implementer fixes; Q1 retests. |
| UX | No UI introduced | Not applicable; runnable instructions are covered by Q1. |
| Operations | I1 local start/stop, occupied-port handling, copy-based recovery, no persistent data | Local scope passes Q1. Deployment/rollout/production recovery not applicable and not claimed. |
| Security/privacy | I1 R1 context/secret-pattern review; root proposed-file scan and contextual review | No unresolved findings. Scanner's Life Hub match in construct.md was the existing prohibition, not imported private material. Final staged-file/diff review covered all 20 explicit paths with no unresolved findings; I1 hashes stayed unchanged. Setup snapshot checks were rerun after staging the new files: 17 passed. |

C1: pass, six sections at progress/completion in contract, templates and source instructions with current/history split. C2: pass by documented manual preference/target/planning scenarios, synthetic JSON and access boundaries. C3: pass within this observed native-tool trial: acknowledgments, one writer, settled interfaces, disjoint writes, direct consultation, integration before review and bounded retries/stop rules. D1/D2: executed pass. D3: separate R1/Q1 acceptance and reproduced instructions pass. All 18 I1 hashes remained unchanged before/after both independent passes.

No implementation candidate was rejected and no artificial failure was inserted. Port-error checks are deliberate negative tests. The one-initial/one-focused-rework budget and escalation behavior are explicit contracts; exhausted-budget/cross-harness failure handling was not exercised live. Root supplied design/integration and its checks are self-review; R1/Q1 are separate instances with inherited context, not isolated human reviewers. The general coordination workflow remains Draft.

Acceptance: C1–C3/D1–D3 met for I1; T06 is checked complete on that evidence; R1 closure-content review passed before staging/publication. Final local state: Verified, not Released. No deployment requested. Residual implementation blockers: none. Publication: root will review staged content, commit and verify an ordinary push only after resolving the pending Git authentication clarification. An authenticated identity check returned Forbidden; this is not proof that the credential is absent/expired. No credentials or private identity values are retained here. Do not infer remote synchronization from this acceptance record.

Final closure-content review: R1 go on the record SHA256 `1b56ebacb0fd75d6f7cbe6609363a49eaafe5ec0da730332ff77c1ce7d510d55` and T06-only task.md SHA256 `ff1a006f932ada276ee05c60c94ccab435577fb33e5434ad85cf7365abd3caf2`. This receipt and current-state wording were appended afterward; source I1 remained unchanged. R1 reported no privacy findings and a contiguous event table. Next action: finish closure/publication for T06 only; do not begin another task.

## Integrated review candidate

Candidate I1 is baseline plus the following exact SHA256 manifest. The manifest digest is `e8237647089399be1ad8255a298a4b01fd3d5f472709bd33a96af4719be4b423`. This evolving record is excluded from its own digest; it will receive a separate closure-content review. No source changes are allowed during review without a new manifest and affected retests.

```json
{
  "README.md": "3018193ca548d5f8cc98e2e3a53f9da5a02e9aac88761a46b3521d5e4ce4c497",
  "adapters/codex/agents/delivery-lead.toml": "cf2c37cd6c4f4c217dd817d7cc0302a0ddfd915985bad99e81e0fd598d306ee5",
  "adapters/opencode/agents/delivery-lead.md": "e0938a16bc95e5c4eb88f3bef55d50b655b30a630cf5d365d91a3afbcc74e332",
  "adapters/pi/agents/delivery-lead.md": "bf1349b0fda9c7fd2bfec5e2d01be80824e2eb473bfeef3d8cc6e9bac48e0ed6",
  "agents/delivery-lead.md": "96cd87939757b1d0db397138604b1b24804d552af940385f504be19c1de0e858",
  "construct.md": "9b2c72dca70f395400ba032f7f51972ffc00b59d87cbfce25d9a11cbe5d508ed",
  "docs/README.md": "2a5810f8e09e61cc50f1fe25f334607f402eeec14715b76387e213c97fc26c72",
  "docs/private-configuration.md": "0d01798cfc29f4dd13e981272ed41e405c3be209d4dae8026fc5d827a2b80524",
  "docs/project-coordination.md": "57de84bce8c8e3ef54a899a7c353413e889ec19beae6bcba13457afbcb025f4e",
  "examples/README.md": "49c24fca90a6141c78e6410a3ed513e9fe71b48c5640adfee789aed7ca168b5d",
  "examples/project-coordination/demo/README.md": "8af4069baa0522e7ba05cb5b3dcb7d6bd141d29de1e3652df69265ce0922afa9",
  "examples/project-coordination/demo/server.mjs": "eb1b109cc867b9f4d8e8c00be428a329a3e5048e3d5398298f5627aea623d89d",
  "examples/project-coordination/demo/server.test.mjs": "2066dec5e95cd41dee4bb245d1ebff6a5ba704f7c8573d78d92ec64ad7d6fb26",
  "skills/shared/construct/SKILL.md": "debd12f97902876a770a1caabda79780ddd1f06754061c71d1d568a398eecc50",
  "templates/README.md": "bff9fd8aba85363e47712dcd538fa2698d8bbec7d00ccb065ac87b470e034893",
  "templates/agent-assignment.md": "fd7449447e08e11166d659e2417109ed0efa6a0d8f91ab70104b5f8e09fc3b0b",
  "templates/project-config.example.json": "bf17ba928f9f28c7aa8d340094b9f5c32e58b1ad57267878db05ef42c09f364a",
  "templates/task-register.md": "21ac676d6b0f1c1bd4fe885d1af3efebb1ec1db39feed61f3cf6b4218c9e45a5"
}
```
