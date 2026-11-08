#!/usr/bin/env node
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { realpathSync } from 'node:fs';
import { HARNESSES, projectPaths, loadSnapshot, buildPlan, applyPlan } from './setup/install.mjs';

const HELP = `Construct guided setup\n\n  npm run setup\n  node /path/to/construct/scripts/setup.mjs\n\nRequires Node.js 22+, Git and Linux/macOS. Run from the intended project\n(or use npm --prefix /path/to/construct run setup). No network requests.\nSelect multiple menu choices with comma-separated numbers, or enter all.\nNo files change before final confirmation. Ctrl+C, EOF or No cancels.\nProject paths must exist; comma characters in paths are not supported.\n`;
class Cancelled extends Error {}

export async function wizard({ input = process.stdin, output = process.stdout, cwd = process.env.INIT_CWD || process.cwd(), home = homedir(), env = process.env } = {}) {
  const rl = createInterface({ input, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  const interrupt = () => rl.close();
  process.once('SIGINT', interrupt);
  const say = text => output.write(`${text}\n`);
  const ask = async text => {
    output.write(`${text} `);
    const answer = await lines.next();
    if (answer.done) throw new Cancelled();
    return answer.value.trim();
  };
  const choose = async (title, options, multiple = false) => {
    say(`\n${title}`);
    options.forEach((option, i) => say(`  ${i + 1}. ${option}`));
    for (;;) {
      const answer = await ask(multiple ? 'Numbers separated by commas (or all):' : 'Choice:');
      const indices = multiple && answer.toLowerCase() === 'all' ? options.map((_, i) => i)
        : answer.split(',').map(n => /^\d+$/.test(n.trim()) ? Number(n.trim()) - 1 : -1);
      if (indices.length && (multiple || indices.length === 1) && indices.every(i => i >= 0 && i < options.length)) return [...new Set(indices)];
      say('Choose from the displayed options.');
    }
  };
  try {
    say('Construct setup: review a snapshot installation before applying it.');
    say('No credentials, sign-in, downloads or CLI installations.');
    const [scope] = await choose('Where do you need Construct?', ['Current project', 'Other project folders', 'Global (this user)', 'Both global and project folders']);
    let projects = [];
    if (scope === 0) projects = projectPaths('current', cwd, home);
    else if (scope === 1 || scope === 3) {
      for (;;) {
        try { projects = projectPaths(await ask('Project paths, comma-separated (Enter/current = current project):'), cwd, home); break; }
        catch (e) { if (e instanceof Cancelled) throw e; say(e.message); }
      }
    }
    const targets = [...(scope >= 2 ? [{ scope: 'global' }] : []), ...projects.map(path => ({ scope: 'project', path }))];
    const selected = await choose('Which harnesses? Select one or several; all selects all four.', ['Claude Code', 'OpenCode', 'pi', 'Codex'], true);
    const harnesses = selected.map(i => HARNESSES[i]);
    const choices = await choose('Which services? Choices and instructions only.', ['GitHub', 'GitLab', 'Custom services', 'None for now'], true);
    if (choices.includes(3) && choices.length > 1) throw new Error('None for now cannot be combined with services. Rerun setup.');
    const services = choices.filter(i => i < 2).map(i => ['GitHub', 'GitLab'][i]);
    if (choices.includes(2)) {
      const names = await ask('Custom service names, comma-separated (names only, no URLs or credentials):');
      if (!names || /[:/@\\]/.test(names)) throw new Error('Use service names only, without URLs or credentials.');
      services.push(...names.split(',').map(s => s.trim()).filter(Boolean));
    }
    const collectPaths = async title => {
      for (;;) {
        const answer = await ask(`${title}, comma-separated (Enter = none):`);
        if (!answer) return [];
        try { return projectPaths(answer, cwd, home); } catch (e) { say(e.message); }
      }
    };
    const repositories = await collectPaths('Existing repository folders to record');
    const folders = await collectPaths('Other working folders to record');
    const snapshot = loadSnapshot(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
    const plan = buildPlan({ snapshot, targets, harnesses, services, repositories, folders, home: realpathSync(home), env });
    say(`\nReview: ${harnesses.join(', ')}; snapshot ${snapshot.id}; source revision ${snapshot.revision}.`);
    say('Installed resources link only to the local snapshot, never to the source checkout.');
    say('OVERWRITE means replace the entire listed file, directory or link; unrelated files remain.');
    for (const store of plan.stores) {
      const entries = plan.operations.filter(op => op.path.startsWith(join(store, 'snapshots') + '/'));
      const changed = entries.filter(op => op.action !== 'unchanged');
      say(`SNAPSHOT ${join(store, 'snapshots', snapshot.id)} (${entries.length} entries, ${changed.length} changes)`);
    }
    for (const op of plan.operations.filter(op => !op.path.includes(`${join('.construct-setup', 'snapshots')}/`))) {
      say(`${op.action.toUpperCase()} ${op.path}${op.link !== undefined ? ` -> ${op.link}` : ''}`);
      if (op.action !== 'unchanged' && op.link === undefined) say(op.content.toString());
    }
    say(`\nServices: ${services.join(', ') || 'none'}. Live connection validity: unverified.`);
    if (services.includes('GitHub')) say('GitHub: inspect gh --help and gh auth login --help, or choose a connected GitHub integration. Sign in yourself.');
    if (services.includes('GitLab')) say('GitLab: inspect glab --help and glab auth login --help, or choose a connected GitLab integration. Confirm the host and sign in yourself.');
    plan.notes.forEach(say);
    const overwrites = plan.operations.filter(op => op.action === 'overwrite').length;
    const changes = plan.operations.filter(op => op.action !== 'unchanged').length;
    if (!changes) { say('Already installed with these choices. No changes.'); return { changed: 0 }; }
    say(`\n${changes} changes; ${overwrites} overwrites. Backups will be saved under .construct-setup/backups before overwriting.`);
    const consent = await ask('Continue and apply this plan, including the listed overwrites? [y/N]');
    if (!['y', 'yes'].includes(consent.toLowerCase())) throw new Cancelled();
    const result = applyPlan(plan, { approved: true });
    say(`Applied ${result.changed} changes. Choices saved in each .construct-setup/plan.json.`);
    if (result.manifest) say(`Backup mapping for manual restore: ${result.manifest}`);
    say('File installation complete. Harness discovery, guards and live authentication must be verified separately.');
    return result;
  } catch (e) {
    if (e instanceof Cancelled) { say('\nCancelled. No setup changes applied.'); return { cancelled: true }; }
    throw e;
  } finally {
    process.removeListener('SIGINT', interrupt);
    rl.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) process.stdout.write(HELP);
  else if (process.argv.length > 2) { process.stderr.write('Unknown argument. Use --help.\n'); process.exitCode = 1; }
  else if (process.platform === 'win32') { process.stderr.write('This setup currently supports Linux and macOS.\n'); process.exitCode = 1; }
  else await wizard().catch(e => { process.stderr.write(`Setup stopped: ${e.message}\n`); process.exitCode = 1; });
}
