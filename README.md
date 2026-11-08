# Construct

> "This is the Construct. It's our loading program."

A collection of employer-neutral skills, specialist agent instructions and working methods for AI-assisted software work, with generated adapters for Claude Code, OpenCode, pi and Codex.

Construct helps an agent choose a procedure, use the permitted tools and hand useful evidence to the next role. It covers product discovery through implementation, review, release planning, documentation and learning. The host harness provides execution, tool access and agent communication; those capabilities vary by harness.

## What is here

| Item | Purpose |
| --- | --- |
| [16 skills](construct.md#skill-index) | Reusable procedures for product and technical decisions, Git, review, documentation, learning and clear writing |
| [16 agents](agents/README.md) | Bounded specialist roles, including delivery coordination, implementation, independent QA and review |
| [Harness adapters](docs/harness-adapters.md) | Generated skills, agent profiles, commands and guard configuration for the four supported harnesses |
| [Tool and authentication preflight](docs/tool-preflight.md) | Check availability, existing connections, the target host/account and the authentication method before service access |
| [Templates](templates/README.md) and [examples](examples/README.md) | Document starting points and a runnable synthetic review-queue helper |
| [Refinement backlog](task.md) | 26 tasks covering initial setup, squad coordination and complete workflow reviews |

Skills describe **how to work**, agents define **who owns a bounded responsibility**, and tools perform **specific actions**. Tool availability and authentication come from the harness and local environment; installing the instructions does not install every external CLI or connect an account.

## Getting started

1. Read [construct.md](construct.md) for scope, indexes and status definitions, and [AGENTS.md](AGENTS.md) before making changes.
2. Run `npm run setup` for [guided terminal setup](docs/guided-setup.md): select harnesses and targets, review a snapshot plan, then approve installation and backed-up overwrites. The [manual installation guide](docs/harness-adapters.md#installing-each-harness) remains available.
3. Load the [construct skill](skills/shared/construct/SKILL.md), then select the skills and specialist roles needed for one bounded task.
4. Follow [tool preflight](docs/tool-preflight.md) before external-service access: check the tool, inspect any existing connection, identify its target and authentication source, and ask for the method when missing or unclear. Never request secret values in chat.
5. Try the [synthetic review-queue walkthrough](examples/review-queue/README.md) in a disposable repository, or choose a workflow from [task.md](task.md). Offline checks leave live connection validity unverified.

The queue walkthrough needs Bash and Git. Adapter generation/checking needs Node.js and npm; the shell push/post guard needs `jq`. External-service workflows need their corresponding CLI or connector and suitable authentication.

## Working as a squad

Review complete workflows through their inputs, participating agents, skills, tools, handoffs and observable outputs. For example, product-manager defines acceptance criteria, planner breaks the work into small changes, software-engineer implements an assigned change, and reviewer and qa-verifier provide findings and acceptance evidence. Delivery-lead coordinates ownership and dependencies where needed.

For each output, ask: **Is this enough? What should we add, remove or simplify?** Use the answer to refine the relevant instructions. The [backlog](task.md) includes both agent-led and skill-led reviews, plus a planned comparison with Everything Claude Code after confirming its source and version.

Squad orchestration, direct peer messaging and shared state depend on harness capabilities. The backlog tracks their verification and coordinator-mediated alternatives; end-to-end behavior across all four harnesses remains unverified. Guided snapshot setup is available with offline filesystem checks; live harness activation remains unverified. `doctor`, private local configuration and a general `validate` command are planned work.

## Checks and maintenance

From the repository root:

```sh
npm run check
```

This checks whether generated adapters and links match the canonical sources. After changing skill, agent or guard sources, regenerate and check them:

```sh
npm run build
npm run check
```

Edit canonical sources under `skills/`, `agents/` and `hooks/`; adapters are generated. A passing adapter check establishes structural consistency. Workflow effectiveness, command contracts and authentication behavior need their own evidence; the broader offline validation suite is planned in [task.md](task.md).

## Status and boundaries

All 16 skills and 16 agent profiles are currently **Draft**. The [skill index](construct.md#skill-index) and [agent index](construct.md#agent-index) record the available evidence and limits. The review-queue helper has a documented synthetic local example; live forge behavior and full harness parity have not been established.

Most agents advise read-only. Software-engineer and technical-writer can make assigned local changes; planner can write requested plans. Posting, pushing, spending and deployment require explicit authorization. The guard covers known push/post patterns and prompts or blocks according to the harness; it does not replace the working rules.

Keep credentials, personal notes and employer-confidential material outside this public repository. There is no automatic synchronization with private knowledge systems. Use [git-workflow](skills/developer/git-workflow/SKILL.md) for Git operations and [pre-push-review](skills/developer/pre-push-review/SKILL.md) for branch readiness and description drafts.

No software licence has been selected. Public visibility does not grant an open-source licence.
