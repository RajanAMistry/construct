# Autonomous Agent Development: One-Month Learning Plan

**Status:** Draft  
**Duration:** Four weeks  
**Purpose:** Build enough practical knowledge to design, implement and evaluate one bounded autonomous agent safely.

This is an evidence plan, not a promise of production readiness. Complete one small artifact at a time and record what was actually tested.

## Target outcome

At the end of the month, produce a small agent that can:

- accept a clearly bounded task;
- choose and call a small set of well-defined tools;
- inspect tool results and continue through an explicit control loop;
- stop on completion, uncertainty, failure or a fixed budget;
- require approval before consequential actions;
- expose traces and useful errors;
- pass a repeatable evaluation set; and
- explain its architecture, limits, risks and operating cost.

Prefer a workflow when the steps are known. Use an autonomous loop only where the next step genuinely depends on new evidence.

## Suggested commitment

Use five focused sessions per week:

- Four sessions of 45–60 minutes for learning and implementation.
- One session of 60–90 minutes for review, evaluation and knowledge-base updates.

Reduce the number of tasks if necessary; preserve the weekly deliverable.

## Knowledge-base map

Create notes only when they help implement or evaluate the project.

| Note | Question it must answer | Evidence |
| --- | --- | --- |
| agent-vs-workflow.md | Why is autonomy needed here? | Decision with rejected simpler option |
| agent-loop.md | How does the loop continue and stop? | State diagram or pseudocode |
| tool-design.md | What can each tool do, return and change? | Schemas plus tests |
| context-and-memory.md | What information enters each turn? | Context inventory and limits |
| safety-boundaries.md | Which actions need denial or approval? | Threat cases and controls |
| evaluation.md | How will quality and regressions be measured? | Dataset, rubric and results |
| observability.md | How will a failed run be understood? | Trace and redacted log example |
| capstone.md | What was built and learned? | Architecture, demo and limitations |

Use [the learning-note template](../../templates/learning-note.md). Each note should contain a claim, source or experiment, application, uncertainty and next test.

## Week 1 — Foundations and bounded design

**Outcome:** a single-agent workflow with no external side effects and a written project brief.

### Learn

- [ ] Distinguish a fixed workflow from an agent that chooses its next action.
- [ ] Understand the basic loop: observe, decide, act, inspect and stop.
- [ ] Learn structured model output and schema validation.
- [ ] Learn function/tool calling and why tool descriptions are part of the interface.
- [ ] Understand nondeterminism, token/context limits, latency and cost.
- [ ] Define completion, failure, escalation and maximum-step conditions.

### Build

- [ ] Choose one synthetic, employer-neutral capstone problem.
- [ ] Write the user, problem, success measure and excluded scope.
- [ ] Implement one model call that returns validated structured output.
- [ ] Add one read-only deterministic tool over synthetic or public data.
- [ ] Record inputs, outputs, duration and errors without secrets.
- [ ] Write five normal cases and five failure or ambiguity cases.

### Weekly evidence

- [ ] Project brief.
- [ ] Agent-versus-workflow decision.
- [ ] Runnable single-step prototype.
- [ ] Ten-case starter evaluation set.
- [ ] Week-one learning review.

## Week 2 — Tool use, state and reliable control

**Outcome:** a bounded multi-step agent loop with tested tools and stopping rules.

### Learn

- [ ] Design narrow tools with explicit input and output schemas.
- [ ] Separate model decisions from deterministic application logic.
- [ ] Understand retries, timeouts, idempotency and partial failure.
- [ ] Manage short-term state without treating model text as authoritative state.
- [ ] Curate context: instructions, tool results, retrieved facts and history.
- [ ] Treat retrieved or tool-returned content as untrusted data.

### Build

- [ ] Add two or three tools; keep them read-only unless mutation is essential.
- [ ] Implement a maximum step, token or cost budget.
- [ ] Add timeout, retry and cancellation behaviour.
- [ ] Validate every tool input before execution.
- [ ] Return concise, actionable tool errors.
- [ ] Persist resumable state separately from conversational prose.
- [ ] Test duplicate calls, empty results, invalid arguments and unavailable tools.

### Weekly evidence

- [ ] Agent-loop diagram.
- [ ] Tool catalogue with permissions and side effects.
- [ ] Automated tool-contract tests.
- [ ] Trace of one successful and one failed run.
- [ ] Updated evaluation results.

## Week 3 — Safety, evaluation and observability

**Outcome:** an agent whose failures, permissions and quality can be assessed.

### Learn

- [ ] Study prompt injection, insecure output handling and excessive agency.
- [ ] Apply least privilege to tools, data and credentials.
- [ ] Decide which actions require human approval.
- [ ] Separate functional tests, trajectory checks and outcome evaluation.
- [ ] Build evaluation cases from expected use, edge cases and adversarial inputs.
- [ ] Understand traces, spans, redaction and privacy-safe diagnostics.

### Build

- [ ] Add input, tool and output validation at the correct boundaries.
- [ ] Deny access outside the capstone's declared scope.
- [ ] Require explicit approval for any external write or irreversible action.
- [ ] Prevent secrets and sensitive content from entering logs or fixtures.
- [ ] Create at least 20 evaluation cases with expected outcomes.
- [ ] Define a rubric for correctness, safety, efficiency and escalation.
- [ ] Record success rate, common failure classes, steps, latency and approximate cost.
- [ ] Fix one measured failure and rerun the unchanged evaluation set.

### Weekly evidence

- [ ] Threat model and permission table.
- [ ] Approval and stopping policy.
- [ ] Versioned evaluation set and rubric.
- [ ] Before-and-after evaluation report.
- [ ] Redacted trace demonstrating diagnosis.

## Week 4 — Capstone hardening and communication

**Outcome:** a demonstrable agent and an honest readiness assessment.

### Learn

- [ ] Compare a single-agent design with routing, specialists and handoffs.
- [ ] Add multi-agent orchestration only if evaluation shows a concrete benefit.
- [ ] Understand deployment concerns: concurrency, quotas, persistence and monitoring.
- [ ] Plan safe change management for prompts, models, tools and schemas.
- [ ] Practise explaining value, limits and risk to a non-specialist.

### Build

- [ ] Freeze the capstone scope and acceptance criteria.
- [ ] Run the complete evaluation set from a clean environment.
- [ ] Test interruption, resumption and repeated execution.
- [ ] Verify all consequential actions have an approval boundary.
- [ ] Document setup, configuration, architecture and troubleshooting.
- [ ] Record known limitations and cases that must be escalated to a human.
- [ ] Produce a five-minute demo using synthetic or public data.
- [ ] Decide: stop, revise, or continue toward a production pilot.

### Final evidence

- [ ] Runnable capstone.
- [ ] Architecture and data-flow diagram.
- [ ] Tool and permission inventory.
- [ ] Evaluation report with failures included.
- [ ] Safety and privacy review.
- [ ] Operations and rollback notes.
- [ ] Demo and concise retrospective.
- [ ] Next 30-day learning decision.

## Recommended capstone constraints

Choose a task with verifiable outcomes, such as organising a synthetic issue backlog, researching public technical sources into a structured brief, or checking a sample repository against an explicit policy.

Keep the first capstone:

- single-user and single-agent;
- limited to three tools;
- read-only by default;
- restricted to synthetic or public data;
- executable in under ten steps per run;
- protected by a hard cost or token budget; and
- evaluated offline before any external action.

Do not begin with financial transactions, production infrastructure, health decisions, private communications, broad computer control or unsupervised external writes.

## Readiness check

The month is complete when every answer below is supported by an artifact or test:

- [ ] Can I explain why this use case needs an agent rather than a simpler workflow?
- [ ] Can I draw the control loop and identify every stopping condition?
- [ ] Can I state what each tool may read or change?
- [ ] Can I reproduce and diagnose a failed run?
- [ ] Can I measure outcome quality across a fixed evaluation set?
- [ ] Can I show how prompt injection and excessive agency are constrained?
- [ ] Can I identify where human approval is mandatory?
- [ ] Can another developer run the project from the documentation?
- [ ] Can I describe remaining uncertainty without overstating readiness?

If any answer is unsupported, keep the project at Draft status.

## Primary references

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK testing](https://openai.github.io/openai-agents-python/testing/)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

Framework documentation is implementation guidance, not a requirement to adopt that framework. Recheck changing APIs before implementation.
