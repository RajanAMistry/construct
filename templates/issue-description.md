Use the project's established issue/specification format when one exists. Otherwise use this skeleton in the chosen canonical task record. Keep clear, small changes brief; expand only for relevant ambiguity, risk or handoff needs. Link to an existing record instead of keeping a second copy of its criteria or current results.

# Summary

Two or three sentences: what a user sees today, what should change, why.

# What is available today

| Item | Status | Notes |
| --- | --- | --- |

# What is remaining

| Item | Tracked in | Notes |
| --- | --- | --- |

# Scope of this issue

State the affected users or systems, included behavior and relevant constraints. Include feature flags, interfaces, compatibility or rollout conditions only when they apply.

# Assumptions and decisions

Separate observed technical facts from assumptions and product decisions. Record unresolved choices with an owner. Inspect available context before asking one decision-changing question at a time; reuse answers already supplied. Code establishes current behavior, not the intended business rules.

# Acceptance criteria

- [ ] `AC-01`: Given `<starting condition>`, when `<action or event>`, expect `<observable outcome>`. Verify with `<appropriate check and expected result>`.

Include a prohibited side effect or relevant failure, access, compatibility or recovery case when it matters. Use stable criterion IDs. Avoid vague claims such as "works correctly" without observable evidence. Checks may be automated or manual; criteria and tests need not map one-to-one.

Keep criterion-to-change/check/result links in the canonical record using the [acceptance evidence table](task-register.md#acceptance-evidence). Unrun checks remain unverified. Preserve changed criteria and their decision history; agreement on a new scope does not make an earlier failed check pass.

# Out of scope

Bullets with the issue that now owns each item.

# Related

Links with a phrase each.

Backup of previous description (before update on YYYY-MM-DD)

> old text, kept for history
