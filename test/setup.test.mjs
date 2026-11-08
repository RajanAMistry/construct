import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, readlinkSync,
  realpathSync, rmSync, lstatSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable, Writable } from 'node:stream';
import { execFileSync, spawnSync, spawn } from 'node:child_process';
import { HARNESSES, projectPaths, loadSnapshot, buildPlan, applyPlan } from '../scripts/setup/install.mjs';
import { wizard } from '../scripts/setup.mjs';
const SOURCE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = loadSnapshot(SOURCE);
function fixture(t) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'construct-setup-')));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const home = join(root, 'home');
  const project = join(root, 'project with spaces');
  mkdirSync(home); mkdirSync(project);
  const options = { snapshot, home, targets: [{ scope: 'project', path: project }], harnesses: HARNESSES };
  return { root, home, project, options };
}
async function runWizard(f, answers) {
  let output = '';
  const result = await wizard({ input: Readable.from(answers.map(a => `${a}\n`)),
    output: new Writable({ write(chunk, encoding, callback) { output += chunk; callback(); } }),
    cwd: f.project, home: f.home, env: {} });
  return { result, output };
}

test('all four project installs resolve to a copied snapshot with working guard paths', t => {
  const f = fixture(t);
  const result = applyPlan(buildPlan(f.options), { approved: true });
  assert.ok(result.changed > 100);
  const skill = join(f.project, '.agents/skills/git-workflow/SKILL.md');
  assert.match(readFileSync(skill, 'utf8'), /# Git workflow/);
  assert.ok(realpathSync(skill).startsWith(join(f.project, '.construct-setup')));
  assert.ok(!realpathSync(skill).startsWith(SOURCE));
  assert.ok(existsSync(join(f.project, '.claude/agents/reviewer.md')));
  assert.ok(existsSync(join(f.project, '.opencode/commands/code-review.md')));
  assert.ok(existsSync(join(f.project, '.codex/agents/reviewer.toml')));
  assert.ok(existsSync(join(f.project, '.pi/agents/reviewer.md')));
  const pi = JSON.parse(readFileSync(join(f.project, '.pi/settings.json')));
  assert.ok(existsSync(join(pi.packages[0], 'package.json')));
  const extension = readFileSync(join(pi.packages[0], 'adapters/pi/extensions/construct-guard.ts'), 'utf8');
  assert.match(extension, /outbound.json/);
  assert.ok(existsSync(join(pi.packages[0], 'hooks/outbound.json')));
  const hooks = JSON.parse(readFileSync(join(f.project, '.claude/settings.json'))).hooks;
  assert.match(hooks.PreToolUse[0].hooks[0].command, /bash '/);
  assert.ok(!hooks.PreToolUse[0].hooks[0].command.includes('CLAUDE_PLUGIN_ROOT'));
  const codex = readFileSync(join(f.project, '.codex/hooks.json'), 'utf8');
  assert.ok(!codex.includes('$CONSTRUCT_DIR'));
  assert.equal(result.manifest, null);
});

test('identical rerun makes no changes or backups', t => {
  const f = fixture(t);
  applyPlan(buildPlan(f.options), { approved: true });
  const plan = buildPlan(f.options);
  assert.ok(plan.operations.every(op => op.action === 'unchanged'));
  assert.equal(applyPlan(plan, { approved: true }).changed, 0);
  assert.ok(!existsSync(join(f.project, '.construct-setup/backups')));
});

test('existing configuration is backed up exactly; unrelated files survive', t => {
  const f = fixture(t);
  mkdirSync(join(f.project, '.claude'));
  const settings = join(f.project, '.claude/settings.json');
  const old = '{"user_setting":"synthetic previous preference"}\n';
  writeFileSync(settings, old, { mode: 0o640 });
  const oldMode = lstatSync(settings).mode & 0o777;
  writeFileSync(join(f.project, '.claude/unrelated.txt'), 'keep');
  const plan = buildPlan(f.options);
  assert.equal(plan.operations.find(op => op.path === settings).action, 'overwrite');
  const result = applyPlan(plan, { approved: true });
  const mapping = JSON.parse(readFileSync(result.manifest));
  const backup = mapping.find(item => item.path === settings).backup;
  assert.equal(readFileSync(backup, 'utf8'), old);
  assert.equal(lstatSync(backup).mode & 0o777, oldMode);
  assert.equal(readFileSync(join(f.project, '.claude/unrelated.txt'), 'utf8'), 'keep');
  assert.ok(!(lstatSync(dirname(result.manifest)).mode & 0o077));
});

test('global plus multiple projects support selected harnesses and explicit config roots', t => {
  const f = fixture(t);
  const second = join(f.root, 'second'); mkdirSync(second);
  const codexRoot = join(f.root, 'custom codex');
  const plan = buildPlan({ ...f.options, harnesses: ['codex', 'pi'], env: { CODEX_HOME: codexRoot },
    targets: [{ scope: 'global' }, ...[f.project, second].map(path => ({ scope: 'project', path }))] });
  applyPlan(plan, { approved: true });
  for (const base of [f.home, f.project, second]) {
    assert.ok(existsSync(join(base, '.agents/skills/construct/SKILL.md')));
    assert.ok(!existsSync(join(base, '.claude')));
  }
  assert.ok(existsSync(join(codexRoot, 'agents/reviewer.toml')));
  assert.ok(existsSync(join(f.home, '.pi/agent/settings.json')));
  assert.ok(!existsSync(join(f.home, '.codex')));
});

test('No cancels the entire reviewed plan without writes', async t => {
  const f = fixture(t);
  mkdirSync(join(f.project, '.claude'));
  writeFileSync(join(f.project, '.claude/settings.json'), 'old config');
  const { result, output } = await runWizard(f, ['1', 'all', '4', '', '', 'no']);
  assert.equal(result.cancelled, true);
  assert.match(output, /OVERWRITE/);
  assert.equal(readFileSync(join(f.project, '.claude/settings.json'), 'utf8'), 'old config');
  assert.ok(!existsSync(join(f.project, '.construct-setup')));
  assert.ok(!existsSync(join(f.project, '.codex')));
});

test('EOF before confirmation cancels without installing', async t => {
  const f = fixture(t);
  assert.equal((await runWizard(f, ['1', '1,4', '4', '', ''])).result.cancelled, true);
  assert.ok(!existsSync(join(f.project, '.construct-setup')));
});

test('wizard accepts multi-select, both scopes, paths, service choices and confirmation', async t => {
  const f = fixture(t);
  const second = join(f.root, 'second'); mkdirSync(second);
  const { result, output } = await runWizard(f, ['4', `${f.project}, ${second}`, '1,4', '1,2', f.project, f.root, 'yes']);
  assert.ok(result.changed > 0);
  assert.match(output, /Live connection validity: unverified/);
  for (const base of [f.home, f.project, second]) {
    const record = JSON.parse(readFileSync(join(base, '.construct-setup/plan.json')));
    assert.deepEqual(record.harnesses, ['claude', 'codex']);
    assert.deepEqual(record.services, ['GitHub', 'GitLab']);
    assert.deepEqual(record.repositories, [f.project]);
    assert.deepEqual(record.folders, [f.root]);
    assert.ok(!existsSync(join(base, '.opencode')));
  }
});

test('rejects stale plans and unapproved application before any setup writes', t => {
  const f = fixture(t);
  const plan = buildPlan(f.options);
  assert.throws(() => applyPlan(plan), /confirmation/);
  mkdirSync(join(f.project, '.claude'));
  writeFileSync(join(f.project, '.claude/settings.json'), 'concurrent edit');
  assert.throws(() => applyPlan(plan, { approved: true }), /Changed since review/);
  assert.ok(!existsSync(join(f.project, '.construct-setup')));
});

test('refuses destination symlink parents rather than modifying a different installation', t => {
  const f = fixture(t);
  const elsewhere = join(f.root, 'elsewhere'); mkdirSync(elsewhere);
  symlinkSync(elsewhere, join(f.project, '.claude'));
  assert.throws(() => buildPlan(f.options), /plain directory/);
  assert.ok(!existsSync(join(elsewhere, 'settings.json')));
});

test('overwrite preserves symlink itself in backup, never changes its referent', t => {
  const f = fixture(t);
  mkdirSync(join(f.project, '.claude'));
  const elsewhere = join(f.root, 'settings.json'); writeFileSync(elsewhere, 'keep original');
  const settings = join(f.project, '.claude/settings.json'); symlinkSync(elsewhere, settings);
  const result = applyPlan(buildPlan(f.options), { approved: true });
  const mapping = JSON.parse(readFileSync(result.manifest));
  assert.equal(readlinkSync(mapping.find(e => e.path === settings).backup), elsewhere);
  assert.equal(readFileSync(elsewhere, 'utf8'), 'keep original');
});

test('failed application restores overwritten files and removes new resources', t => {
  const f = fixture(t);
  mkdirSync(join(f.project, '.claude'));
  const settings = join(f.project, '.claude/settings.json'); writeFileSync(settings, 'original');
  const plan = buildPlan(f.options);
  const final = plan.operations.find(op => op.path.endsWith('/plan.json'));
  final.content = undefined; // Simulate a failure after preceding writes and overwrite.
  assert.throws(() => applyPlan(plan, { approved: true }));
  assert.equal(readFileSync(settings, 'utf8'), 'original');
  assert.ok(!existsSync(join(f.project, '.codex')));
  assert.ok(!existsSync(join(f.project, '.construct-setup')));
});

test('snapshot excludes untracked/private files and rejects tracked source links outside checkout', t => {
  const f = fixture(t);
  const source = join(f.root, 'source'); mkdirSync(source);
  execFileSync('git', ['init', '-q', source]);
  mkdirSync(join(source, 'hooks')); writeFileSync(join(source, 'hooks/outbound.json'), '{}');
  writeFileSync(join(source, '.env'), 'synthetic untracked data');
  writeFileSync(join(source, 'hooks/untracked.json'), 'not public');
  writeFileSync(join(source, 'hooks/.env'), 'synthetic excluded configuration');
  execFileSync('git', ['-C', source, 'add', '-f', 'hooks/.env']);
  execFileSync('git', ['-C', source, 'add', 'hooks/outbound.json']);
  execFileSync('git', ['-C', source, '-c', 'user.name=Synthetic', '-c', 'user.email=synthetic@example.invalid', 'commit', '-qm', 'Fixture']);
  assert.deepEqual(loadSnapshot(source).entries.map(e => e.path), ['hooks/outbound.json']);
  symlinkSync(join(f.root, 'home'), join(source, 'hooks/escape'));
  execFileSync('git', ['-C', source, 'add', 'hooks/escape']);
  assert.throws(() => loadSnapshot(source), /escapes checkout/);
});

test('path input handles current, home expansion and duplicates; rejects missing targets', t => {
  const f = fixture(t);
  assert.deepEqual(projectPaths('current', f.project, f.home), [f.project]);
  assert.deepEqual(projectPaths(`${f.project},${f.project},~`, f.root, f.home), [f.project, f.home]);
  assert.throws(() => projectPaths('missing', f.root, f.home));
  assert.throws(() => projectPaths('current,', f.root, f.home));
});

test('command help and unknown arguments never create installation files', t => {
  const f = fixture(t);
  const script = join(SOURCE, 'scripts/setup.mjs');
  const help = spawnSync(process.execPath, [script, '--help'], { cwd: f.project, encoding: 'utf8' });
  assert.equal(help.status, 0); assert.match(help.stdout, /No files change/);
  assert.equal(spawnSync(process.execPath, [script, '--unexpected'], { cwd: f.project }).status, 1);
  assert.ok(!existsSync(join(f.project, '.construct-setup')));
});


test('SIGINT cancels a running wizard before applying any changes', { timeout: 5000 }, async t => {
  const f = fixture(t);
  const child = spawn(process.execPath, [join(SOURCE, 'scripts/setup.mjs')], {
    cwd: f.project, env: { ...process.env, INIT_CWD: f.project, HOME: f.home }, stdio: ['pipe', 'pipe', 'pipe'],
  });
  t.after(() => { if (child.exitCode === null) child.kill(); });
  let output = '';
  let interrupted = false;
  child.stdout.on('data', data => {
    output += data;
    if (!interrupted && output.includes('Choice:')) { interrupted = true; child.kill('SIGINT'); }
  });
  const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', resolve); });
  assert.equal(code, 0);
  assert.match(output, /Cancelled/);
  assert.ok(!existsSync(join(f.project, '.construct-setup')));
});

test('existing skill directory is backed up as a directory and replaced only after approval', t => {
  const f = fixture(t);
  const skill = join(f.project, '.agents/skills/construct');
  mkdirSync(skill, { recursive: true }); writeFileSync(join(skill, 'custom.md'), 'synthetic custom skill');
  const plan = buildPlan({ ...f.options, harnesses: ['codex'] });
  const result = applyPlan(plan, { approved: true });
  const backup = JSON.parse(readFileSync(result.manifest)).find(e => e.path === skill).backup;
  assert.equal(readFileSync(join(backup, 'custom.md'), 'utf8'), 'synthetic custom skill');
  assert.ok(lstatSync(skill).isSymbolicLink());
  assert.match(readFileSync(join(skill, 'SKILL.md'), 'utf8'), /The construct/);
});

test('refuses a redirected backup directory before touching configuration', t => {
  const f = fixture(t);
  const store = join(f.project, '.construct-setup'); mkdirSync(store);
  symlinkSync(f.home, join(store, 'backups'));
  mkdirSync(join(f.project, '.claude'));
  const settings = join(f.project, '.claude/settings.json'); writeFileSync(settings, 'original');
  const plan = buildPlan(f.options);
  assert.throws(() => applyPlan(plan, { approved: true }), /plain directory/);
  assert.equal(readFileSync(settings, 'utf8'), 'original');
  assert.ok(!existsSync(join(store, 'snapshots')));
});
