# Product Manager Thinking: Synthetic Examples

These examples contain invented, domain-independent details. They demonstrate structure and questioning, not reusable customer evidence or default metrics.

## 1. Small frontend feature

**Input:** “Add a saved-view button to the results page.”

### Concise analysis

- **Problem:** The request proposes a control, but does not establish whether people repeatedly recreate the same view or how costly that is.
- **User/customer:** Unknown. Which segment repeats the workflow often enough to benefit?
- **Desired outcome:** Hypothesis: reduce repeated setup and help users resume work.
- **Business impact:** Unknown; possible engagement or retention effects require evidence.
- **Success metric:** Unknown. Candidate behavior to investigate: successful reuse of saved views, alongside guardrails for task completion and accidental clutter. Do not set a target without a baseline.
- **Assumptions:** Users repeat configurations; they can recognize saved names; saving is preferable to browser or existing history behavior.
- **Missing information:** Current workflow, frequency and severity, device constraints, accessibility needs, persistence and sharing expectations.
- **Scope:** Smallest useful version may save and reopen one user's view. Sharing, folders, and cross-account transfer are out of scope unless required for the core outcome.
- **Risks:** UI clutter; discoverability; stale saved state; confusing interactions with changed data.
- **Product questions:** “Which segment recreates views most frequently, and what evidence shows the resulting friction?” “Must a saved view preserve data, query settings, or both?”
- **Engineering considerations:** Storage location changes portability, privacy, synchronization, and implementation cost. Define empty, duplicate, deleted, and incompatible-state behavior.
- **Recommended next action:** Observe or quantify the repeated workflow before finalizing the interaction and persistence model.

**PM concept: Jobs to Be Done** — describe the progress a person is trying to make in context, rather than starting with the requested control.

## 2. Backend/API change

**Input:** “Add bulk update support to the API.”

### Concise analysis

- **Problem:** Unknown. The proposed endpoint may address client latency, rate limits, atomicity, or operator effort; each implies a different contract.
- **User/customer:** API consumers performing repeated updates; segments and volumes are unknown.
- **Desired outcome:** Unknown until the constrained workflow is identified.
- **Business impact:** Unknown. Avoid claiming integration growth or cost reduction without usage and commercial evidence.
- **Success metric:** Ask which observable change matters: fewer requests, shorter workflow duration, fewer partial failures, or higher task completion. Establish baseline, target, and guardrails.
- **Assumptions:** Consumers can construct batches safely; authorization is uniform; bulk behavior is preferable to client concurrency.
- **Missing information:** Batch size distribution, atomicity, ordering, idempotency, authorization, validation, failure semantics, limits, compatibility, and retry behavior.
- **Scope:** A bounded asynchronous or synchronous operation for one resource type may be the smallest useful version. Cross-resource transactions are explicitly excluded unless validated.
- **Risks:** Partial success ambiguity, overload, long transactions, abusive payloads, and difficult retries.
- **Product questions:** “Which integration workflow is blocked, at what observed volume, and is atomicity part of the user need?”
- **Engineering considerations:** Contract choices affect user recovery, scalability, observability, support burden, and future compatibility.
- **Recommended next action:** Gather representative call patterns and agree on failure semantics before choosing endpoint shape.

## 3. Performance improvement

**Input:** “Cut page load time in half.”

### Concise analysis

- **Problem:** A technical target is stated, but the affected experience and evidence are missing.
- **User/customer:** Ask which segments, devices, locations, and journeys experience harmful delay.
- **Desired outcome:** Hypothesis: faster completion of a high-value task or reduced abandonment.
- **Business impact:** Unknown. A conversion or retention effect must be measured rather than presumed.
- **Success metric:** Use a user-perceived latency measure at an agreed percentile and segment, linked where possible to task completion. Set error-rate and cost guardrails. Baseline and target need evidence.
- **Assumptions:** Load time is a material cause of observed behavior; the proposed improvement is perceptible; synthetic measurements represent real users.
- **Missing information:** Baseline distribution, bottleneck, affected traffic share, behavioral correlation, seasonal effects, and cost ceiling.
- **Scope:** Optimize the critical journey and materially affected segment first; exclude unrelated endpoints and cosmetic benchmark wins.
- **Risks:** Optimizing the mean while tail latency remains poor; regressions in correctness, accessibility, reliability, or cloud cost.
- **Product questions:** “At what latency and for which segment does completion materially change?”
- **Engineering considerations:** Caching, payload reduction, rendering strategy, and infrastructure each carry freshness, complexity, reliability, and cost trade-offs.
- **Recommended next action:** Segment real-user measurements and identify the latency component most connected to the target workflow.

**PM concept: Guardrail metric** — a measure that must not deteriorate while the primary outcome improves.

## 4. Technical-debt proposal

**Input:** “Spend a quarter replacing the legacy rules module.”

### Concise analysis

- **Problem:** The replacement is a solution. Describe current consequences: defect rate, lead time, incident exposure, unsupported dependencies, or blocked capabilities.
- **User/customer:** Engineers and operators may feel the direct pain; customers are affected only where evidence connects debt to reliability, speed, safety, or capability.
- **Desired outcome:** Reduce a demonstrated delivery or operational constraint.
- **Business impact:** Treat faster delivery, lower cost, or reduced risk as hypotheses until historical evidence supports them.
- **Success metric:** Candidate measures depend on the problem: change lead time, escaped defects, incident frequency, recovery time, or maintenance effort. Define baseline and evaluation period.
- **Assumptions:** The module is causal rather than merely correlated; replacement is safer than incremental remediation; benefits exceed migration and opportunity costs.
- **Missing information:** Change history, incidents, blocked roadmap items, ownership, replacement options, migration risk, and competing work.
- **Scope:** Prefer a bounded seam or highest-cost path if it can test the thesis. Exclude broad cleanup that does not affect the stated outcome.
- **Risks:** Rewrite parity work, hidden behavior, prolonged dual systems, delayed product outcomes, and no measurable improvement.
- **Product questions:** “Which planned outcome is constrained, and what is the cost of leaving the constraint in place for one more planning period?”
- **Engineering considerations:** Incremental replacement, encapsulation, targeted tests, or managed coexistence may preserve learning and reduce irreversible commitment.
- **Recommended next action:** Build an evidence table connecting observed debt symptoms to affected outcomes and compare incremental options with replacement.

**PM concept: Opportunity cost** — the value forgone by choosing this work instead of the best available alternative.

## 5. Stakeholder request without clear evidence

**Input:** “A senior stakeholder says every account needs a customizable dashboard this release.”

### Concise analysis

- **Problem:** Unknown. Authority and urgency do not establish customer need.
- **User/customer:** “Every account” is unvalidated; identify the requesting or affected segments and workflows.
- **Desired outcome:** Ask what decision or task customization should improve.
- **Business impact:** Unknown. Do not infer revenue, retention, or strategic necessity from sponsorship.
- **Success metric:** Ask what user behavior or business result should change, and what must not regress. Do not use feature delivery as the outcome.
- **Assumptions:** Needs vary materially; customization solves that variance; users will configure and maintain dashboards; a common default is insufficient.
- **Missing information:** Request origin, supporting examples, reach, urgency source, current workaround, willingness to change behavior, sales or contractual context, and maintenance cost.
- **Scope:** A configurable subset, role-based defaults, or a prototype may test the need. Full arbitrary layout and every account remain out of scope until supported.
- **Risks:** Complexity transferred to users, weak defaults, support burden, fragmented experience, and displacement of higher-value work.
- **Product questions:** “Which decisions cannot be made with the current dashboard, for which segment, and how often?” “What evidence would justify serving all accounts rather than a targeted cohort?”
- **Engineering considerations:** Configuration schema, permissions, migration, backwards compatibility, rendering performance, and long-term component support can make broad customization costly.
- **Recommended next action:** Request three representative workflows and evidence, then test the smallest configuration that addresses the common high-value need.

Use active listening and constructive resistance: acknowledge the intended outcome, expose uncertainty, and offer a bounded route to evidence rather than dismissing the request.

## 6. Architecture decision with product consequences

**Input:** “Choose between building a shared platform service and buying a managed service.”

### Concise analysis

- **Problem:** State the product capability or constraint that the architecture must serve; platform standardization alone is not the outcome.
- **User/customer:** External users may experience reliability, latency, trust, or feature differences; internal teams experience integration and operating costs.
- **Desired outcome:** Deliver the needed capability within acceptable time, quality, risk, and strategic flexibility.
- **Business impact:** Model only evidenced costs and plausible scenarios. Revenue, differentiation, and vendor risk remain hypotheses unless supported.
- **Success metric:** Define time to usable capability, service-level needs, total lifecycle cost, adoption by intended teams, and product outcome guardrails. Avoid a single engineering-only measure.
- **Assumptions:** Forecast demand is credible; vendor capabilities and pricing remain suitable; internal expertise and operating capacity exist; switching is feasible.
- **Missing information:** Strategic differentiation, regulatory and data constraints, integration needs, volume scenarios, exit costs, roadmap fit, vendor viability, staffing, and incident ownership.
- **Scope:** Compare a time-bounded managed-service integration with a minimal internal capability against the same required use cases. Exclude speculative platform breadth.
- **Risks:** Build—slow value, staffing and operational burden. Buy—lock-in, pricing shifts, roadmap dependency, data handling, and reduced customization.
- **Product questions:** “Which capabilities differentiate the product, and which are commodities?” “How much delay is acceptable before the intended user outcome is available?”
- **Engineering considerations:** Security, reliability, scalability, API fit, observability, migration, reversibility, and total cost affect launch timing and future product options.
- **Recommended next action:** Create a decision record with weighted, evidence-backed criteria and test the highest-risk integration or scale assumption before commitment.

**PM concept: Build versus buy** — a product and business choice as well as a technical one; compare time to value, differentiation, lifecycle cost, risk, and reversibility.
