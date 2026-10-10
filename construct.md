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
| [skills/architect/](skills/architect/README.md) | Design and architecture methods |
| [skills/developer/](skills/developer/README.md) | Implementation and verification methods |
| [skills/researcher/](skills/researcher/README.md) | Research and evidence methods |
| [skills/communication/](skills/communication/README.md) | Clear writing and communication methods |
| [skills/shared/](skills/shared/README.md) | Methods useful across roles |
| [agents/](agents/README.md) | Bounded agent instructions |
| [docs/](docs/README.md) | Usage guidance, learning plans and decisions |
| [templates/](templates/README.md) | Reusable starting points |
| [examples/](examples/README.md) | Synthetic, reproducible examples |

## Knowledge-base index

| Item | Purpose | Status | Verification evidence |
| --- | --- | --- | --- |
| [Autonomous Agent Development: One-Month Learning Plan](docs/autonomous-agents/README.md) | Guide one month of learning and practical preparation through a bounded agent capstone | Draft | Structure and references reviewed 2026-09-24; not yet completed or tested by a learner |

## Skill index

Record every skill here with its name, relative link, purpose, status and verification evidence. A skill lives in a dedicated subfolder of its category with a `SKILL.md` entry point.

| Skill | Purpose | Status | Evidence |
| --- | --- | --- | --- |
| [construct](skills/shared/construct/SKILL.md) | Prime directives and crew loaded at the start of a session | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [learn-from-fixes](skills/shared/learn-from-fixes/SKILL.md) | Turn merged fixes into guidance gaps, and audit local rules against the docs | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [til](skills/shared/til/SKILL.md) | Capture a learning note into the user's own folder, shaped for a future blog post | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [plain-voice](skills/communication/plain-voice/SKILL.md) | Teammate-to-teammate writing style for comments, reviews and updates | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [feature-doc](skills/developer/feature-doc/SKILL.md) | Visual feature documentation: Mermaid maps, files, flags, tests, follow-ups | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |
| [pre-push-review](skills/developer/pre-push-review/SKILL.md) | Branch self-review, split check, description and commit message drafts | Draft | Rewritten employer-neutral from working practice; not yet verified in a documented example |

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
- Should the implementer crew (Trinity, Neo, Tank) be generalized once the four current agents prove useful?

The current outcome is the usable repository structure and its boundaries. Additional tooling is not required to begin.
