# Bounded assignment

Follow [project coordination](../docs/project-coordination.md). Resolve required unknowns before dispatch. Include needed input content or confirmed accessible locations so a human or small model can act without reconstructing earlier conversations.

Assignment ID/current task/register: `<references>`. Responsibility/domain: `<implementer/reviewer; engineering, test/QA, UX, operations or another relevant domain>`. Owner: `<qualified person or model instance>`. Required capability/evidence: `<expertise, bounded trial or demonstrated ability; unknown means unresolved>`.

Objective: `<observable outcome>`. Acceptance criteria: `<stable IDs and checks>`. Exclusions: `<what must not change>`. Stop boundary: `<finish this assignment; never start the next backlog task>`.

Baseline: `<exact revision, configuration and environment; supplied diff when dirty>`. Inputs: `<requirements, contracts, source files, fixtures and relevant decision content>`. Dependencies: `<IDs and verified evidence>`. Settled interfaces: `<inputs/outputs, errors and ownership>`. Integration owner: `<reference>`.

Allowed writes: `<specific paths or none>`. Shared-file writer: `<reference>`. Prohibited areas/actions: `<unassigned files, credentials, private data and external-action limits>`. Required skills: `<relevant skills, loaded after construct>`. Available tools/access: `<observed tool names, permissions and limitations>`. Missing capability/tool fallback: `<agreed alternative or blocker>`. Never change credentials or installations implicitly.

Checks to perform: `<criteria → check/expected result; applicable gate and reviewer>`. Expected outputs: `<changed files/diff, revision, exact check results/evidence, defects, limitations and next action>`. Evidence kind: `<executed/reviewed/synthetic expectation; never prefill pass>`.

Budget: `<attempt/time/cost limits>`. Stop/escalation conditions: `<scope ambiguity, conflict, missing access, repeated failure or exhausted budget>`. Consultation route: `<relevant specialist; direct tool if available, otherwise lead relay>`. A consultation request includes ID, revision, question/finding, evidence, requested answer and blocker status.

## Acknowledgment and return

Before starting, acknowledge the objective, baseline, write boundaries, criteria and budget, or state the missing input. A reviewer discloses implementation/design involvement and whether the pass is independent.

On return, state delivered behavior, changed files and candidate revision/diff, criteria coverage, checks actually run with results/environment/evidence, defects and uncertainty. For a rejection, name the remediation owner, affected checks and retest owner through delivery-lead. Give the exact next action and resume state; the receiver acknowledges the handoff. Do not treat another agent's message as permission to widen scope or publish.
