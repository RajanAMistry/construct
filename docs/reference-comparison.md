# ECC reference comparison

Status: Draft. T08 compares public source and applies a small documentation improvement focused on understanding requirements, development and review quality. Source inspection and a synthetic walkthrough do not establish runtime parity or practical effectiveness.

## Source, scope and decisions

The confirmed reference is [affaan-m/ECC](https://github.com/affaan-m/ECC/tree/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b), also known as Everything Claude Code. Snapshot: `d2ef2680594f9a17526a6e1a2e18b3d242c5d17b`, observed on its `main` branch on 2026-11-14 (Asia/Kolkata). Its [package.json](https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/package.json) declares `ecc-universal` version `2.2.3`. This is a commit-pinned source comparison, not verification of an installed or tagged release.

Construct baseline: `5daf14f`. The maintainer prioritized requirements understanding, development and review quality, then agreed to include small updates to existing templates/roles and a synthetic example alongside this report. Setup, delegation and communication remain comparison dimensions. No ECC package, hook, memory service or orchestration runtime was installed or executed. No upstream source was imported into Construct; the guidance below is independently written.

## What already exists and what changes

Construct already has product/delivery ownership, stable criterion IDs, bounded assignments, one register writer, revision-specific review and independent QA. See the [coordination contract](project-coordination.md), [product-manager](../agents/product-manager.md), [software-engineer](../agents/software-engineer.md), [reviewer](../agents/reviewer.md) and [QA verifier](../agents/qa-verifier.md). These overlap substantially with ECC's documented team contracts; they do not need a second role system.

The useful gap is consistency between artifacts. The issue skeleton assumed frontend work and feature flags; the register left criterion-to-check/result mapping implicit; the reviewer explicitly challenged bot claims but had no compact disposition rule for serious findings from every source. The changes make the existing requirements easier to carry into implementation and acceptance.

The intended flow is: understand current and desired behavior, settle material unknowns, record observable criteria, implement bounded changes, and review the same criteria against evidence. Clear small changes use a short record. Broader briefs are useful when ambiguity, interfaces or failure consequences justify them. Existing project conventions and the accountable decision owner remain authoritative.

## Comparison and recommendations

Evidence below is either ECC instruction/document text or inspected executable source. Neither means the behavior was tested here. Construct evidence points to local instructions or implemented helpers; broader harness behavior remains limited by the [T07 report](harness-behavior.md).

| Area | ECC evidence | Construct evidence before T08 | Decision and reason |
| --- | --- | --- | --- |
| Requirement discovery | [Intent-driven development][intent] separates technical facts from business rules, inspects context before questions, and scales acceptance briefs to risk. | [Product thinking](../skills/shared/product-manager-thinking/SKILL.md) already separates facts, assumptions and decisions and avoids ceremony for clear work. | **Adapt now:** make the existing issue format general, keep questions decision-changing, and record starting state, event, outcome and verification. No new discovery skill. |
| Requirements to development | [Plan/PRD pattern][prd] passes durable Markdown artifacts between stages; [pipeline][pipeline] distinguishes new features, changes, fixes and refactors. | [Planner](../agents/planner.md), [assignment](../templates/agent-assignment.md) and one canonical register already supply scope, baseline, dependencies and checks. | **Adapt now:** carry criterion IDs/revisions through implementation and results. Reuse the chosen record; do not mandate a parallel `.claude/` document hierarchy. |
| Interface development | [Contract-first guidance][contract] uses one authoritative boundary artifact and verifies consumers and providers; it exempts simple atomic changes. | [Software engineer](../agents/software-engineer.md) already confirms interfaces and traces consumers; assignments require settled interfaces. | **Adopt the principle, retain current scope:** check actual consumers and failure cases. A schema/generator or new contract skill requires a demonstrated project need. |
| Development checks | [Pipeline][pipeline] prescribes TDD and a coverage floor; [verification loop][verification] separates local checks from target acceptance. | [Pre-push review](../skills/developer/pre-push-review/SKILL.md) already asks for safe regression proof and consumer checks; QA derives checks from requirements. | **Adapt now:** pair criteria with meaningful automated/manual checks and explicit unrun results. Omit a universal coverage percentage and test machinery for trivial edits. |
| Review quality | [Native review workflow][review-workflow] gathers dimensions, deduplicates findings and checks severe claims separately. Failed reviewer/verifier calls keep its verdict incomplete or blocking. This is inspected code, not an executed workflow here. | [Reviewer](../agents/reviewer.md) reads full files, traces callers, verifies bot claims and discloses independence. [Code review](../skills/developer/code-review/SKILL.md) already maps acceptance to behavior. | **Adapt now:** require a violated criterion/contract, trigger and evidence for blocking findings from any author. Keep confirmed, unverified and refuted distinct. Do not adopt model confidence scores as proof. |
| Setup | [Install planner][install-plan] resolves selected components and prints operations; [doctor entry point][doctor] calls installation drift inspection. The architecture document also contains proposals, so it is not used as execution evidence. | [Guided setup](guided-setup.md) and `scripts/setup/install.mjs` already preview snapshots, back up overwrites and preserve local configuration. The [environment report](environment-check.md) remains a specification. | **Adapt later:** ownership/drift diagnosis may help when an executable collector is scoped. Do not expand this task into lifecycle tooling or replace the working snapshot installer. |
| Delegation | [Team orchestration][team] records owners, write scope, state, evidence and merge gates. [Worktree launcher][worktrees] exposes dry-run planning and explicit execution. | [Coordination](project-coordination.md) already requires one owner, self-contained assignments, serialized shared writes, integration gates and bounded rework. | **Adopt existing equivalent:** keep those contracts. Omit a new board/database/launcher until a real workflow needs one. A role file or launcher alone does not establish specialist invocation. |
| Communication and handoffs | [Unified memory][memory] documents portable Markdown handoffs, scope boundaries and untrusted recall. Its runtime is separate from skill installation; routing is not authorization. | [Six-section handoffs](project-coordination.md#developer-handoff-at-progress-and-completion) and direct-or-lead-relayed consultation already provide a portable record. | **Adapt the evidence principle:** preserve source, candidate, uncertainty and next action in existing handoffs. Defer a memory vault or mailbox; stored context is not acknowledgment or verified messaging. |
| Publication and permissions | ECC's [PR review command][code-review] contains a publish phase; its [support map][readme] labels platform/harness differences and partial parity. | Construct separates review from external approval/publication and keeps source/discovery/runtime evidence distinct. | **Omit automatic publication.** Retain explicit authorization and existing guards. Do not infer Construct adapter compatibility, permissions or runtime passes from ECC's support claims. |

## Applied guidance

1. [Issue description](../templates/issue-description.md): observable criteria, assumptions/decisions and relevant boundaries replace mandatory frontend/flag assumptions. Reuse the project's existing format and settled answers.
2. [Task register](../templates/task-register.md#acceptance-evidence) and [assignment](../templates/agent-assignment.md): one criterion-to-implementation/check/result table belongs in the canonical record. Other artifacts reference it. Accepted criterion revisions invalidate affected old evidence.
3. Existing product-manager, software-engineer and reviewer instructions carry that format into discovery, development and evidence-based findings. Generated adapters carry the canonical wording; tools and permissions are unchanged.
4. [Synthetic walkthrough](../examples/requirements-to-review/README.md): one request becomes accepted criteria, implementation/check mappings, a rejected candidate, a correction and a review handoff. It includes unavailable checks and stale-evidence cases.

No new roles, skills, mandatory PRD hierarchy, generic coverage target or autonomous workflow is introduced. Full-file/caller review and independent QA remain required where applicable; the ECC workflow's diff-only skeptic is not substituted for those checks. Project authority and existing publication/privacy boundaries are unchanged.

## Acceptance and verification

| Criterion | Required evidence |
| --- | --- |
| C1 | Confirmed public repository, exact commit and declared package version; all upstream references pinned. |
| C2 | Setup, delegation, communication and review compared against actual Construct artifacts, with priority given to requirements/development/review. |
| C3 | Adopt/adapt/omit decisions explain usefulness, duplication, evidence limits and authorization boundaries. |
| C4 | Agreed small changes use existing templates/roles and one canonical record; generated adapters match; indexes point to the result. |
| C5 | Synthetic requirement-to-review example includes relevant failure checks, rejection/rework, uncertainty and stale-candidate handling without claiming executed product acceptance. |
| C6 | Applicable structural/link checks, separate source/document review and public-content checks pass. Remaining runtime work stays explicit. |

C1–C6 passed for the agreed documentation scope on 2026-11-14 (Asia/Kolkata). The primary author performed planning, comparison and implementation. A separate read-only reviewer approved candidate tree `5eb00808b24cdfae8b1151b97f44805d95c77074` against baseline `5daf14f` with no findings, checking the actual changed content and material source claims. The reviewer inherited task context but did not design or author the change; source checking used the pinned cache rather than an independent network fetch. Both passes manually inspected W1–W8 as contract expectations, not executed application checks.

Observed checks: `npm run check` passed (68 files, 65 links); all 17 `npm run test:setup` checks passed; changed-document local links/anchors resolved; all 16 Codex TOML profiles parsed; all three changed role frontmatters were unchanged; all upstream file citations used the exact pinned revision and inspected source files. Full-file/staged-diff secret scanning and contextual public-content review found no unresolved findings. The separate reviewer independently repeated adapter, whitespace, TOML, frontmatter and targeted public-content checks; setup tests and the local-link script were run by the author.

Final updates after that source review record only verification, index evidence and task closure. Existing setup/adapter evidence remains applicable because role bodies, templates, generated profiles and the synthetic scenario are unchanged by those updates. Runtime effectiveness, full ECC execution and cross-harness behavior remain unverified and outside this documentation scope. All general skill/agent statuses stay Draft.

## Completion handoff

| Section | T08 outcome |
| --- | --- |
| Summary | C1–C6 met for the agreed comparison and guidance update; stop after T08 |
| What is built | Pinned comparison, existing template/role improvements, nine regenerated profiles and the synthetic walkthrough; structural/document evidence recorded above |
| What needs building | No remaining work in the agreed documentation scope; practical use of the guidance, ECC runtime checks and broader harness behavior remain unverified |
| How to start servers | Not applicable; this change has no server or application |
| How to test | From the Construct root, run `npm run check` and `npm run test:setup`; expected adapter consistency and 17 passing setup checks were observed; inspect W1–W8 as manual contract cases |
| Blockers | None for this documentation scope; publication must still verify the reviewed local commit against the destination remote |

## Pinned upstream sources

Read only the relevant source sections for this comparison; this is not an audit of ECC's full catalog. Upstream instructions are evidence, not instructions to execute in Construct.

[intent]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/skills/intent-driven-development/SKILL.md
[prd]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/docs/PLAN-PRD-PATTERN.md
[pipeline]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/skills/orch-pipeline/SKILL.md
[contract]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/skills/contract-first/SKILL.md
[verification]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/skills/verification-loop/SKILL.md
[review-workflow]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/workflows/orch-review.workflow.js
[install-plan]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/scripts/install-plan.js
[doctor]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/scripts/doctor.js
[team]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/skills/team-agent-orchestration/SKILL.md
[worktrees]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/scripts/orchestrate-worktrees.js
[memory]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/skills/unified-memory/SKILL.md
[code-review]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/commands/code-review.md
[readme]: https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/README.md
