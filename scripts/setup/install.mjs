import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync, readlinkSync, realpathSync, readdirSync,
  mkdirSync, writeFileSync, symlinkSync, renameSync, rmSync, rmdirSync, openSync, closeSync, fchmodSync } from 'node:fs';
import { dirname, join, resolve, relative, isAbsolute, sep } from 'node:path';

export const HARNESSES = ['claude', 'opencode', 'pi', 'codex'];
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const hash = value => createHash('sha256').update(value).digest('hex');
const shellQuote = value => `'${value.replaceAll("'", "'\\''")}'`;
const inside = (base, path) => path === base || path.startsWith(`${base}${sep}`);
const stat = path => { try { return lstatSync(path); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } };

// Never follow an existing destination symlink while creating child entries.
function safeParents(path) {
  for (let p = dirname(path); ; p = dirname(p)) {
    const s = stat(p);
    if (s && (!s.isDirectory() || s.isSymbolicLink())) throw new Error(`Not a plain directory: ${p}`);
    if (p === dirname(p)) break;
  }
}
function fingerprint(path) {
  const s = stat(path);
  if (!s) return null;
  if (s.isSymbolicLink()) return `link:${readlinkSync(path)}`;
  if (s.isFile()) return `file:${s.mode & 0o777}:${hash(readFileSync(path))}`;
  if (s.isDirectory()) return `dir:${hash(json(readdirSync(path).sort().map(name => [name, fingerprint(join(path, name))])))}`;
  throw new Error(`Unsupported destination type: ${path}`);
}
export function projectPaths(value, cwd, home) {
  const parts = value.trim() === '' || value.trim().toLowerCase() === 'current'
    ? [cwd] : value.split(',').map(p => p.trim());
  if (parts.some(p => !p)) throw new Error('Enter current or nonempty comma-separated paths.');
  return [...new Set(parts.map(p => {
    const expanded = p === '~' ? home : p.startsWith('~/') ? join(home, p.slice(2)) : p;
    const target = realpathSync(resolve(cwd, expanded));
    if (!lstatSync(target).isDirectory()) throw new Error(`Not a project directory: ${target}`);
    return target;
  }))];
}

// Only tracked, allowlisted public library resources enter a snapshot. No .git,
// untracked files, environment files, personal configuration or credential stores.
export function loadSnapshot(source) {
  source = realpathSync(source);
  const roots = ['AGENTS.md', 'README.md', 'construct.md', 'package.json',
    'agents', 'skills', 'hooks', 'adapters', 'docs', 'templates', 'examples'];
  const paths = execFileSync('git', ['ls-files', '-z', '--', ...roots], { cwd: source, encoding: 'utf8' })
    .split('\0').filter(Boolean)
    .filter(path => !path.split('/').some(part => /^(?:\.env(?:\..*)?|credentials\.json|token\.json|\.construct-setup)$/.test(part) || /\.(?:pem|key)$/.test(part)))
    .sort();
  const entries = paths.map(path => {
    const absolute = join(source, path);
    if (!inside(source, realpathSync(absolute))) throw new Error(`Source link escapes checkout: ${path}`);
    const s = lstatSync(absolute);
    if (s.isSymbolicLink()) {
      const link = readlinkSync(absolute);
      const target = resolve(dirname(absolute), link);
      if (!inside(source, target)) throw new Error(`Source link escapes checkout: ${path}`);
      const portable = relative(source, target).split(sep).join('/');
      if (isAbsolute(link) || !paths.some(p => p === portable || p.startsWith(`${portable}/`))) {
        throw new Error(`Source link is not snapshot-local: ${path}`);
      }
      return { path, link };
    }
    if (!s.isFile()) throw new Error(`Unsupported source type: ${path}`);
    return { path, content: readFileSync(absolute), mode: s.mode & 0o777 };
  });
  if (!entries.some(e => e.path === 'hooks/outbound.json')) throw new Error('Not a complete Construct checkout.');
  const id = hash(json(entries.map(e => [e.path, e.link ?? hash(e.content), e.mode]))).slice(0, 20);
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
  return { entries, id, revision };
}

export function buildPlan({ snapshot, targets, harnesses, services = [], repositories = [], folders = [], home, env = {} }) {
  if (!harnesses.length || harnesses.some(h => !HARNESSES.includes(h))) throw new Error('Choose at least one supported harness.');
  if (!targets.length) throw new Error('Choose at least one target.');
  const operations = new Map();
  const add = entry => {
    entry.path = resolve(entry.path);
    safeParents(entry.path);
    const before = fingerprint(entry.path);
    const desired = entry.link !== undefined ? `link:${entry.link}` : `file:${entry.mode ?? 0o600}:${hash(entry.content)}`;
    const operation = { ...entry, before, action: before === desired ? 'unchanged' : before === null ? 'create' : 'overwrite' };
    const previous = operations.get(entry.path);
    if (previous && (previous.link !== entry.link || String(previous.content) !== String(entry.content))) {
      throw new Error(`Overlapping installations disagree at ${entry.path}`);
    }
    operations.set(entry.path, operation);
  };
  const file = (path, content, mode = 0o600) => add({ path, content: Buffer.from(content), mode });
  const notes = new Set();
  const stores = [];
  for (const target of targets) {
    const base = target.scope === 'global' ? home : target.path;
    if (!['global', 'project'].includes(target.scope) || !base || !stat(base)?.isDirectory()) throw new Error('Target must be an existing directory.');
    const store = join(base, '.construct-setup');
    stores.push(store);
    const library = join(store, 'snapshots', snapshot.id);
    file(join(store, '.gitignore'), '*\n');
    for (const entry of snapshot.entries) add({ ...entry, path: join(library, entry.path) });
    const link = (path, resource) => add({ path, link: join(library, resource) });
    const flat = (path, resource, filter = () => true) => {
      const prefix = `${resource}/`;
      const children = new Set(snapshot.entries.filter(e => e.path.startsWith(prefix)).map(e => e.path.slice(prefix.length).split('/')[0]));
      for (const child of [...children].sort().filter(filter)) link(join(path, child), `${resource}/${child}`);
    };
    const global = target.scope === 'global';
    for (const harness of harnesses) {
      if (harness === 'claude') {
        const root = global ? resolve(env.CLAUDE_CONFIG_DIR || join(home, '.claude')) : join(base, '.claude');
        flat(join(root, 'skills'), 'adapters/claude/skills');
        flat(join(root, 'agents'), 'adapters/claude/agents');
        const hooks = JSON.parse(snapshot.entries.find(e => e.path === 'hooks/hooks.json').content).hooks;
        for (const group of hooks.PreToolUse) for (const hook of group.hooks) {
          hook.command = `bash ${shellQuote(join(library, 'hooks/confirm-outbound.sh'))} claude`;
        }
        file(join(root, 'settings.json'), json({ hooks }));
        notes.add('Claude: restart; check /agents and /skills. Bash and jq are required for the shell guard.');
      } else if (harness === 'opencode') {
        const root = global ? resolve(env.OPENCODE_CONFIG_DIR || join(env.XDG_CONFIG_HOME || join(home, '.config'), 'opencode')) : join(base, '.opencode');
        flat(join(root, 'agents'), 'adapters/opencode/agents');
        flat(join(root, 'commands'), 'adapters/opencode/commands');
        flat(join(root, 'skills'), 'adapters/codex/skills');
        link(join(root, 'opencode.json'), 'adapters/opencode/opencode.json');
        notes.add('OpenCode: restart; check /agents and /commands. Existing higher-precedence settings may affect permissions.');
      } else if (harness === 'pi') {
        const root = global ? resolve(env.PI_CODING_AGENT_DIR || join(home, '.pi/agent')) : join(base, '.pi');
        file(join(root, 'settings.json'), json({ packages: [library] }));
        flat(join(root, 'agents'), 'adapters/pi/agents');
        notes.add('pi: restart or /reload and review project trust. Agent profiles require pi’s separate subagent extension; setup does not install it.');
      } else {
        const root = global ? resolve(env.CODEX_HOME || join(home, '.codex')) : join(base, '.codex');
        flat(join(global ? home : base, '.agents/skills'), 'adapters/codex/skills');
        flat(join(root, 'agents'), 'adapters/codex/agents');
        link(join(root, 'rules/construct.rules'), 'adapters/codex/rules/construct.rules');
        const hooks = JSON.parse(snapshot.entries.find(e => e.path === 'adapters/codex/hooks.json').content).hooks;
        for (const group of hooks.PreToolUse) for (const hook of group.hooks) {
          hook.command = `bash ${shellQuote(join(library, 'hooks/confirm-outbound.sh'))} codex`;
        }
        file(join(root, 'hooks.json'), json({ hooks }));
        notes.add('Codex: restart; check /skills and custom agents. Hooks require features.hooks = true in your config.toml; setup leaves that file untouched. Bash and jq are required for the shell guard.');
      }
    }
    file(join(store, 'plan.json'), json({ version: 1, snapshot: snapshot.id, sourceRevision: snapshot.revision,
      target, harnesses, services, repositories, folders, authentication: 'not checked', notes: [...notes] }));
  }
  notes.add('Service choices are recorded only. Use each service’s supported CLI or connector sign-in flow after checking its local help. No credentials are collected and no network or authentication checks run.');
  return { operations: [...operations.values()], stores: [...new Set(stores)], notes: [...notes], snapshot: snapshot.id };
}

// Approval belongs to the caller. Recheck the entire reviewed plan before any
// writes; backups are private copies made by rename, never by dereferencing links.
export function applyPlan(plan, { approved = false } = {}) {
  if (!approved) throw new Error('Setup requires explicit confirmation.');
  for (const op of plan.operations) {
    safeParents(op.path);
    if (fingerprint(op.path) !== op.before) throw new Error(`Changed since review; rerun setup: ${op.path}`);
  }
  const run = randomUUID();
  for (const store of plan.stores) safeParents(join(store, 'backups', run, 'entry'));
  const pending = plan.operations.filter(op => op.action !== 'unchanged');
  const recovery = pending.map((op, index) => {
    const store = plan.stores.find(s => inside(dirname(s), op.path)) || plan.stores[0];
    return { path: op.path, backup: op.before === null ? null : join(store, 'backups', run, String(index)) };
  });
  const manifest = recovery.some(e => e.backup) ? join(plan.stores[0], 'backups', run, 'restore.json') : null;
  const changed = [];
  const createdDirs = [];
  const ensure = path => {
    const existing = stat(path);
    if (existing) {
      if (!existing.isDirectory() || existing.isSymbolicLink()) throw new Error(`Not a plain directory: ${path}`);
      return;
    }
    ensure(dirname(path));
    mkdirSync(path, { mode: 0o700 });
    createdDirs.push(path);
  };
  try {
    // Persist recovery destinations before the first overwrite, including when a
    // later process termination prevents the normal success message.
    if (manifest) {
      ensure(dirname(manifest));
      writeFileSync(manifest, json(recovery), { flag: 'wx', mode: 0o600 });
    }
    for (const [index, op] of pending.entries()) {
      safeParents(op.path);
      if (fingerprint(op.path) !== op.before) throw new Error(`Changed since review; rerun setup: ${op.path}`);
      const { backup } = recovery[index];
      if (backup) {
        safeParents(backup);
        ensure(dirname(backup));
        renameSync(op.path, backup);
      }
      const entry = { path: op.path, backup, created: false };
      changed.push(entry);
      ensure(dirname(op.path));
      if (op.link !== undefined) {
        symlinkSync(op.link, op.path);
        entry.created = true;
      } else {
        const fd = openSync(op.path, 'wx', op.mode);
        entry.created = true;
        try { writeFileSync(fd, op.content); fchmodSync(fd, op.mode); }
        finally { closeSync(fd); }
      }
      entry.installed = fingerprint(op.path);
    }
    return { changed: changed.length, manifest };
  } catch (error) {
    const recoveryErrors = [];
    for (const entry of changed.reverse()) {
      try {
        if (entry.created) {
          if (entry.installed && fingerprint(entry.path) !== entry.installed) throw new Error('Newer edit needs manual recovery.');
          rmSync(entry.path, { recursive: true, force: true });
        }
        if (entry.backup) {
          if (stat(entry.path)) throw new Error('Destination occupied; preserve both versions.');
          renameSync(entry.backup, entry.path);
        }
      } catch { recoveryErrors.push(entry.path); }
    }
    if (manifest && !recoveryErrors.length) {
      try { rmSync(manifest); } catch { /* Keep any remaining recovery evidence. */ }
    }
    for (const dir of createdDirs.reverse()) {
      try { rmdirSync(dir); } catch { /* Keep nonempty recovery directories. */ }
    }
    if (recoveryErrors.length) throw new Error(`Setup failed; manual recovery needed for ${recoveryErrors.join(', ')}. Backups: ${plan.stores.map(s => join(s, 'backups', run)).join(', ')}`, { cause: error });
    throw error;
  }
}
