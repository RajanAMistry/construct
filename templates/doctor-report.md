# Construct doctor report

Use with the [environment check specification](../docs/environment-check.md). This is a manual report template, not a command. Replace placeholders only with safely observed facts; keep actual reports private. Unknown fields stay `unknown`. Do not attach raw diagnostic output.

Contract: 1. Observed at: `<date/time with timezone>`. Construct revision: `<revision or unknown>`. Snapshot: `<ID or unknown>`.

Scope: `<project/global reference>`. Harnesses: `<selected harnesses>`. Services: `<selected services and target references>`.

Requested mode: `<live/offline>`. Collector: `<role reference>`. Operational review: `<reference/self-review>`. Security/privacy review: `<reference/self-review>`.

Summary: `<what was verified, required blockers/unknowns, and whether the requested report is complete>`. Repository access and write permissions: `not-checked (sign-in-only scope)`.

## Checks

Use `pass`, `attention`, `blocked`, `unknown`, `not-checked` or `not-applicable` with evidence and a reason. Add a row per selected tool, harness/resource, permission operation and service; increment IDs within each category. The rows below show the required categories. Record a documented tool version or `unknown`. Every live row needs its observation time and selected target/source references.

| ID | Subject | Required? | State | Observation and sanitized evidence source | Next step |
| --- | --- | --- | --- | --- | --- |
| TOOL-01 | `<tool>` | `<yes/no>` | `<state>` | `<availability, version, local help evidence>` | `<action or none>` |
| SOURCE-01 | Generated adapter consistency | `<yes/no>` | `<state>` | `<source-check result or reason unavailable>` | `<action or none>` |
| INSTALL-01 | `<harness native resources>` | `<yes/no>` | `<state>` | `<resource presence, readability, snapshot/link match>` | `<action or none>` |
| DISCOVERY-01 | `<harness runtime discovery>` | `<yes/no>` | `<state>` | `<runtime observation or why not checked>` | `<action or none>` |
| FS-01 | `<resource and read/traverse/write operation>` | `<yes/no>` | `<state>` | `<current-user metadata/access result and limits>` | `<action or none>` |
| POLICY-01 | `<trust/sandbox/approval/guard setting>` | `<yes/no>` | `<state>` | `<configuration source, precedence/activation limits>` | `<action or none>` |
| GUARD-01 | Guard enforcement | `<yes/no>` | `not-checked` | No runtime enforcement test in this report | Verify separately before relying on it |
| AUTH-01 | `<selected service sign-in>` | `<yes/no>` | `<state>` | `<auth details below, time, target/source references>` | `<action or none>` |
| ACCESS-01 | Repository permissions | no | `not-checked` | Sign-in-only scope | Assess separately when authorized |

## Authentication detail

Repeat per selected service. Keep expected and observed account references separate.

| Field | Observation |
| --- | --- |
| Service / expected host / expected account | `<service / host reference / account reference or unknown>` |
| Observed host / observed account / target match | `<host reference / account reference or unknown / yes-no-unknown>` |
| Configuration | `<configured/not-configured/unknown; evidence>` |
| Method / effective credential source | `<supported method or unknown / source reference or unknown; precedence evidence>` |
| Connectivity | `<reachable/failed/unverified/unknown; sanitized reason>` |
| Sign-in validity | `<verified/rejected/unverified; reason>` |
| Live evidence | `<observation time, safe check/version, target/source references; or why not checked>` |
| Repository permissions | `not-checked (sign-in-only scope)` |
| Next unresolved question or action | `<one focused question or next step; never request a secret>` |

## Synthetic examples

These are fictional contract examples, not results from a real check. They assume all required local inventory rows were collected separately; they do not imply general environment readiness.

**Live sign-in:** selected service `example-forge`, expected host `forge.example.com`, expected account `example-user`; observed host/account match. Configuration `configured`, method `environment credential`, effective source `EXAMPLE_FORGE_TOKEN` (presence only). Fixture evidence: the documented read-only identity check for `example-cli 1.0` returned the expected account at `2026-11-09T12:00:00+05:30`. Connectivity `reachable`; sign-in validity `verified`; AUTH-01 `pass`. Repository permissions `not-checked`. Next step: none for sign-in. Summary: sign-in verified at the stated time; repository access and guard enforcement remain unverified.

**Offline inventory:** selected service `example-forge`, expected host `forge.example.com`, expected account `unknown`; configured environment source `EXAMPLE_FORGE_TOKEN` (presence only), with no safe local account metadata. Observed account `unknown`, target match `unknown`, connectivity `unverified`, sign-in validity `unverified`, AUTH-01 `not-checked (offline)`. No service request occurred. Next question: “Which account should this service target?” Summary: offline configuration observed; live sign-in not checked. An environment variable's presence does not prove its account or validity.

## Follow-up and limits

List each required blocker/unknown with an owner reference and one next action. Ask only the first unresolved question, then reuse the answer. State which checks were skipped and why. A requested live report remains incomplete if required sign-in evidence is missing; never turn unavailable evidence into a pass.

Keep this report in the conversation unless the user chooses a private save destination. Publish only independently written synthetic examples, after reviewing both their text and context for secrets and private information.
