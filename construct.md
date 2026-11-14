# Construct

## Purpose

Build a small, dependable collection of reusable methods for understanding problems, building software, researching questions and communicating clearly.

## Scope

Employer-neutral skills, agent instructions, reference documentation, templates and synthetic examples. Start with one practical item and add structure only when it helps someone use the material.

## Repository boundaries

Construct is public. Private notes, personal records and employer material belong outside this repository and its issues, pull requests, commit messages and attachments. There is no automatic connection to any private knowledge system.

## Working principles

- Prefer lasting usefulness and small, reviewable changes.
- Choose the smallest outcome that solves the stated problem.
- Protect attention and avoid unnecessary tools or administration.
- Use AI with judgment; verify results and retain responsibility for them.
- Treat failed steps and interruptions as evidence for adjusting the approach.
- State assumptions, uncertainty and limitations plainly.

## Folder index

| Location | Contents |
| --- | --- |
| [skills/shared/construct/](skills/shared/construct/SKILL.md) | The prime directives and crew, loaded first in a session |
| [skills/developer/](skills/developer/README.md) | Implementation and verification methods |
| [skills/communication/](skills/communication/README.md) | Clear writing and communication methods |
| [skills/shared/](skills/shared/README.md) | Methods useful across roles |
| [agents/](agents/README.md) | The crew: bounded agent instructions |
| [templates/](templates/README.md) | Reusable starting points for skills and agents |
| [examples/](examples/README.md) | Synthetic, reproducible examples |
| [hooks/](hooks/outbound.json) | The push/post guard pattern list and hook script |
| [adapters/](docs/harness-adapters.md) | Generated harness adapters (never edited by hand) |
| [docs/](docs/README.md) | Usage guidance and decisions |
| [task.md](task.md) | Setup and squad refinement backlog organized around workflow outputs and handoffs |

## Knowledge-base index

| Item | Purpose | Status | Verification evidence |
| --- | --- | --- | --- |
| [Autonomous Agent Development: One-Month Learning Plan](docs/autonomous-agents/README.md) | Guide one month of learning and practical preparation through a bounded agent capstone | Draft | Structure and references reviewed 2026-09-24; not yet completed or tested by a learner |
| [Tool and authentication preflight](docs/tool-preflight.md) | Check tool availability, existing connections, target identity and authentication methods before service access | Draft | Instructions and synthetic acceptance scenarios reviewed 2026-11-08; no live authentication flow tested |
| [Tool and agent transaction contracts](docs/tool-contracts.md) | Define tool/helper boundaries and portable agent messages with executable offline validation | Draft | T09: 42 offline checks, 17 setup tests, schema parity and separate code/QA/security review passed; live harness bridges and A2A interoperability unverified |
| [Guided terminal setup](docs/guided-setup.md) | Select harnesses and targets, review and apply local snapshots with overwrite backups | Draft | Synthetic filesystem acceptance checks; live harness activation unverified |
| [ECC reference comparison](docs/reference-comparison.md) | Compare pinned ECC source and improve requirements, development and review guidance | Draft | Pinned source comparison, W1–W8 manual contract review, separate document/source approval and structural checks; runtime effectiveness unverified |
| [Harness behavior](docs/harness-behavior.md) | Four-harness capability map, source evidence, relay fallback and live-check gaps | Draft | OpenCode v2.2.6 config and all 16 profiles loaded in VM; T07 closed at maintainer request on 2026-11-14; live acceptance and independent QA remain deferred |
| [Project coordination](docs/project-coordination.md) | One canonical task record, six-section developer handoffs, assignments, consultation and review/release decisions | Draft | T27 fictional walkthrough; T06 [local demo](examples/project-coordination/demo/README.md) and [execution record](examples/project-coordination/run.md) track actual checks; cross-harness behavior remains unverified |
| [Quickstart and recovery](docs/quickstart-recovery.md) | First run, symptom-based troubleshooting and manual update, restore and removal | Draft | Disposable walkthrough evidence recorded in the guide; live harness behavior unverified |
| [Environment check report](docs/environment-check.md) | Specify doctor reporting for tools, adapters, permissions and live sign-in with an offline fallback | Draft | Report contract and synthetic scenario review; no executable collector or live sign-in test |
| [Project-private configuration](docs/private-configuration.md) | Keep project targets and remembered common preferences local, using credential references only | Draft | Synthetic JSON, ignore and setup-preservation checks; no executable loader or live sign-in |
| [Offline validation specification](docs/offline-validation.md) | Define isolated synthetic checks, fixtures, reporting and failure/incomplete exit rules | Draft | Markdown/JSON contract review and existing checks; no validation runner or executed catalog results |

## Skill index

Record every skill here with its name, relative link, purpose, status and verification evidence. A skill lives in a dedicated subfolder of its category with a `SKILL.md` entry point.

| Skill | Purpose | Status | Evidence |
| --- | --- | --- | --- |
| [construct](skills/shared/construct/SKILL.md) | Prime directives and crew loaded at the start of a session | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [learn-from-fixes](skills/shared/learn-from-fixes/SKILL.md) | Turn merged fixes into guidance gaps, and audit local rules against the docs | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [til](skills/shared/til/SKILL.md) | Capture a learning note into the user's own folder, shaped for a future blog post | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [weekly-digest](skills/shared/weekly-digest/SKILL.md) | Config-driven weekly digest, one line per item with a link | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [plain-voice](skills/communication/plain-voice/SKILL.md) | Teammate-to-teammate writing style for comments, reviews and updates | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [feature-doc](skills/developer/feature-doc/SKILL.md) | Visual feature documentation: Mermaid maps, files, flags, tests, follow-ups | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [pre-push-review](skills/developer/pre-push-review/SKILL.md) | Branch self-review, split check, description and commit message drafts | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [git-workflow](skills/developer/git-workflow/SKILL.md) | Git inspection, focused commits, branching, rebasing, conflict resolution, recovery and publication safeguards | Draft | Instructions and cross-references reviewed 2026-11-08; not yet verified end to end in a documented example |
| [code-review](skills/developer/code-review/SKILL.md) | Review one pull or merge request: quick and full passes, draft replies, never posts | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [review-queue](skills/developer/review-queue/SKILL.md) | Token-lean loop over a whole review queue via a fetch-and-trim helper | Draft | Helper contract verified in examples/review-queue (pure-git run, 2026-10-10); forge flow not yet exercised |
| [product-manager-thinking](skills/shared/product-manager-thinking/SKILL.md) | Evidence-led product reasoning for engineering decisions | Draft | Existing instructions and synthetic examples inspected 2026-11-08; practical use not verified |
| [product-discovery](skills/shared/product-discovery/SKILL.md) | Audience, alternatives, demand experiments and MVP boundaries | Draft | Independently written from generic role requirements 2026-11-08; no research sessions run |
| [business-model](skills/shared/business-model/SKILL.md) | Synthetic pricing, cost scenarios, unit economics and commercial risks | Draft | Synthetic arithmetic checked 2026-11-08; no real business viability validated |
| [ux-validation](skills/developer/ux-validation/SKILL.md) | User flows, interaction states and usability validation | Draft | Procedure reviewed 2026-11-08; no participant sessions or accessibility audit run |
| [architecture-decision](skills/developer/architecture-decision/SKILL.md) | Compare technical options and record contracts and tradeoffs | Draft | Procedure reviewed 2026-11-08; no implemented architecture verified |
| [ai-evaluation](skills/developer/ai-evaluation/SKILL.md) | Quality, safety, latency and cost evaluation against a baseline | Draft | Procedure reviewed 2026-11-08; no provider experiments run |

The construct, code-review, pre-push-review, learn-from-fixes and feature-doc procedures were extended with employer-neutral evidence, authorization and verification guidance on 2026-11-08. Review and adapter checks do not establish practical skill effectiveness; their status remains Draft.

## Agent index

Record every agent here with its name, relative link, purpose, status and verification evidence. The source format is the Claude Code agent format; adapters for other harnesses are generated, never edited by hand.

| Agent | Purpose | Status | Evidence |
| --- | --- | --- | --- |
| [reviewer (Smith)](agents/reviewer.md) | Maintainer-grade review of a change; read-only, never posts | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [planner (Architect)](agents/planner.md) | Break large work into small reviewable changes; plans and drafts only | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [product-manager (Oracle)](agents/product-manager.md) | Release scope, cut list and capacity plan; verifies claims in code | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [mentor (Morpheus)](agents/mentor.md) | Teaching an unfamiliar layer or testing strategy | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [delivery-lead (Nexus)](agents/delivery-lead.md) | Engineering manager: write approved coordination records; assign, integrate, review/rework and escalate within the agreed task | Draft | Written from the research note's Delivery Coordinator / Orchestrator role; not yet verified in a documented example |
| [qa-verifier (Sentinel)](agents/qa-verifier.md) | Independent verification: risk-based checks, acceptance evidence from requirements, exploratory verification, defect report | Draft | Written from the research note's QA Engineer role; not yet verified in a documented example |
| [security-privacy (Warden)](agents/security-privacy.md) | Threat model, identity and access, secrets, encryption, data lifecycle, dependency/license and incident risk for product and agents | Draft | Written from the research note's Security and Privacy Owner role; not yet verified in a documented example |
| [release-operations (Atlas)](agents/release-operations.md) | Deployment, rollback, backups and recovery, CI/CD, hosting, monitoring, alerts, incidents and runbooks | Draft | Written from the research note's DevOps/Release and Operations/Support roles; not yet verified in a documented example |
| [product-strategist (Compass)](agents/product-strategist.md) | Product purpose, audience, discovery, demand and MVP boundaries | Draft | Role instructions reviewed 2026-11-08; no practical run |
| [business-owner (Ledger)](agents/business-owner.md) | Pricing, synthetic economics, ownership and commercial risk recommendations | Draft | Role instructions reviewed 2026-11-08; no practical run |
| [ux-designer (Prism)](agents/ux-designer.md) | Accessible user flows, prototype states and usability evidence | Draft | Role instructions reviewed 2026-11-08; no practical run |
| [software-architect (Merovingian)](agents/software-architect.md) | Technical options, boundaries, contracts and architecture decisions | Draft | Role instructions reviewed 2026-11-08; no practical run |
| [software-engineer (Trinity)](agents/software-engineer.md) | Bounded local implementation, integrity, failure handling and tests | Draft | Role instructions reviewed 2026-11-08; no practical run |
| [ai-engineer (Sparks)](agents/ai-engineer.md) | AI necessity, evaluation, context, cost and safety | Draft | Role instructions reviewed 2026-11-08; no provider experiments run |
| [technical-writer (Mouse)](agents/technical-writer.md) | Release-accurate onboarding, usage, API and recovery documentation | Draft | Role instructions reviewed 2026-11-08; no product walkthrough run |
| [marketing-sales (Switch)](agents/marketing-sales.md) | Positioning, acquisition experiments, launch drafts and adoption measures | Draft | Role instructions reviewed 2026-11-08; no campaigns run |

Existing product-manager, delivery-lead, security-privacy, qa-verifier, reviewer and release-operations instructions were extended against the generic role requirements on 2026-11-08. The combined release-operations role covers both release engineering and ongoing operations/support; these updates do not constitute practical verification.

T08 adds the [pinned ECC comparison](docs/reference-comparison.md) and [synthetic requirements-to-review walkthrough](examples/requirements-to-review/README.md). Existing issue/register/assignment templates and product-manager, software-engineer and reviewer guidance now share observable criteria and candidate-specific evidence. Separate source/document review and structural checks establish documentation consistency; practical effectiveness remains unverified and all roles remain Draft.

T27 adds the [project coordination contract](docs/project-coordination.md), reusable register/assignment templates and a synthetic workflow. Existing product-manager, delivery-lead, planner, software-engineer, reviewer, qa-verifier, ux-designer, release-operations, security-privacy and construct instructions now share its ownership and consultation rules. T06 adds one canonical task location, project-local remembered preference and six-section developer handoffs at progress and completion. Its [local demo](examples/project-coordination/demo/README.md) and [execution record](examples/project-coordination/run.md) separate observed checks from pending work. General and cross-harness behavior remains Draft; documentation or adapter checks alone do not verify orchestration.

## Status definitions

| Status | Meaning |
| --- | --- |
| Idea | A possible direction, not ready for use |
| Draft | Written material awaiting practical verification |
| Tested | Verified in a stated example or context, with evidence and limits recorded |
| Stable | Repeatedly useful within a clear scope, with dependable instructions and known limits |

A status describes evidence, not ambition. Record the tested context and date; revise status when evidence changes. Public-content review is required at every status.

## Public-content requirements

Use original, employer-neutral material. Do not copy personal Life Hub notes directly. Exclude health, family, finance, schedule, promotion, performance, interview and employer-confidential information.

Do not include internal GitLab links, discussions, screenshots, customer information, unreleased features or private architecture. This applies equally to files, history, issues, pull requests, logs and attachments.

Generic knowledge informed by private experience must be written independently, using synthetic examples, and reviewed before publication. Removing names alone is insufficient. Check context, examples, URLs and metadata for identifying details. Cite permitted public sources where relevant and respect their terms.

Scan every proposed file and the complete staged diff for secrets and private information before pushing. Report a suspected secret by location and type, never by value. Stop publication until any suspicion is resolved. Do not use real credentials in examples.

No software licence is selected. Record the choice below before adding a licence file or claiming open-source licensing.

## Work-to-GitHub synchronisation rules

Use [git-workflow](skills/developer/git-workflow/SKILL.md) for the reusable procedure. The repository-specific rules below remain mandatory, including the prohibition on force-pushing.

1. GitHub is the shared published record for Construct. Local or AI-assisted drafts remain drafts until reviewed and committed.
2. Confirm the remote owner, repository and branch. Fetch and inspect remote changes before editing; reconcile conflicts deliberately.
3. Bring across only independently written, reviewed, employer-neutral content. Never mirror private folders, workspaces, logs or employer repositories.
4. Make one coherent change, update the relevant indexes and status, and verify links and examples. Review all staged content, including new files and metadata.
5. Run secret and privacy checks. Commit with a factual message; inspect the commit before pushing. Publish only within explicit user authorisation.
6. Use an ordinary push or reviewed pull request. Never force-push or overwrite remote history to resolve a mismatch. Stop and inspect unexpected changes.
7. Verify the remote commit and expected files after publication. A local save or an AI completion message is not proof of synchronisation.

No automatic synchronisation is configured. Private source systems retain their own ownership and rules.

## Open decisions

- Which software licence, if any, should apply?
- Is a lightweight automated validation check useful once runnable examples exist?
- Are separate frontend/backend or release/support specializations useful after the general roles have practical evidence? The current general implementer is software-engineer (Trinity); no additional implementer trio is implied.

The current outcome is the usable repository structure and its boundaries. Additional tooling is not required to begin.
