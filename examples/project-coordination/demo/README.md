# Local health-server coordination demo

## Summary

Use this small synthetic server to exercise one bounded coordination task. It is a local Node.js HTTP fixture, not an orchestration service or deployment example. The [T06 execution record](../run.md) is the source of truth for task status, assignments, decisions and observed acceptance evidence. This guide supplies the runnable instructions.

## What is built

The agreed interface is `GET /health`, returning HTTP 200 with JSON `{"status":"ok"}`. Every other path or method returns HTTP 404 with JSON content type; HEAD responses have no body, as required by HTTP semantics. The server listens only on `127.0.0.1`. `server.mjs` exports `createServer()` so tests can use an ephemeral port without starting the command-line entry point.

The fixture uses Node built-ins and needs no package installation, account, credentials, database or persistent data. These are synthetic requirements. A successful health response demonstrates this fixture only, not production readiness or cross-harness coordination support.

## What needs building

Independent verification and the overall T06 acceptance decision belong in the [execution record](../run.md). Read its current candidate, checks and remaining work rather than treating this guide as a second task tracker.

External issue/Jira updates, Google Docs synchronization, deployment and communication support across other harnesses are outside this demo.

## How to start servers

Prerequisites: Node.js 24 and a POSIX shell. The HTTP checks below also use `curl`. No `npm install` is needed. Commands assume the Construct repository root as the starting directory.

Copy the fixture into a fresh disposable directory, then change into that directory:

```sh
demo_dir=$(mktemp -d "${TMPDIR:-/tmp}/construct-health-demo.XXXXXX")
cp examples/project-coordination/demo/server.mjs examples/project-coordination/demo/server.test.mjs "$demo_dir/"
cd "$demo_dir"
```

Start the server in this terminal:

```sh
node server.mjs
```

Expected output: `Listening on http://127.0.0.1:3000`. The terminal remains occupied until you stop the server. In another terminal, request its health endpoint:

```sh
curl --fail-with-body --max-time 2 http://127.0.0.1:3000/health
```

Expected result: HTTP 200 with `{"status":"ok"}`. Use `curl -i --max-time 2 http://127.0.0.1:3000/missing` to inspect the expected HTTP 404 JSON response.

`PORT` is the only configuration variable. It accepts a decimal integer from 0 to 65535. For another port, start with `PORT=3001 node server.mjs` and use `http://127.0.0.1:3001/health`. For an available ephemeral port, use `PORT=0 node server.mjs` and copy the actual URL from the startup line. Invalid values exit with code 1 before listening. An occupied port produces a server error and exit code 1; choose another port rather than stopping an unrelated process.

To stop, press **Ctrl-C in the terminal running this server**. Expected result: the process closes its listener and exits with code 0. There is no shutdown message. Confirm the stopped endpoint no longer accepts requests:

```sh
curl --fail-with-body --max-time 2 http://127.0.0.1:3000/health
```

Expected result: connection failure and a nonzero exit code. Substitute the actual port if you changed `PORT`. If the request still succeeds, investigate the owner of that listener; do not kill an unidentified process. The fixture stores no data, so recovery is to start a fresh disposable copy. You may retain the temporary directory for inspection; do not remove unrelated temporary files.

## How to test

From the disposable directory containing `server.mjs` and `server.test.mjs`, with no manually started demo server required:

```sh
node --test server.test.mjs
```

Expected result: all checks pass and the command exits with code 0. Automated checks use ephemeral loopback ports and close their own listeners/processes. They do not require port 3000 to be free. The manual start/request/stop sequence above separately checks that the command-line instructions work.

From the Construct repository root, the equivalent fixture test command is:

```sh
node --test examples/project-coordination/demo/server.test.mjs
```

Writer verification (2026-11-10, Node.js v24.22.1): the disposable-copy test command passed all 13 checks. Default startup printed the expected port-3000 URL; the documented health and missing-route requests returned the expected responses; Ctrl-C exited 0 and the subsequent health request failed to connect. Local socket restrictions prevented the first sandboxed test attempt; the same checks passed outside that sandbox. This is writer verification, not independent acceptance. Actual integrated-candidate results, file hashes and separate review remain in the [execution record](../run.md).

## Blockers

No unresolved documentation blocker is known. The delivery-lead owns integration and independent QA dispatch; an identified integrated candidate is the resume condition. Current task blockers and owners remain authoritative in the [execution record](../run.md).
