# Construct offline validation report

Use with the [specification](../docs/offline-validation.md). This is a report template, not a command. Keep host-specific results private; publish only reviewed synthetic examples. Do not attach raw stdout/stderr or environment/configuration dumps.

Contract/catalog version: `1`. Source revision: `<revision>`. Source dirty: `<yes/no/unknown>`. Observed at: `<time with timezone>`.

Evidence kind: `<specification-review/executed-synthetic>`. Environment/platform and tool versions: `<sanitized references>`. Network/process isolation: `<mechanism/evidence, or unavailable>`. Reviewer: `<reference/self-review>`.

Overall: `<passed/failed/incomplete>`. Exit classification: `<0/1/2; proposed only for a specification review>`. Counts: `<pass, fail, blocked, not-run, skipped; required/optional totals>`.

## Case evidence

List every catalog ID, including unavailable required checks. For a specification review, record review decisions in the observation column and use `not-run` for execution state; do not invent executed passes.

| ID / category | Required? | Execution state | Expected / observed decision and evidence | Next action / owner |
| --- | --- | --- | --- | --- |
| `<catalog ID / category>` | `<yes/no>` | `<pass/fail/blocked/not-run/skipped>` | `<sanitized observation or specification review finding>` | `<one action / owner, or none>` |

## Completion and follow-up

List every failure and incomplete required check, with a responsible role and one next step. Note optional omissions separately. Include child termination/cleanup outcome and whether the source checkout was preserved. Required omissions are never waived into success.

Repeatability comparison: `<same normalized ordered decisions on repeat / not run>`. Unexpected sensitive output: `<none, or check ID and problem type only>`.

Limits: synthetic results do not verify live sign-in, repository permissions, installed harness discovery or guard enforcement. A specification review leaves every executable case not run and cannot be reported as a passed validation run.
