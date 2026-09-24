# Autonomous Agent Development — One-Month Learning Checklist

**Status:** Draft  
**Duration:** 4 weeks, 20 focused learning days  
**Suggested effort:** 60–90 minutes per weekday, plus an optional two-hour weekend review  
**Goal:** Learn the foundations of autonomous-agent development and build one small, bounded, evaluated agent using public or synthetic data.

This checklist is deliberately practical. Reading is complete only when it changes an artifact, implementation, test, or decision.

## Result expected after one month

By the end of the month, you should be able to:

- explain the difference between an LLM call, workflow and autonomous agent;
- decide when autonomy is justified and when deterministic code is safer;
- implement a bounded observe–decide–act–inspect loop;
- define narrow tools with validated inputs, outputs and permissions;
- manage context, working state, session history and retrieval deliberately;
- set stopping conditions and budgets for turns, tokens, time and cost;
- pause for human approval before consequential actions;
- defend against prompt injection, excessive agency and unsafe tool output;
- trace a run and diagnose why it succeeded or failed;
- create repeatable functional, behavioral and safety evaluations;
- communicate the system's architecture, limitations and remaining risk; and
- demonstrate one working capstone without claiming production readiness.

## Default capstone

Build a **public-repository review agent**. It receives a small public or synthetic repository and an explicit policy, inspects relevant files, and produces a structured review with evidence.

The first version has only three read-only tools:

1. `list_files(path)` — list files below an allowed root.
2. `read_file(path, start_line, end_line)` — read bounded text from an allowed root.
3. `search_text(query, allowed_paths)` — find matching text within the allowed root.

It must not modify files, execute repository code, access credentials, browse arbitrary URLs or leave the permitted workspace. This task is useful for learning because results can be checked against known files and policy rules.

If you choose another capstone, keep the same boundaries: one user, one agent, no more than three initial tools, public or synthetic data, read-only by default, fewer than ten turns per run, and objectively checkable outcomes.

## Learning method

For every topic:

- **Understand:** explain the idea in your own words.
- **Apply:** make a small implementation or design change.
- **Test:** run a normal, edge or adversarial case.
- **Record:** save evidence and uncertainty.
- **Review:** decide whether the result is sufficient to continue.

Create a short learning note containing:

```text
Question:
Current understanding:
Primary source or experiment:
What I implemented:
Expected result:
Observed result:
Failure or uncertainty:
Decision and next test:
```

Do not store API keys, private prompts, personal data, private repositories or raw sensitive traces in the knowledge base.

---

## Week 1 — Foundations: from model call to bounded agent

**Weekly outcome:** a written project brief, ten evaluation cases, one structured model call and one read-only tool.

### Day 1 — Define agents and choose the simplest suitable system

**Learn**

- [ ] Define an LLM application: a program that sends input to a model and uses its output.
- [ ] Define a workflow: code controls a known sequence of model and tool steps.
- [ ] Define an agent: the model chooses some next actions or tools based on the state it observes.
- [ ] Understand the autonomy trade-off: flexibility increases cost, latency and the opportunity for compounding errors.
- [ ] Learn why a single prompt or deterministic workflow should be preferred when it meets the requirement.

**Read**

- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents): focus on “When and when not to use agents” and the workflow/agent distinction.
- [OpenAI Agents SDK overview](https://openai.github.io/openai-agents-python/): scan the primitives—agents, tools, handoffs, guardrails, sessions and tracing.

**Apply**

- [ ] Write a one-paragraph user problem for the capstone.
- [ ] Define the user, input, desired output and evidence of correctness.
- [ ] List a non-agent solution and a fixed-workflow solution.
- [ ] Write why limited model-directed tool selection adds value.
- [ ] Record what is explicitly out of scope.

**Deliverable**

- [ ] `agent-vs-workflow.md` with the selected approach and rejected simpler alternatives.

**Done when**

- [ ] Another developer can explain why the chosen task needs limited autonomy.
- [ ] The decision contains a condition that would cause you to replace the agent with a workflow.

### Day 2 — Understand the model interface and structured output

**Learn**

- [ ] Separate system/developer instructions, user input, tool results and final output.
- [ ] Understand that model output is untrusted until parsed and validated.
- [ ] Learn JSON Schema or a typed validation library such as Pydantic.
- [ ] Understand schema validation, semantic validation and business-rule validation.
- [ ] Learn why free-form text should not directly control privileged application behavior.

**Read**

- [OpenAI — Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [OpenAI Agents SDK — Agents](https://openai.github.io/openai-agents-python/agents/): review instructions and `output_type`.

**Build**

- [ ] Define a typed `ReviewFinding` with rule ID, severity, file, line, explanation and confidence.
- [ ] Define a typed final result with findings, files inspected, unresolved questions and completion status.
- [ ] Make one model request that returns this structure.
- [ ] Reject malformed output instead of silently accepting partial fields.
- [ ] Add semantic checks: valid severity, permitted path and positive line number.

**Test**

- [ ] Valid complete output.
- [ ] Missing required field.
- [ ] Unknown severity.
- [ ] Path outside the allowed root.
- [ ] Unsupported completion status.

**Deliverable**

- [ ] Schema, validation code and five validation tests.

### Day 3 — Design instructions and task contracts

**Learn**

- [ ] Write instructions around role, objective, permitted actions, evidence rules, stopping rules and output contract.
- [ ] Separate durable instructions from task-specific input.
- [ ] Avoid hiding application logic in long prompts.
- [ ] Define what the agent must do when evidence is insufficient.
- [ ] Require citations to tool results rather than unsupported claims.

**Read**

- [OpenAI — Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

**Build**

- [ ] Write version 1 of the agent instructions.
- [ ] Add explicit permitted and prohibited actions.
- [ ] Add “do not claim a finding without file and line evidence.”
- [ ] Add “return unresolved when required evidence is unavailable.”
- [ ] Add a maximum scope: one policy and one allowed repository root per run.

**Test**

- [ ] Clear task.
- [ ] Ambiguous task.
- [ ] User asks for an unsupported action.
- [ ] User asks the agent to ignore its evidence requirement.
- [ ] Required file does not exist.

**Deliverable**

- [ ] `instructions-v1.md` plus observations from five runs.

### Day 4 — Build the first deterministic read-only tool

**Learn**

- [ ] Treat a tool as a contract between a nondeterministic model and deterministic software.
- [ ] Use a narrow name, explicit description and validated schema.
- [ ] Return only the information needed for the next decision.
- [ ] Distinguish tool errors from empty successful results.
- [ ] Enforce authorization inside the tool, not in prompt wording alone.

**Read**

- [OpenAI Agents SDK — Tools](https://openai.github.io/openai-agents-python/tools/)
- [Anthropic — Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)

**Build**

- [ ] Implement `list_files(path)`.
- [ ] Resolve paths against one fixed allowed root.
- [ ] Reject absolute paths, parent traversal and symbolic-link escape.
- [ ] Bound result count and returned text size.
- [ ] Return structured success and error results.
- [ ] Write a description stating when the agent should and should not call it.

**Test**

- [ ] Valid directory.
- [ ] Empty directory.
- [ ] Missing directory.
- [ ] `../` traversal attempt.
- [ ] Absolute-path attempt.
- [ ] Directory containing more results than the limit.

**Deliverable**

- [ ] Tool contract and automated tests.

### Day 5 — Establish evaluation before adding autonomy

**Learn**

- [ ] Distinguish unit tests, integration tests, agent trajectory checks and outcome evaluations.
- [ ] Build evaluations from expected use, edge cases and adversarial cases.
- [ ] Keep the evaluation inputs stable while comparing changes.
- [ ] Record failure categories, not only one aggregate score.
- [ ] Avoid changing the test set merely to make a new version look better.

**Read**

- [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI Agents SDK — Testing](https://openai.github.io/openai-agents-python/testing/)
- [OpenAI — Evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices)

**Build**

- [ ] Create five straightforward evaluation tasks with known expected findings.
- [ ] Create three ambiguity or missing-evidence tasks.
- [ ] Create two adversarial tasks.
- [ ] Define pass, partial-pass and fail criteria.
- [ ] Capture output correctness, unsupported claims, tools used, turns, latency and token usage.

**Weekly review**

- [ ] Run all ten cases.
- [ ] Record every failure without fixing the expected result after seeing the output.
- [ ] Write the top three lessons from Week 1.
- [ ] Decide whether the problem still justifies an agent.

---

## Week 2 — Agent loop, tools, context and state

**Weekly outcome:** a bounded multi-step loop using three tested read-only tools, explicit state and reliable stopping behavior.

### Day 6 — Implement the agent loop

**Learn**

A minimal loop is:

```text
receive task
validate scope
repeat until stopped:
    assemble minimum useful context
    ask model for next action
    validate action
    execute permitted tool or produce answer
    add observation to state
    check completion and budgets
return result or explicit incomplete status
```

- [ ] Identify who controls each transition: application, model or human.
- [ ] Define terminal states: completed, incomplete, denied, failed, cancelled and budget-exhausted.
- [ ] Understand why the model must not decide whether hard limits apply.
- [ ] Prevent an empty or repeated plan from looping forever.

**Read**

- [OpenAI Agents SDK — Running agents](https://openai.github.io/openai-agents-python/running_agents/)
- Revisit [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), especially the agent loop and stopping conditions.

**Build**

- [ ] Implement the loop or configure an SDK runner.
- [ ] Add a hard maximum-turn limit.
- [ ] Add a wall-clock timeout.
- [ ] Add cancellation handling.
- [ ] Add repeated-identical-tool-call detection.
- [ ] Map every terminal condition to a typed result.

**Test**

- [ ] Normal completion.
- [ ] Maximum turns reached.
- [ ] Timeout.
- [ ] User cancellation.
- [ ] Repeated tool call with identical arguments.

### Day 7 — Complete the read-only tool set

**Build**

- [ ] Implement `read_file(path, start_line, end_line)`.
- [ ] Implement `search_text(query, allowed_paths)`.
- [ ] Reuse one central path-authorization function.
- [ ] Limit bytes, lines, matches and execution time.
- [ ] Distinguish binary, unsupported, missing and unreadable files.
- [ ] Include stable error codes that the agent can act upon.
- [ ] Avoid returning secrets or ignored files in the synthetic fixture.

**Test each tool**

- [ ] Valid request.
- [ ] Invalid type or missing argument.
- [ ] Empty result.
- [ ] Limit exceeded.
- [ ] Unauthorized path.
- [ ] Temporary internal failure.
- [ ] Cancellation.

**Deliverable**

- [ ] Tool catalogue with purpose, inputs, outputs, side effects, permissions, limits and error codes.

### Day 8 — Context engineering

**Learn**

- [ ] Context is finite and should contain the smallest useful set of instructions, facts and observations.
- [ ] Separate authoritative application state from conversational history.
- [ ] Prefer just-in-time retrieval over loading every file into the initial prompt.
- [ ] Label untrusted data clearly.
- [ ] Summarization can lose important evidence and must be testable.
- [ ] More context can reduce quality by hiding important instructions or facts.

**Read**

- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

**Build**

- [ ] Create a context inventory: source, owner, trust level, lifetime and size limit.
- [ ] Include policy rules and allowed-root identity as authoritative context.
- [ ] Include only relevant tool results for the current decision.
- [ ] Store evidence references separately from model prose.
- [ ] Add a context-size warning or compaction threshold.
- [ ] Record which context items produced each finding.

**Test**

- [ ] Relevant evidence appears late in a large file.
- [ ] Irrelevant files attempt to distract the agent.
- [ ] A file contains instructions addressed to the model.
- [ ] Two files contain conflicting statements.

### Day 9 — Working state, sessions and memory

**Learn**

- [ ] Working state is the data required to finish one run.
- [ ] Session history connects multiple user turns.
- [ ] Long-term memory is selectively stored information reused across runs.
- [ ] Conversation text is not a safe database or authorization record.
- [ ] Memory requires ownership, retention, deletion and privacy decisions.
- [ ] The first capstone does not need semantic long-term memory.

**Read**

- [OpenAI Agents SDK — Sessions](https://openai.github.io/openai-agents-python/sessions/)
- [OpenAI Agents SDK — Run state](https://openai.github.io/openai-agents-python/ref/run_state/)

**Build**

- [ ] Define typed run state: task, allowed root, inspected files, findings, budgets and status.
- [ ] Decide what is ephemeral, persisted, resumable or never stored.
- [ ] Add run and correlation IDs that contain no private data.
- [ ] Serialize and reload a paused synthetic run.
- [ ] Prevent two workers from resuming the same state simultaneously.
- [ ] Document why long-term memory is deferred.

### Day 10 — Reliability and failure handling

**Learn**

- [ ] Retry only failures that are plausibly temporary.
- [ ] Use exponential backoff and bounded attempts.
- [ ] Understand idempotency before retrying any state-changing tool.
- [ ] Preserve partial results without reporting false completion.
- [ ] Avoid retry storms and hidden infinite recovery loops.
- [ ] Make failure visible to the user with the next safe action.

**Build**

- [ ] Classify errors as invalid request, denied, not found, temporary, rate limited, cancelled or internal.
- [ ] Define which classes are retryable.
- [ ] Add bounded backoff with jitter for a simulated temporary error.
- [ ] Propagate cancellation through model and tool operations.
- [ ] Return a partial result with inspected and uninspected scope.
- [ ] Add a circuit-breaker or stop rule for repeated provider failure.

**Weekly review**

- [ ] Run the evaluation set three times to observe nondeterminism.
- [ ] Add five cases covering tool and loop failures.
- [ ] Compare correctness, steps, latency and token use.
- [ ] Document one reliability improvement backed by measurements.
- [ ] Draw the final Week 2 state-transition diagram.

---

## Week 3 — Security, human control, observability and evaluation

**Weekly outcome:** a threat model, approval design, traceable execution and at least twenty repeatable evaluations.

### Day 11 — Threat-model the agent

**Learn**

- [ ] Direct prompt injection comes from the user.
- [ ] Indirect prompt injection arrives through files, web pages, tool results or other agents.
- [ ] Excessive agency occurs when a model has unnecessary functionality, permissions or autonomy.
- [ ] Tool output may be malicious, malformed or misleading.
- [ ] Data exfiltration can occur through tool arguments, output, logs or external requests.
- [ ] Resource exhaustion can consume tokens, time, API quota, CPU or storage.

**Read**

- [OWASP — LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP — LLM06:2025 Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

**Build**

- [ ] Draw trust boundaries among user, model, application, tools, repository and logs.
- [ ] List assets: data, credentials, compute budget, output integrity and user trust.
- [ ] Write at least ten threat scenarios.
- [ ] Rate likelihood and impact using a simple low/medium/high scale.
- [ ] Map every high-risk scenario to prevention, detection and recovery.
- [ ] Record residual risk that remains after controls.

### Day 12 — Permissions, sandboxing and least privilege

**Learn**

- [ ] Prompt instructions are not a security boundary.
- [ ] Enforce permissions in deterministic application code.
- [ ] Use capability-specific tools rather than general shell or network access.
- [ ] Constrain filesystem roots, network destinations and credential access.
- [ ] Default-deny unknown actions.
- [ ] Separate the identity of the user, application, agent and external service.

**Build**

- [ ] Create a permission matrix for every tool.
- [ ] Verify the capstone remains read-only.
- [ ] Block shell execution and arbitrary network access.
- [ ] Run against a temporary synthetic fixture.
- [ ] Add quotas for calls, bytes read, matches and elapsed time.
- [ ] Test symlinks, path encoding, oversized files and instruction-like repository content.
- [ ] Confirm failures do not reveal system paths or secrets.

**Deliverable**

- [ ] `safety-boundaries.md` containing the permission matrix and enforcement locations.

### Day 13 — Human-in-the-loop and approval design

**Learn**

- [ ] Human approval is for consequential or uncertain actions, not decoration.
- [ ] The approval display must show the exact tool, arguments, target and likely consequence.
- [ ] Approval must bind to a specific run and call; possession of an ID is not authorization.
- [ ] Rejection must stop or safely redirect execution.
- [ ] Paused state must not be modified by an untrusted client.
- [ ] A resumed action must not execute twice.

**Read**

- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [OpenAI Agents SDK — Guardrails](https://openai.github.io/openai-agents-python/guardrails/)

**Build**

Although the capstone is read-only, add one disabled demonstration tool such as `write_report` to practise approvals safely.

- [ ] Make the demonstration tool require approval on every call.
- [ ] Display exact target, operation and content summary.
- [ ] Support approve, reject, timeout and cancel.
- [ ] Persist and resume paused state.
- [ ] Prevent replay or duplicate execution.
- [ ] Keep the tool disabled outside tests.
- [ ] Add tests proving no write occurs without approval.

### Day 14 — Tracing, logs and operational visibility

**Learn**

- [ ] A trace represents one end-to-end run.
- [ ] Spans represent model turns, tools, validation, approvals and custom operations.
- [ ] Logs should support diagnosis without storing secrets or unnecessary private content.
- [ ] Metrics show trends; traces explain individual runs; evaluations measure behavior.
- [ ] Correlation IDs should connect events without embedding user data.
- [ ] Tracing providers may store content, so retention and redaction must be reviewed.

**Read**

- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)
- [OpenAI Agents SDK — Usage](https://openai.github.io/openai-agents-python/usage/)

**Build**

- [ ] Trace run start/end, model turns, tool calls, validation, approvals and terminal status.
- [ ] Record duration, tokens, tool count, retries and error category.
- [ ] Redact credentials, raw environment variables and sensitive content.
- [ ] Add a test that fails if a known synthetic secret reaches logs.
- [ ] Create one successful and one failed trace.
- [ ] Write a short diagnosis using only the trace and documented behavior.

### Day 15 — Build a useful evaluation suite

**Learn**

Evaluate at multiple layers:

- deterministic tool correctness;
- whether the agent selected an appropriate next action;
- whether the trajectory was safe and efficient;
- whether the final result was correct and evidence-grounded;
- whether the agent stopped or escalated appropriately.

**Build**

- [ ] Expand the suite to at least twenty cases.
- [ ] Include five normal cases.
- [ ] Include five missing, ambiguous or conflicting evidence cases.
- [ ] Include five tool or provider failure cases.
- [ ] Include five adversarial or prompt-injection cases.
- [ ] Define a human-readable rubric for correctness, grounding, safety, efficiency and escalation.
- [ ] Pin fixture versions and record model/configuration identifiers.
- [ ] Run each nondeterministic case at least three times where affordable.
- [ ] Report the distribution, not only the best run.

**Weekly review**

- [ ] Identify the three largest failure classes.
- [ ] Fix one failure without changing its expected result.
- [ ] Rerun the unchanged suite.
- [ ] Record before-and-after results and any regressions.
- [ ] Decide whether the controls justify proceeding to final hardening.

---

## Week 4 — Architecture, orchestration and capstone hardening

**Weekly outcome:** a reproducible capstone, architecture pack, evaluation report and honest readiness decision.

### Day 16 — Architecture and data flow

**Learn**

- [ ] Identify boundaries among interface, agent runtime, model provider, tools, state store, policy and observability.
- [ ] Separate orchestration from domain logic.
- [ ] Make dependencies replaceable where change is likely, without building unnecessary abstraction.
- [ ] Document where data is transmitted, stored, logged and deleted.
- [ ] Define failure ownership and recovery at each boundary.

**Build**

- [ ] Draw a system-context diagram.
- [ ] Draw a run sequence from user request to final result.
- [ ] Mark trust boundaries and external data flows.
- [ ] Record model, framework and storage choices with alternatives.
- [ ] Add two architecture decision records: orchestration approach and state strategy.
- [ ] Document expected operating cost and scale assumptions.

### Day 17 — MCP and interoperable tool design

**Learn**

- [ ] MCP defines a client/server protocol for exposing prompts, resources and tools.
- [ ] Tools are model-controlled actions; resources are application-managed context; prompts are user-selected templates.
- [ ] MCP does not remove the need for authentication, authorization, validation or approval.
- [ ] Remote tool servers add network, identity, availability and supply-chain boundaries.
- [ ] Use MCP only when interoperability is useful; local functions are sufficient for the capstone.

**Read**

- [Model Context Protocol — Server overview](https://modelcontextprotocol.io/specification/draft/server/index)
- [Official MCP documentation](https://modelcontextprotocol.io/docs/)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/docs)

**Apply**

- [ ] Map each capstone capability to local function, MCP tool, MCP resource or neither.
- [ ] Write a short decision explaining whether MCP is justified.
- [ ] If experimenting, expose only one read-only tool locally.
- [ ] Validate all MCP results as untrusted external input.
- [ ] Do not connect an unreviewed public MCP server to credentials or sensitive data.

### Day 18 — Single-agent versus multi-agent orchestration

**Learn**

- [ ] A manager can call specialists as tools and retain control of the final answer.
- [ ] A handoff transfers control to another agent.
- [ ] Routing can often be deterministic and does not always require multiple agents.
- [ ] Multi-agent systems increase prompts, tool surfaces, state transitions, latency, cost and debugging difficulty.
- [ ] Add a specialist only when a measured failure cannot be solved more simply.

**Read**

- [OpenAI Agents SDK — Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)
- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)

**Apply**

- [ ] Describe one possible specialist, such as a policy interpreter.
- [ ] State the measurable failure it would address.
- [ ] Estimate additional tools, turns, tokens and failure boundaries.
- [ ] Run a small comparison if time permits.
- [ ] Keep the single-agent design unless the evaluation shows a meaningful improvement.

**Deliverable**

- [ ] A documented decision, not necessarily a multi-agent implementation.

### Day 19 — Final hardening

**Build and verify**

- [ ] Run formatter, static checks, unit tests and integration tests.
- [ ] Run the full evaluation suite from a clean environment.
- [ ] Verify setup instructions on a second clean directory or container.
- [ ] Test invalid configuration and missing credentials.
- [ ] Test rate limit, timeout, cancellation and provider failure.
- [ ] Test malicious repository instructions and evidence conflicts.
- [ ] Verify path, byte, tool-call, turn, time and token limits.
- [ ] Verify read-only enforcement.
- [ ] Verify the demonstration write tool is disabled by default.
- [ ] Verify logs and fixtures contain no secrets.
- [ ] Record dependencies and known vulnerabilities.
- [ ] Record known limitations and unsupported cases.

### Day 20 — Demonstrate, assess and decide

**Create the final package**

- [ ] A concise README with setup, configuration and commands.
- [ ] A project brief with user, problem, outcome and boundaries.
- [ ] Architecture and sequence diagrams.
- [ ] Agent instructions and output schema.
- [ ] Tool catalogue and permission matrix.
- [ ] Threat model and approval policy.
- [ ] Evaluation dataset, rubric, configuration and results.
- [ ] One successful trace and one diagnosed failure trace.
- [ ] Known limitations, cost observations and rollback/disable procedure.
- [ ] A five-minute demonstration using public or synthetic data.
- [ ] A retrospective: what worked, what failed and what to learn next.

**Final decision**

Choose one:

- [ ] **Stop:** autonomy did not improve the task enough to justify its cost or risk.
- [ ] **Revise:** the idea remains useful, but evaluation or safety evidence is insufficient.
- [ ] **Continue to a supervised pilot:** the bounded task passes agreed evaluations and retains human oversight.

Do not label the agent production-ready after this month unless production requirements, operational ownership, privacy, security and domain-specific validation have been completed separately.

---

## Completion scorecard

Mark an item complete only when evidence exists.

### Problem and product fit

- [ ] The user and problem are explicit.
- [ ] Success is measurable.
- [ ] A simpler non-agent approach was evaluated.
- [ ] Autonomy is limited to decisions that benefit from model flexibility.
- [ ] Excluded scope is documented.

### Agent loop

- [ ] Every state and transition is documented.
- [ ] Hard stopping conditions are enforced in code.
- [ ] Repeated actions are detected.
- [ ] Cancellation reaches tools and model calls.
- [ ] Partial completion is not reported as success.

### Tools

- [ ] Each tool has a narrow purpose and typed schema.
- [ ] Authorization is deterministic.
- [ ] Inputs and outputs are bounded and validated.
- [ ] Errors are stable and actionable.
- [ ] Tool side effects are documented.
- [ ] Read-only behavior is tested.

### Context and state

- [ ] Context sources and trust levels are recorded.
- [ ] Untrusted content cannot override system policy.
- [ ] Application state is separate from model prose.
- [ ] Persistence, retention and deletion are documented.
- [ ] Resumption cannot duplicate work.

### Safety

- [ ] Trust boundaries and important assets are identified.
- [ ] Prompt-injection cases are in the evaluation set.
- [ ] Permissions follow least privilege.
- [ ] Consequential actions require authenticated, authorized approval.
- [ ] Approval requests show exact action and target.
- [ ] Secrets and private content are excluded from logs and fixtures.
- [ ] Resource budgets are enforced.

### Evaluation and operations

- [ ] At least twenty versioned evaluation cases exist.
- [ ] Correctness, grounding, safety, efficiency and escalation are scored.
- [ ] Failure categories are reported.
- [ ] Results can be reproduced from documented configuration.
- [ ] Traces explain successful and failed runs.
- [ ] Latency, tokens, tool calls and approximate cost are recorded.
- [ ] Known limitations and disable/rollback steps are documented.

### Communication

- [ ] Another developer can set up and run the capstone.
- [ ] A non-specialist can understand its value and major risks.
- [ ] The demonstration uses no private or employer-confidential data.
- [ ] Claims match the collected evidence.
- [ ] Remaining uncertainty is stated plainly.

## Reference library

### Foundations and patterns

- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK — Running agents](https://openai.github.io/openai-agents-python/running_agents/)

### Instructions, structured output and tools

- [OpenAI — Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI — Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [OpenAI Agents SDK — Tools](https://openai.github.io/openai-agents-python/tools/)
- [Anthropic — Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)

### State, approvals and orchestration

- [OpenAI Agents SDK — Sessions](https://openai.github.io/openai-agents-python/sessions/)
- [OpenAI Agents SDK — Human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)
- [OpenAI Agents SDK — Guardrails](https://openai.github.io/openai-agents-python/guardrails/)
- [OpenAI Agents SDK — Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)
- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/)

### Evaluation and observability

- [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI — Evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices)
- [OpenAI Agents SDK — Testing](https://openai.github.io/openai-agents-python/testing/)
- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/)
- [OpenAI Agents SDK — Usage](https://openai.github.io/openai-agents-python/usage/)

### Security and risk

- [OWASP — LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP — LLM06:2025 Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)

### MCP

- [Model Context Protocol documentation](https://modelcontextprotocol.io/docs/)
- [MCP server primitives](https://modelcontextprotocol.io/specification/draft/server/index)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/docs)

## Scope warning

Agent frameworks and model APIs change quickly. Check the current official documentation before implementation. The principles in this checklist—least privilege, bounded execution, explicit state, approval, traceability and evaluation—should remain part of the design even when a library's API changes.
