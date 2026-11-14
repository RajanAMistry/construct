import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { TransactionBook, parseMessage, validateMessage } from '../../scripts/agent-contracts.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CLI = join(ROOT, 'scripts/agent-contracts.mjs');
const roster = { lead: 'delivery-lead', engineer: 'software-engineer', reviewer: 'reviewer', security: 'security-privacy', qa: 'qa-verifier' };
const artifacts = ['sample-r1', 'sample-r2'].flatMap(candidate => ['brief.txt', 'checks.json'].map(path => ({ path, candidate, content: `${candidate}: synthetic ${path}` })));
function evidence(candidate = 'sample-r1', path = 'checks.json') {
  const content = artifacts.find(a => a.candidate === candidate && a.path === path).content;
  return { path, sha256: createHash('sha256').update(content).digest('hex') };
}
const checks = (candidate = 'sample-r1', result = 'passed') => [{ criterion: 'AC1', result, evidence: evidence(candidate) }];
function book() { return new TransactionBook({ task_id: 'DEMO', candidate: 'sample-r1', coordinator: 'lead', participants: roster, artifacts }); }
function request(kind = 'assignment', overrides = {}) {
  const payload = kind === 'assignment' ? { objective: 'Check the synthetic input', criteria: ['AC1'], inputs: [evidence('sample-r1', 'brief.txt')], allowed_writes: [], deadline_ms: 100 }
    : kind === 'review-request' ? { criteria: ['AC1'], evidence: [evidence()], deadline_ms: 100 }
      : { question: 'Does this input meet the boundary?', evidence: [evidence()], deadline_ms: 100 };
  return { version: 1, message_id: 'm1', transaction_id: 'tx1', work_id: 'work1', task_id: 'DEMO', candidate: 'sample-r1',
    sender: 'lead', recipient: kind === 'review-request' ? 'reviewer' : kind === 'consultation-request' ? 'security' : 'engineer',
    sent_at_ms: 1, in_reply_to: null, kind, payload, ...overrides };
}
function reply(r, kind = 'acknowledgment', overrides = {}) {
  const payload = kind === 'acknowledgment' ? { accepted: true }
    : kind === 'result' ? { summary: 'Synthetic check completed', checks: checks(r.candidate), evidence: [evidence(r.candidate)] }
      : kind === 'consultation-response' ? { answer: 'Synthetic boundary satisfied', evidence: [evidence(r.candidate)] }
        : kind === 'failure' ? { code: 'tool-unavailable', summary: 'Fixture tool unavailable', retryable: false }
          : { verdict: 'go', findings: [], checks: checks(r.candidate), evidence: [evidence(r.candidate)], remediation_owner: 'engineer', retest_owner: 'reviewer' };
  return { ...r, message_id: `${r.message_id}-${kind}`, sender: r.recipient, recipient: r.sender,
    sent_at_ms: 2, in_reply_to: r.message_id, kind, payload, ...overrides };
}
const send = (b, m, now = m.sent_at_ms) => b.accept(m, { sender: m.sender, now });
function rejectsUnchanged(b, operation, code) {
  const before = b.snapshot;
  assert.throws(operation, error => error.code === code);
  assert.deepEqual(b.snapshot, before);
}
const env = { PATH: process.env.PATH, LC_ALL: 'C', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_SYSTEM: '/dev/null', GIT_TERMINAL_PROMPT: '0' };
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { env, encoding: 'utf8', timeout: 20000, maxBuffer: 512 * 1024, ...options });
  assert.equal(result.error, undefined, 'required local command unavailable or timed out');
  return result;
}
function scratch(t) {
  const root = mkdtempSync(join(tmpdir(), 'construct-contracts-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test('D01: assignment, peer consultation, result, rejected review, rework and new review', t => {
  const b = book(), r = request();
  assert.equal(send(b, r).state, 'requested');
  assert.equal(send(b, reply(r)).state, 'acknowledged');
  const q = request('consultation-request', { sender: 'engineer', message_id: 'q1', transaction_id: 'consult1', work_id: 'consult1', sent_at_ms: 3 });
  send(b, q); send(b, reply(q, 'acknowledgment', { sent_at_ms: 4 }));
  send(b, reply(q, 'consultation-response', { sent_at_ms: 5 }));
  send(b, reply(r, 'result', { sent_at_ms: 6 }));
  assert.deepEqual(b.snapshot.current_review_go, [], 'implementation completion is not acceptance');
  const review = request('review-request', { message_id: 'review1', transaction_id: 'review1', work_id: 'review1', sent_at_ms: 7 });
  send(b, review); send(b, reply(review, 'acknowledgment', { sent_at_ms: 8 }));
  const no = reply(review, 'review-result', { sent_at_ms: 9 });
  no.payload = { ...no.payload, verdict: 'no-go', findings: ['Synthetic criterion needs rework'], checks: checks('sample-r1', 'failed') };
  send(b, no);
  assert.equal(b.snapshot.transactions.review1.result.remediation_owner, 'engineer');
  assert.equal(b.snapshot.transactions.review1.result.retest_owner, 'reviewer');
  b.advanceCandidate('sample-r2', { sender: 'lead', now: 10 });
  const fixed = request('assignment', { candidate: 'sample-r2', message_id: 'fixed1', transaction_id: 'fixed1', work_id: 'fixed1', sent_at_ms: 11 });
  fixed.payload.inputs = [evidence('sample-r2', 'brief.txt')];
  send(b, fixed); send(b, reply(fixed, 'acknowledgment', { sent_at_ms: 12 })); send(b, reply(fixed, 'result', { sent_at_ms: 13 }));
  const retest = request('review-request', { candidate: 'sample-r2', message_id: 'review2', transaction_id: 'review2', work_id: 'review2', sent_at_ms: 14 });
  retest.payload.evidence = [evidence('sample-r2')];
  send(b, retest); send(b, reply(retest, 'acknowledgment', { sent_at_ms: 15 })); send(b, reply(retest, 'review-result', { sent_at_ms: 16 }));
  assert.deepEqual(b.snapshot.current_review_go, ['review2']);
  assert.equal(b.snapshot.transactions.review1.result.verdict, 'no-go');
  t.diagnostic('Simulated lead → engineer → security → engineer → lead → reviewer; no harness/model invoked.');
});

test('D02: all eight message kinds conform to the canonical schema', () => {
  const a = request(), c = request('consultation-request'), r = request('review-request');
  for (const m of [a, reply(a), c, reply(c, 'consultation-response'), reply(a, 'result'), r, reply(r, 'review-result'), reply(a, 'failure')]) {
    assert.deepEqual(validateMessage(m), []);
  }
});

for (const [name, mutate] of [
  ['unsupported version', m => { m.version = 2; }],
  ['missing field', m => { delete m.candidate; }],
  ['unknown envelope field', m => { m.extra = 'ignored'; }],
  ['unknown payload field', m => { m.payload.command = 'never executed'; }],
  ['wrong payload type', m => { m.payload.criteria = 'AC1'; }],
  ['path traversal', m => { m.payload.inputs[0].path = '../private.txt'; }],
  ['absolute path', m => { m.payload.allowed_writes = ['/tmp/file']; }],
  ['URL reference', m => { m.payload.inputs[0].path = 'https://example.invalid/file'; }],
  ['empty criteria', m => { m.payload.criteria = []; }],
  ['duplicate criteria', m => { m.payload.criteria = ['AC1', 'AC1']; }],
  ['invalid checksum', m => { m.payload.inputs[0].sha256 = 'unverified'; }],
  ['oversized field', m => { m.payload.objective = 'a'.repeat(1025); }],
  ['unknown kind', m => { m.kind = 'publish'; }],
  ['trailing newline in identity', m => { m.sender = 'lead\n'; }]
]) test(`D03 shape refusal: ${name}`, () => { const m = request(); mutate(m); assert.ok(validateMessage(m).length); });

for (const [name, overrides, code] of [
  ['unacknowledged completion', {}, 'acknowledgment-required'],
  ['unknown transaction', { transaction_id: 'missing' }, 'unknown-transaction'],
  ['wrong task', { task_id: 'OTHER' }, 'wrong-task'],
  ['wrong recipient', { recipient: 'reviewer' }, 'reply-mismatch'],
  ['wrong sender', { sender: 'security' }, 'reply-mismatch'],
  ['wrong work', { work_id: 'other' }, 'reply-mismatch'],
  ['wrong correlation', { in_reply_to: 'missing' }, 'reply-mismatch']
]) test(`D04 lifecycle refusal: ${name}`, () => {
  const b = book(), r = request(); send(b, r);
  const m = reply(r, 'result', overrides);
  rejectsUnchanged(b, () => send(b, m), code);
});

test('D05: transport sender cannot impersonate another participant', () => {
  const b = book(), r = request();
  rejectsUnchanged(b, () => b.accept(r, { sender: 'engineer', now: 1 }), 'identity-mismatch');
  const unauthorized = { ...r, sender: 'engineer', recipient: 'qa' };
  rejectsUnchanged(b, () => send(b, unauthorized), 'assignment-authority');
});

test('D06: exact duplicate has no second effect; changed reuse is rejected', () => {
  const b = book(), r = request(); send(b, r); const before = b.snapshot;
  const reordered = Object.fromEntries(Object.entries(r).reverse());
  assert.equal(send(b, reordered).status, 'duplicate'); assert.deepEqual(b.snapshot, before);
  rejectsUnchanged(b, () => send(b, { ...r, payload: { ...r.payload, objective: 'changed' } }), 'conflicting-duplicate');
});

test('D07: message and snapshot mutation cannot alter accepted state', () => {
  const b = book(), r = request(); send(b, r); const before = b.snapshot;
  r.payload.criteria.push('AC2'); const snapshot = b.snapshot; snapshot.transactions.tx1.request.payload.criteria.push('AC3'); snapshot.events.length = 0;
  assert.deepEqual(b.snapshot, before);
});

test('D08: candidate advance invalidates open work and excludes old review go', () => {
  const b = book(), r = request('review-request'); send(b, r); send(b, reply(r)); send(b, reply(r, 'review-result'));
  const open = request('consultation-request', { message_id: 'open', transaction_id: 'open', work_id: 'open', sent_at_ms: 3 }); send(b, open);
  b.advanceCandidate('sample-r2', { sender: 'lead', now: 4 });
  assert.deepEqual(b.snapshot.current_review_go, []); assert.equal(b.snapshot.transactions.open.state, 'stale');
  rejectsUnchanged(b, () => send(b, reply(open, 'consultation-response', { sent_at_ms: 5 })), 'stale-candidate');
  rejectsUnchanged(b, () => b.advanceCandidate('sample-r1', { sender: 'engineer', now: 5 }), 'candidate-authority');
  rejectsUnchanged(b, () => b.advanceCandidate('sample-r1', { sender: 'lead', now: 5 }), 'candidate-reused');
});

for (const [name, ref] of [['missing', { path: 'missing.txt', sha256: '0'.repeat(64) }], ['tampered', { path: 'checks.json', sha256: '0'.repeat(64) }], ['old candidate', evidence('sample-r2')]]) {
  test(`D09 evidence refusal: ${name}`, () => {
    const b = book(), r = request(); send(b, r); send(b, reply(r)); const result = reply(r, 'result'); result.payload.evidence = [ref];
    rejectsUnchanged(b, () => send(b, result), 'unavailable-or-changed-evidence');
  });
}

test('D10: review cannot pass failed/unrun checks or omit criterion coverage', () => {
  for (const state of ['failed', 'blocked', 'not-run']) {
    const b = book(), r = request('review-request'); send(b, r); send(b, reply(r)); const result = reply(r, 'review-result'); result.payload.checks = checks('sample-r1', state);
    rejectsUnchanged(b, () => send(b, result), 'unsupported-go');
  }
  const b = book(), r = request(); send(b, r); send(b, reply(r)); const result = reply(r, 'result'); result.payload.checks[0].criterion = 'AC2';
  rejectsUnchanged(b, () => send(b, result), 'criterion-coverage');
});

test('D11: timeout closes work, rejects late responses and bounds retries to two', () => {
  const b = book(), r = request(); send(b, r);
  rejectsUnchanged(b, () => send(b, reply(r), 100), 'deadline-expired');
  assert.equal(b.expire(100), 1);
  rejectsUnchanged(b, () => send(b, reply(r), 100), 'transaction-closed');
  const retry = { ...r, message_id: 'retry', transaction_id: 'retry', sent_at_ms: 101, payload: { ...r.payload, deadline_ms: 110 } };
  send(b, retry); b.expire(110);
  const third = { ...retry, message_id: 'third', transaction_id: 'third', sent_at_ms: 111, payload: { ...retry.payload, deadline_ms: 120 } };
  rejectsUnchanged(b, () => send(b, third), 'retry-budget-exhausted');
});

test('D12: missing tool is a terminal failure, never successful delivery', () => {
  const b = book(), r = request(); send(b, r);
  assert.equal(send(b, reply(r, 'failure')).state, 'failed');
  assert.deepEqual(b.snapshot.current_review_go, []);
  const retry = { ...r, message_id: 'retry', transaction_id: 'retry', sent_at_ms: 3 };
  rejectsUnchanged(b, () => send(b, retry), 'work-not-retryable');
});

test('D13: retry cannot silently change scope; duplicate acknowledgment cannot advance', () => {
  const b = book(), r = request(); send(b, r); send(b, reply(r));
  rejectsUnchanged(b, () => send(b, reply(r, 'acknowledgment', { message_id: 'another-ack' })), 'already-acknowledged');
  b.expire(100);
  const retry = { ...r, message_id: 'retry', transaction_id: 'retry', sent_at_ms: 101, payload: { ...r.payload, objective: 'changed scope', deadline_ms: 110 } };
  rejectsUnchanged(b, () => send(b, retry), 'changed-retry-contract');
});

test('D14: nonmonotonic clocks, future messages and excessive deadlines fail', () => {
  const b = book(), r = request(); send(b, r);
  rejectsUnchanged(b, () => send(b, reply(r), 0), 'invalid-clock');
  rejectsUnchanged(b, () => send(b, reply(r, 'acknowledgment', { sent_at_ms: 3 }), 2), 'future-message');
  const another = request('consultation-request', { message_id: 'other', transaction_id: 'other', work_id: 'other' }); another.payload.deadline_ms = 20002;
  rejectsUnchanged(b, () => send(b, another), 'invalid-deadline');
});

test('D15: CLI distinguishes valid, invalid and usage; never echoes input', () => {
  const valid = run(process.execPath, [CLI], { input: JSON.stringify(request()) });
  assert.equal(valid.status, 0); assert.deepEqual(JSON.parse(valid.stdout), { valid: true, scope: 'message-shape-only', errors: [] });
  for (const input of ['{', JSON.stringify({ privateFixtureMarker: 'withhold-this-text' }), '{"version":1,"version":2}', '{"version":1,"vers\\u0069on":1}', '['.repeat(17) + '0' + ']'.repeat(17), ' '.repeat(131073)]) {
    const result = run(process.execPath, [CLI], { input });
    assert.equal(result.status, 1); assert.ok(!(result.stdout + result.stderr).includes('withhold-this-text'));
  }
  assert.equal(run(process.execPath, [CLI, '--unknown'], { input: '' }).status, 2);
  assert.match(run(process.execPath, [CLI, '--help']).stdout, /shape only/);
  const malformed = Buffer.from(JSON.stringify(request()));
  malformed[malformed.indexOf('Check')] = 0xff;
  const invalidUtf8 = run(process.execPath, [CLI], { input: malformed });
  assert.equal(invalidUtf8.status, 1); assert.equal(invalidUtf8.stderr.trim(), 'invalid-utf8');
  assert.throws(() => parseMessage('{"a":1,"a":2}'), error => error.code === 'duplicate-key');
});

test('D16: replay advances receipt time without duplicating transaction events', () => {
  const b = book(), r = request(); send(b, r); const before = b.snapshot;
  assert.equal(send(b, r, 101).status, 'duplicate');
  assert.deepEqual(b.snapshot, before);
  rejectsUnchanged(b, () => send(b, reply(r), 2), 'invalid-clock');
  rejectsUnchanged(b, () => send(b, reply(r), 101), 'deadline-expired');
  assert.equal(b.expire(101), 1);
});

test('T01: offline Read, Grep, Glob, Bash, Edit and Write stand-ins use disposable content', t => {
  const root = scratch(t); writeFileSync(join(root, 'brief.md'), 'synthetic alpha\n');
  assert.equal(readFileSync(join(root, 'brief.md'), 'utf8'), 'synthetic alpha\n');
  assert.throws(() => readFileSync(join(root, 'missing.md')), { code: 'ENOENT' });
  assert.equal(run('rg', ['-n', 'alpha', root]).status, 0);
  assert.equal(run('rg', ['-n', 'absent', root]).status, 1);
  assert.equal(run('rg', ['--files', '-g', '*.md', root]).stdout.trim(), join(root, 'brief.md'));
  assert.equal(run('bash', ['-c', 'printf "synthetic-output\\n"'], { cwd: root }).stdout, 'synthetic-output\n');
  writeFileSync(join(root, 'brief.md'), readFileSync(join(root, 'brief.md'), 'utf8').replace('alpha', 'beta'));
  assert.equal(readFileSync(join(root, 'brief.md'), 'utf8'), 'synthetic beta\n');
  writeFileSync(join(root, 'new.txt'), 'synthetic', { flag: 'wx' });
  assert.throws(() => writeFileSync(join(root, 'new.txt'), 'overwrite', { flag: 'wx' }), { code: 'EEXIST' });
});

test('T02: jq parses a fixture; hook receives inert push/API strings without executing them', () => {
  assert.equal(run('jq', ['-er', '.state'], { input: '{"state":"synthetic"}' }).stdout.trim(), 'synthetic');
  assert.notEqual(run('jq', ['-e', '.state'], { input: '{' }).status, 0);
  const hook = join(ROOT, 'hooks/confirm-outbound.sh');
  for (const [dialect, command, expected] of [['claude', 'git push origin demo', 'ask'], ['codex', 'gh api -X POST repos/example/demo/issues', 'deny']]) {
    const result = run('bash', [hook, dialect], { input: JSON.stringify({ tool_name: 'Bash', tool_input: { command } }) });
    assert.equal(result.status, 0); assert.equal(JSON.parse(result.stdout).hookSpecificOutput.permissionDecision, expected);
  }
  assert.equal(run('bash', [hook, 'claude'], { input: '{"tool_name":"Bash","tool_input":{"command":"git status"}}' }).stdout, '');
});

test('T03: canned WebFetch/WebSearch/Agent and forge failures remain explicit simulations', () => {
  // This child accepts only canned operation names. It never launches a harness,
  // forge, browser, shell or request from the message data.
  const stub = 'const allowed = new Set(["WebFetch", "WebSearch", "Agent", "gh", "glab"]); if (!allowed.has(process.argv[1])) process.exit(2); process.stdout.write(JSON.stringify({state:"blocked",reason:"offline-fixture",live:false}));';
  for (const operation of ['WebFetch', 'WebSearch', 'Agent', 'gh', 'glab']) {
    const result = run(process.execPath, ['-e', stub, '--', operation]);
    assert.equal(result.status, 0); assert.deepEqual(JSON.parse(result.stdout), { state: 'blocked', reason: 'offline-fixture', live: false });
    const b = book(), r = request(); send(b, r);
    const failure = reply(r, 'failure');
    failure.payload.summary = `${operation}: ${JSON.parse(result.stdout).reason}`;
    assert.equal(send(b, failure).state, 'failed');
    rejectsUnchanged(b, () => send(b, reply(r, 'result', { sent_at_ms: 3 })), 'transaction-closed');
    assert.deepEqual(b.snapshot.current_review_go, []);
  }
  assert.equal(run(process.execPath, ['-e', stub, '--', 'unexpected']).status, 2);
});

test('T04: setup help and unknown flags create no files; adapter check is read-only', t => {
  const root = scratch(t);
  assert.equal(run(process.execPath, [join(ROOT, 'scripts/setup.mjs'), '--help'], { cwd: root }).status, 0);
  assert.equal(run(process.execPath, [join(ROOT, 'scripts/setup.mjs'), '--unknown'], { cwd: root }).status, 1);
  assert.deepEqual(readdirSync(root), []);
  assert.equal(run(process.execPath, [join(ROOT, 'scripts/build-adapters.mjs'), '--check']).status, 0);
});

test('T05: real Git and queue helper preserve synthetic local work across review', t => {
  const root = scratch(t), repo = join(root, 'repo'), cache = join(root, 'cache'); mkdirSync(repo); mkdirSync(cache);
  const git = args => { const result = run('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: repo }); assert.equal(result.status, 0); return result; };
  git(['init', '-q', '-b', 'main']); git(['config', 'user.name', 'Synthetic Example']); git(['config', 'user.email', 'example@example.invalid']);
  git(['commit', '-q', '--allow-empty', '-m', 'Synthetic baseline']); git(['checkout', '-q', '-b', 'review/example']);
  mkdirSync(join(repo, 'spec')); writeFileSync(join(repo, 'spec/example.test.js'), 'synthetic fixture\n');
  git(['add', 'spec/example.test.js']); git(['commit', '-q', '-m', 'Synthetic candidate']); git(['checkout', '-q', 'main']);
  writeFileSync(join(repo, 'local.txt'), 'preserve synthetic work\n');
  const queue = args => run('bash', [join(ROOT, 'examples/review-queue/queue.sh'), ...args], { cwd: repo, env: { ...env, OUT: cache, BASE: 'main' } });
  for (const args of [['list'], ['brief', 'review/example'], ['apply', 'review/example'], ['restore', 'review/example']]) assert.equal(queue(args).status, 0);
  assert.equal(git(['branch', '--show-current']).stdout.trim(), 'main');
  assert.equal(readFileSync(join(repo, 'local.txt'), 'utf8'), 'preserve synthetic work\n'); assert.equal(git(['stash', 'list']).stdout, '');
});
