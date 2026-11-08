# Agents

Bounded agent instructions: the crew, role first, codename second. Each agent loads the [construct](../skills/shared/construct/SKILL.md) skill first. Role titles describe perspectives, not human decision authority. Agents advise unless the assignment explicitly authorizes implementation; none may post, push, spend or deploy by default.

| Agent | Codename | Purpose | Status |
| --- | --- | --- | --- |
| [reviewer.md](reviewer.md) | Smith | Maintainer-grade review, read-only, never posts | Draft |
| [planner.md](planner.md) | Architect | Large work into small reviewable changes, rollout and handover plans | Draft |
| [product-manager.md](product-manager.md) | Oracle | Release scope, cut list, capacity plan, claims verified in code | Draft |
| [mentor.md](mentor.md) | Morpheus | Teaching an unfamiliar layer or testing strategy | Draft |
| [delivery-lead.md](delivery-lead.md) | Nexus | Coordinate the squad: task register, assignments, retries, escalation | Draft |
| [qa-verifier.md](qa-verifier.md) | Sentinel | Independent verification: acceptance evidence, exploratory checks, defects | Draft |
| [security-privacy.md](security-privacy.md) | Warden | Threat model, secrets, access, data lifecycle, dependency/license risk | Draft |
| [release-operations.md](release-operations.md) | Atlas | Deployment, rollback, backups, CI/CD, monitoring, incidents, runbooks | Draft |
| [product-strategist.md](product-strategist.md) | Compass | Purpose, audience, discovery, differentiation, demand and MVP boundary | Draft |
| [business-owner.md](business-owner.md) | Ledger | Business models, pricing hypotheses, synthetic economics and commercial risks | Draft |
| [ux-designer.md](ux-designer.md) | Prism | User journeys, accessible interactions, prototype states and usability evidence | Draft |
| [software-architect.md](software-architect.md) | Merovingian | Technical options, contracts, data flows and architecture decisions | Draft |
| [software-engineer.md](software-engineer.md) | Trinity | Bounded implementation, integrity, failure handling and tests | Draft |
| [ai-engineer.md](ai-engineer.md) | Sparks | AI necessity, model comparisons, evaluations, cost and safety | Draft |
| [technical-writer.md](technical-writer.md) | Mouse | Onboarding, usage, APIs, recovery documentation and release accuracy | Draft |
| [marketing-sales.md](marketing-sales.md) | Switch | Positioning, acquisition experiments, launch drafts and adoption measures | Draft |

`software-engineer` is the general implementer; frontend/backend specializations remain optional. `release-operations` covers both release engineering and ongoing operations/support. `planner` sequences delivery; `software-architect` evaluates technical structure. Skills hold reusable procedures rather than duplicating each role's instructions.

Add only material that meets the [repository boundaries](../construct.md). Record status and verification evidence in the root index.
