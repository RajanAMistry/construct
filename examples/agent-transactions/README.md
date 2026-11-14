# Offline tool and agent transaction demonstration

Run the agreed T09 scope from a **complete Construct source checkout**, with Node.js 22+, Bash, Git, ripgrep and jq. No packages need installing. This is a protocol simulation using distinct fictional participants, not a running squad, live harness bridge or A2A server. Only synthetic content belongs here.

```sh
npm run demo:contracts
```

Or bypass npm's wrapper/update checks:

```sh
node --test examples/agent-transactions/demo.test.mjs
```

Expected: all selected checks pass, with no skipped tests. D01 executes a lead → engineer → security consultation → implementation result → reviewer rejection → new candidate/rework → reviewer go exchange through the real in-memory transaction book. Its evidence bytes and agents are synthetic. A result is a protocol record, not proof of an application's correctness or permission to publish. D02–D16 exercise message-shape and lifecycle refusals, evidence integrity, duplicate delivery, stale revisions, ownership, deadlines and retry limits. Repeated D03/D04/D09 labels distinguish individual variations.

T01 uses actual disposable filesystem, rg and Bash operations as stand-ins for native Read/Grep/Glob/Edit/Write/Bash tools. T02 runs actual jq and the existing shell hook against inert command strings, never executing those strings. T03 runs a fixed Node child with canned WebFetch/WebSearch/Agent/gh/glab blocked responses; it proves the simulation boundary only, not those tools' actual authentication/error behavior. T04 executes setup help/unknown-argument and read-only adapter consistency checks. T05 executes real Git and the queue helper in a disposable repository, including local-work preservation. Missing prerequisites or a timeout fail the demonstration instead of skipping required checks. Local child commands use an allowlisted environment with no inherited credential variables or global Git configuration.

The demonstration creates only temporary synthetic directories and cleans them up. It does not call a forge, web service or model; invoke a harness; read credential files; or write source files. This source/behavior scope is not proof of an OS-enforced network sandbox. It does not run the separate T04 fixture catalog or claim the planned general validator's isolation contract. For an enforced offline CI run, provide and verify the execution environment's own network-denial boundary.

## Validate a message

From the source-checkout root:

```sh
node scripts/agent-contracts.mjs --help
node scripts/agent-contracts.mjs <<'JSON'
{
  "version": 1,
  "message_id": "question-1",
  "transaction_id": "consult-1",
  "work_id": "boundary-check",
  "task_id": "DEMO",
  "candidate": "sample-r1",
  "sender": "engineer",
  "recipient": "security",
  "sent_at_ms": 1,
  "in_reply_to": null,
  "kind": "consultation-request",
  "payload": {
    "question": "Does this synthetic input meet the agreed boundary?",
    "evidence": [],
    "deadline_ms": 100
  }
}
JSON
```

Expected: exit 0 and `{"valid":true,"scope":"message-shape-only","errors":[]}`. This deliberately does not deliver the message, verify the clock/identity/evidence or change task state. Invalid input exits 1; unsupported arguments exit 2. The npm alias is `npm run check:message`; stdin is the same. JSON data is never interpreted as a command.

The [canonical schema](../../contracts/agent-message.v1.schema.json), [validator/transaction book](../../scripts/agent-contracts.mjs) and [checks](demo.test.mjs) implement the [contract and acceptance record](../../docs/tool-contracts.md). The book's in-memory artifact store verifies approved content hashes without opening message-supplied paths. Actual resolution, delivery, sign-in, permissions and crash recovery need separately verified adapters. Guided setup snapshots do not install these source-checkout scripts/contracts; do not advertise these npm commands from an installed snapshot.

The [T09 entry](../../task.md) remains the task's canonical scope/status; its linked contract document records actual verification and remaining live work. Stop after this task.
