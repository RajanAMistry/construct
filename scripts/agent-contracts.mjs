#!/usr/bin/env node
// Source-checkout offline prototype. No harness, network or artifact-file access.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const schema = JSON.parse(readFileSync(new URL('../contracts/agent-message.v1.schema.json', import.meta.url), 'utf8'));
const LIMIT = 128 * 1024;
const requests = new Map([['assignment', 'result'], ['consultation-request', 'consultation-response'], ['review-request', 'review-result']]);
const active = new Set(['requested', 'acknowledged']);
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const digest = content => createHash('sha256').update(content).digest('hex');

export class ContractError extends Error {
  constructor(code) { super(code); this.code = code; }
}
const requireThat = (condition, code) => { if (!condition) throw new ContractError(code); };

// Only the keywords in the checked-in schema are supported. Fail on additions
// rather than silently ignoring a constraint; this is not a general validator.
const keywords = new Set(['$schema', '$id', 'title', '$defs', '$ref', 'type', 'const', 'enum', 'oneOf',
  'properties', 'required', 'additionalProperties', 'items', 'minItems', 'maxItems', 'uniqueItems',
  'minLength', 'maxLength', 'pattern', 'minimum', 'maximum']);
function inspectSchema(s) {
  for (const key of Object.keys(s)) requireThat(keywords.has(key), 'unsupported-schema-keyword');
  if (s.$ref) requireThat(/^#\/\$defs\/[A-Za-z]+$/.test(s.$ref) && schema.$defs[s.$ref.slice(8)], 'unsupported-schema-reference');
  for (const child of Object.values(s.properties || {})) inspectSchema(child);
  for (const child of Object.values(s.$defs || {})) inspectSchema(child);
  for (const child of s.oneOf || []) inspectSchema(child);
  if (s.items) inspectSchema(s.items);
}
inspectSchema(schema);

function check(s, value, path, errors) {
  const fail = code => errors.push({ path, code });
  if (s.$ref) check(schema.$defs[s.$ref.slice(8)], value, path, errors);
  const types = s.type ? [s.type].flat() : [];
  const matches = type => type === 'null' ? value === null : type === 'array' ? Array.isArray(value)
    : type === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value)
    : type === 'integer' ? Number.isSafeInteger(value) : typeof value === type;
  if (types.length && !types.some(matches)) { fail('type'); return; }
  if ('const' in s && value !== s.const) fail('const');
  if (s.enum && !s.enum.includes(value)) fail('enum');
  if (s.oneOf && s.oneOf.filter(branch => { const e = []; check(branch, value, path, e); return !e.length; }).length !== 1) fail('oneOf');
  if (typeof value === 'string') {
    const length = [...value].length;
    if (length < (s.minLength ?? 0) || length > (s.maxLength ?? Infinity)) fail('length');
    if (s.pattern && !new RegExp(s.pattern, 'u').test(value)) fail('pattern');
  }
  if (typeof value === 'number' && (value < (s.minimum ?? -Infinity) || value > (s.maximum ?? Infinity))) fail('range');
  if (Array.isArray(value)) {
    if (value.length < (s.minItems ?? 0) || value.length > (s.maxItems ?? Infinity)) fail('items');
    if (s.uniqueItems && new Set(value.map(stable)).size !== value.length) fail('uniqueItems');
    if (s.items) value.forEach((item, i) => check(s.items, item, `${path}/${i}`, errors));
  } else if (value !== null && typeof value === 'object') {
    for (const key of s.required || []) if (!Object.hasOwn(value, key)) errors.push({ path: `${path}/${key}`, code: 'required' });
    if (s.additionalProperties === false && Object.keys(value).some(key => !Object.hasOwn(s.properties || {}, key))) fail('additionalProperties');
    for (const [key, child] of Object.entries(s.properties || {})) if (Object.hasOwn(value, key)) check(child, value[key], `${path}/${key}`, errors);
  }
}

export function parseMessage(text) {
  requireThat(typeof text === 'string' && Buffer.byteLength(text) <= LIMIT, 'input-limit');
  let value;
  try { value = JSON.parse(text); } catch { throw new ContractError('invalid-json'); }
  const tokens = text.match(/"(?:\\[\s\S]|[^"\\])*"|[{}\[\]:,]|[^\s{}\[\]:,]+/gu) || [];
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '{' || token === '[') {
      stack.push(token === '{' ? new Set() : null);
      requireThat(stack.length <= 16, 'input-depth');
    } else if (token === '}' || token === ']') stack.pop();
    else if (token.startsWith('"') && tokens[i + 1] === ':') {
      const key = JSON.parse(token), keys = stack.at(-1);
      requireThat(!keys.has(key), 'duplicate-key'); keys.add(key);
    }
  }
  return value;
}

export function validateMessage(value) {
  const errors = [];
  check(schema, value, '', errors);
  return errors;
}
const validDefinition = (name, value) => { const errors = []; check(schema.$defs[name], value, '', errors); return !errors.length; };

export class TransactionBook {
  #task; #candidate; #coordinator; #participants; #artifacts; #transactions = new Map();
  #messages = new Map(); #groups = new Map(); #events = []; #now = 0; #candidates = new Set();

  constructor({ task_id, candidate, coordinator, participants, artifacts = [] }) {
    requireThat(validDefinition('id', task_id) && validDefinition('id', candidate), 'invalid-context');
    requireThat(participants && Object.keys(participants).every(id => validDefinition('id', id) && validDefinition('id', participants[id]))
      && Object.hasOwn(participants, coordinator) && participants[coordinator] === 'delivery-lead', 'invalid-roster');
    this.#task = task_id; this.#candidate = candidate; this.#coordinator = coordinator;
    this.#candidates.add(candidate);
    this.#participants = new Map(Object.entries(participants)); this.#artifacts = new Map();
    for (const artifact of artifacts) {
      requireThat(validDefinition('path', artifact.path) && validDefinition('id', artifact.candidate)
        && typeof artifact.content === 'string' && Buffer.byteLength(artifact.content) <= LIMIT, 'invalid-artifact');
      const key = `${artifact.candidate}/${artifact.path}`;
      requireThat(!this.#artifacts.has(key), 'duplicate-artifact');
      this.#artifacts.set(key, digest(artifact.content));
    }
  }

  #clock(now) { requireThat(Number.isSafeInteger(now) && now >= this.#now, 'invalid-clock'); }
  #capacity() { requireThat(this.#messages.size < 512 && this.#events.length < 1024, 'ledger-limit'); }
  #evidence(refs) {
    for (const ref of refs) requireThat(this.#artifacts.get(`${this.#candidate}/${ref.path}`) === ref.sha256, 'unavailable-or-changed-evidence');
  }
  #checks(payload, criteria) {
    requireThat(stable(payload.checks.map(c => c.criterion).sort()) === stable([...criteria].sort()), 'criterion-coverage');
    this.#evidence(payload.checks.map(c => c.evidence));
  }

  accept(input, { sender, now }) {
    requireThat(!validateMessage(input).length, 'invalid-message');
    const m = structuredClone(input);
    this.#clock(now);
    requireThat(this.#participants.has(sender) && sender === m.sender && this.#participants.has(m.recipient) && sender !== m.recipient, 'identity-mismatch');
    requireThat(m.task_id === this.#task, 'wrong-task');
    requireThat(m.candidate === this.#candidate, 'stale-candidate');
    requireThat(m.sent_at_ms <= now, 'future-message');
    const encoded = stable(m), previous = this.#messages.get(m.message_id);
    if (previous) {
      requireThat(previous === encoded, 'conflicting-duplicate');
      this.#now = now;
      return { status: 'duplicate', state: this.#transactions.get(m.transaction_id).state };
    }
    this.#capacity();
    let transaction = this.#transactions.get(m.transaction_id), group;
    if (requests.has(m.kind)) {
      requireThat(!transaction && m.in_reply_to === null, 'invalid-request');
      requireThat(this.#transactions.size < 128, 'ledger-limit');
      requireThat(m.payload.deadline_ms > now && m.payload.deadline_ms - now <= 20000, 'invalid-deadline');
      if (m.kind === 'assignment') requireThat(sender === this.#coordinator, 'assignment-authority');
      if (m.kind === 'review-request') requireThat(['reviewer', 'qa-verifier', 'security-privacy'].includes(this.#participants.get(m.recipient)), 'review-capability');
      const { deadline_ms, ...terms } = m.payload;
      const signature = stable([m.kind, m.sender, m.recipient, terms]);
      const key = `${m.candidate}/${m.work_id}`;
      const prior = this.#groups.get(key);
      if (prior) {
        requireThat(prior.signature === signature, 'changed-retry-contract');
        const last = this.#transactions.get(prior.last);
        requireThat(last.state === 'timed-out' || (last.state === 'failed' && last.failure.retryable), 'work-not-retryable');
        requireThat(prior.attempts < 2, 'retry-budget-exhausted');
      }
      this.#evidence(m.payload.inputs || m.payload.evidence || []);
      group = { key, signature, attempts: (prior?.attempts || 0) + 1, last: m.transaction_id };
      transaction = { request: m, state: 'requested', last_sent_at_ms: m.sent_at_ms };
    } else {
      requireThat(transaction, 'unknown-transaction');
      const r = transaction.request;
      requireThat(m.sender === r.recipient && m.recipient === r.sender && m.in_reply_to === r.message_id && m.work_id === r.work_id, 'reply-mismatch');
      requireThat(active.has(transaction.state), 'transaction-closed');
      requireThat(now < r.payload.deadline_ms, 'deadline-expired');
      requireThat(m.sent_at_ms >= transaction.last_sent_at_ms, 'out-of-order');
      transaction = structuredClone(transaction);
      if (m.kind === 'acknowledgment') {
        requireThat(transaction.state === 'requested', 'already-acknowledged');
        transaction.state = 'acknowledged';
      } else if (m.kind === 'failure') {
        transaction.state = 'failed'; transaction.failure = m.payload;
      } else {
        requireThat(transaction.state === 'acknowledged', 'acknowledgment-required');
        requireThat(m.kind === requests.get(r.kind), 'unexpected-result');
        this.#evidence(m.payload.evidence);
        if (m.kind === 'result' || m.kind === 'review-result') this.#checks(m.payload, r.payload.criteria);
        if (m.kind === 'review-result') {
          requireThat(this.#participants.has(m.payload.remediation_owner) && m.payload.retest_owner === m.sender, 'review-owners');
          if (m.payload.verdict === 'go') requireThat(!m.payload.findings.length && m.payload.checks.every(c => c.result === 'passed'), 'unsupported-go');
          else requireThat(m.payload.findings.length > 0, 'missing-findings');
        }
        transaction.state = 'completed'; transaction.result = m.payload;
      }
      transaction.last_sent_at_ms = m.sent_at_ms;
    }
    this.#transactions.set(m.transaction_id, transaction);
    if (group) this.#groups.set(group.key, group);
    this.#messages.set(m.message_id, encoded); this.#now = now;
    this.#events.push({ message_id: m.message_id, transaction_id: m.transaction_id, candidate: m.candidate, state: transaction.state });
    return { status: 'accepted', state: transaction.state };
  }

  expire(now) {
    this.#clock(now); this.#capacity();
    const expired = [...this.#transactions].filter(([, t]) => active.has(t.state) && now >= t.request.payload.deadline_ms);
    requireThat(this.#events.length + expired.length <= 1024, 'ledger-limit');
    for (const [id, t] of expired) {
      t.state = 'timed-out';
      this.#events.push({ transaction_id: id, candidate: t.request.candidate, state: 'timed-out' });
    }
    this.#now = now;
    return expired.length;
  }

  advanceCandidate(candidate, { sender, now }) {
    this.#clock(now); this.#capacity();
    requireThat(sender === this.#coordinator && validDefinition('id', candidate) && candidate !== this.#candidate, 'candidate-authority');
    requireThat(!this.#candidates.has(candidate), 'candidate-reused');
    for (const t of this.#transactions.values()) if (active.has(t.state)) t.state = 'stale';
    this.#candidate = candidate; this.#candidates.add(candidate); this.#now = now;
    this.#events.push({ candidate, state: 'candidate-changed' });
  }

  get snapshot() {
    return structuredClone({ task_id: this.#task, candidate: this.#candidate, events: this.#events,
      transactions: Object.fromEntries(this.#transactions),
      current_review_go: [...this.#transactions].filter(([, t]) => t.request.candidate === this.#candidate
        && t.request.kind === 'review-request' && t.state === 'completed' && t.result.verdict === 'go').map(([id]) => id) });
  }
}

async function cli() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    process.stdout.write('Usage: node scripts/agent-contracts.mjs < message.json\nValidate message shape only; no delivery, authentication or lifecycle check.\nExits: 0 valid; 1 invalid input; 2 usage. Maximum input: 128 KiB. No network or writes.\n'); return;
  }
  if (args.length) { process.stderr.write('Usage: node scripts/agent-contracts.mjs < message.json\n'); process.exitCode = 2; return; }
  try {
    const chunks = []; let bytes = 0;
    for await (const chunk of process.stdin) {
      bytes += chunk.length; requireThat(bytes <= LIMIT, 'input-limit'); chunks.push(chunk);
    }
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)); }
    catch { throw new ContractError('invalid-utf8'); }
    const errors = validateMessage(parseMessage(text));
    process.stdout.write(`${JSON.stringify({ valid: !errors.length, scope: 'message-shape-only', errors })}\n`);
    if (errors.length) process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error instanceof ContractError ? error.code : 'validation-error'}\n`); process.exitCode = 1;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await cli();
