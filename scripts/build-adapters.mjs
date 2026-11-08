#!/usr/bin/env node
// Generate the harness adapters and hook configs from the canonical sources:
// agents/*.md (Claude Code format), skills/<category>/<name>/SKILL.md,
// hooks/outbound.json and package.json (version).
//
//   node scripts/build-adapters.mjs          write the generated files
//   node scripts/build-adapters.mjs --check  exit 1 if any generated file is stale
//
// Never edit the generated files by hand. Generated:
//   adapters/opencode/agents/*.md, commands/*.md, opencode.json
//   adapters/pi/agents/*.md, skills/<name> (symlinks)
//   adapters/codex/agents/*.toml, skills/<name> (symlinks), rules/construct.rules, hooks.json
//   adapters/claude/.claude-plugin/plugin.json, skills/<name>, agents/*.md, hooks (symlinks)
//   hooks/hooks.json
import {
  readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync,
  lstatSync, readlinkSync, symlinkSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const outbound = JSON.parse(read("hooks/outbound.json"));
const pkg = JSON.parse(read("package.json"));

// Skills that only hold rules: loaded by name, no slash command.
const RULE_SKILLS = new Set(["construct"]);
// Claude Code tool names to pi's built-in tool names. Tools pi lacks are dropped.
const PI_TOOLS = { Read: ["read"], Grep: ["grep"], Glob: ["find", "ls"], Bash: ["bash"], Edit: ["edit"], Write: ["write"] };

function parse(file) {
  const m = read(file).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter in ${file}`);
  const [, fm, body] = m;
  const meta = {};
  let list = null;
  for (const line of fm.split("\n")) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && list) { meta[list].push(item[1].trim()); continue; }
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    list = kv[2] === "" ? kv[1] : null;
    meta[kv[1]] = list ? [] : kv[2].trim();
  }
  return { meta, body: body.replace(/^\n+/, "") };
}

const csv = (v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
const q = (s) => JSON.stringify(s); // a JSON string is valid YAML and valid TOML
const banner = (src) => `<!-- Generated from ${src} by scripts/build-adapters.mjs. Edit the source, then run it again. -->`;
const loadLine = (skills) =>
  skills.length ? `Before anything else, load these skills: ${skills.map((s) => `\`${s}\``).join(", ")}.\n\n` : "";

// Canonical skills live one level under a category folder. Every harness wants
// a flat skills/<name>/SKILL.md, so the adapters get symlink farms.
const skills = [];
for (const cat of readdirSync(join(ROOT, "skills")).sort()) {
  const catDir = join(ROOT, "skills", cat);
  if (!lstatSync(catDir).isDirectory()) continue;
  for (const name of readdirSync(catDir).sort()) {
    if (existsSync(join(catDir, name, "SKILL.md"))) skills.push({ name, path: `skills/${cat}/${name}` });
  }
}
// Supporting Markdown documents are not agent profiles.
const agentDocs = new Set(["README.md", "learning_checklist.md"]);
const agentFiles = readdirSync(join(ROOT, "agents")).filter((f) => f.endsWith(".md") && !agentDocs.has(f)).sort();

const out = new Map();   // path -> text content
const links = new Map(); // path -> relative symlink target

for (const f of agentFiles) {
  const src = `agents/${f}`;
  const { meta, body } = parse(src);
  const tools = new Set(csv(meta.tools));
  const denied = new Set(csv(meta.disallowedTools));
  const has = (t) => tools.has(t) && !denied.has(t);
  const skillList = meta.skills || [];
  const readOnly = !has("Edit") && !has("Write");
  const text = `${banner(src)}\n\n${loadLine(skillList)}${body}`;

  // OpenCode V2 agent: ordered permission rules, last match wins.
  const perms = [];
  if (readOnly) perms.push({ action: "edit", resource: "*", effect: "deny" });
  if (!tools.has("WebFetch")) perms.push({ action: "webfetch", resource: "*", effect: "deny" });
  if (has("Bash")) for (const p of outbound.opencode_shell_ask) perms.push({ action: "shell", resource: p, effect: "ask" });
  else perms.push({ action: "shell", resource: "*", effect: "deny" });
  const oc = ["---", `description: ${q(meta.description)}`, "mode: subagent", "permissions:"];
  for (const p of perms) oc.push(`  - action: ${p.action}`, `    resource: ${q(p.resource)}`, `    effect: ${p.effect}`);
  oc.push("---", "");
  out.set(`adapters/opencode/agents/${f}`, oc.join("\n") + text);

  // pi agent, for pi's example subagent extension.
  const piTools = [...new Set([...tools].filter((t) => !denied.has(t)).flatMap((t) => PI_TOOLS[t] || []))];
  const pi = ["---", `name: ${meta.name}`, `description: ${q(meta.description)}`, `tools: ${piTools.join(", ")}`, "---", ""];
  out.set(`adapters/pi/agents/${f}`, pi.join("\n") + text);

  // Codex custom agent: a config layer in TOML. Read-only agents also get the
  // read-only sandbox, so "never edits" is enforced, not just instructed.
  const tomlBody = (loadLine(skillList) + body)
    .replace(/\\/g, "\\\\")
    .replace(/"""/g, '\\"\\"\\"')
    .replace(/"$/, '\\"');
  const cx = [
    `# Generated from ${src} by scripts/build-adapters.mjs. Edit the source, then run it again.`,
    `name = ${q(meta.name)}`,
    `description = ${q(meta.description)}`,
  ];
  if (readOnly) cx.push('sandbox_mode = "read-only"');
  cx.push(`developer_instructions = """\n${tomlBody}\n"""`, "");
  out.set(`adapters/codex/agents/${meta.name}.toml`, cx.join("\n"));

  // Claude Code reads the canonical file unchanged.
  links.set(`adapters/claude/agents/${f}`, relative(join(ROOT, "adapters/claude/agents"), join(ROOT, src)));
}

// OpenCode slash commands: one per workflow skill.
for (const s of skills) {
  if (RULE_SKILLS.has(s.name)) continue;
  const { meta } = parse(`${s.path}/SKILL.md`);
  const summary = meta.description.split(/(?<=\.)\s/)[0];
  const cmd = ["---", `description: ${q(summary)}`, "---", banner(`${s.path}/SKILL.md`), "",
    `Load the \`${s.name}\` skill and follow it. Input from the user: $ARGUMENTS`, ""];
  out.set(`adapters/opencode/commands/${s.name}.md`, cmd.join("\n"));
}

// OpenCode global permissions: the guard for every agent, including built-ins.
const ocConfig = {
  $schema: "https://opencode.ai/config.json",
  permissions: outbound.opencode_shell_ask.map((resource) => ({ action: "shell", resource, effect: "ask" })),
};
out.set("adapters/opencode/opencode.json", JSON.stringify(ocConfig, null, 2) + "\n");

// Codex rules: prompt outside the sandbox for every argv prefix the guard knows.
const rules = [
  "# Generated from hooks/outbound.json by scripts/build-adapters.mjs. Edit the source, then run it again.",
  "# Prime directive 1: anything that pushes or posts prompts before running outside the sandbox.",
  "# Rules are experimental in Codex; the raw API mutation patterns live in the hook instead.",
  "",
];
for (const prefix of outbound.codex_rules) {
  rules.push("prefix_rule(",
    `    pattern = [${prefix.map(q).join(", ")}],`,
    '    decision = "prompt",',
    `    justification = ${q(outbound.reason)},`,
    ")", "");
}
out.set("adapters/codex/rules/construct.rules", rules.join("\n"));

// Codex hook: deny backstop for patterns prefix rules cannot express. Needs
// CONSTRUCT_DIR in the environment, pointing at this checkout.
const codexHookCmd = 'bash "$CONSTRUCT_DIR/hooks/confirm-outbound.sh" codex';
const codexHooks = {
  description: "Prime directive 1 backstop: raw forge API mutations and forge MCP writes are denied with a reason, because Codex hooks cannot prompt yet. Prefix commands are covered by rules/construct.rules. Generated by scripts/build-adapters.mjs from hooks/outbound.json; needs CONSTRUCT_DIR pointing at the construct checkout.",
  hooks: {
    PreToolUse: [
      { matcher: "Bash", hooks: [{ type: "command", command: codexHookCmd, timeout: 10 }] },
      { matcher: `mcp__.*__${outbound.mcp_write_tools}`, hooks: [{ type: "command", command: codexHookCmd, timeout: 10 }] },
    ],
  },
};
out.set("adapters/codex/hooks.json", JSON.stringify(codexHooks, null, 2) + "\n");

// Claude Code plugin hook config, read from the plugin's hooks/ symlink.
const claudeHookCmd = '"${CLAUDE_PLUGIN_ROOT}/hooks/confirm-outbound.sh"';
const claudeHooks = {
  description: "Prime directive 1: anything that posts, pushes or changes forge state asks the user first. Generated by scripts/build-adapters.mjs from hooks/outbound.json.",
  hooks: {
    PreToolUse: [
      { matcher: "Bash", hooks: [{ type: "command", command: claudeHookCmd, timeout: 10 }] },
      { matcher: `mcp__.*__(${outbound.mcp_write_tools})`, hooks: [{ type: "command", command: claudeHookCmd, timeout: 10 }] },
    ],
  },
};
out.set("hooks/hooks.json", JSON.stringify(claudeHooks, null, 2) + "\n");

// Claude Code plugin manifest; the version follows package.json.
const plugin = {
  name: "construct",
  version: pkg.version,
  description: "Employer-neutral skills, agents and a push/post guard for AI-assisted software work.",
  author: pkg.author || { name: "unknown" },
  keywords: ["skills", "agents", "code-review"],
};
out.set("adapters/claude/.claude-plugin/plugin.json", JSON.stringify(plugin, null, 2) + "\n");

// Flat skill farms for the harnesses that scan one level deep.
for (const s of skills) {
  for (const farm of ["adapters/claude/skills", "adapters/codex/skills", "adapters/pi/skills"]) {
    links.set(`${farm}/${s.name}`, relative(join(ROOT, farm), join(ROOT, s.path)));
  }
}
// The Claude plugin exposes the canonical hooks folder (script, patterns, generated hooks.json).
links.set("adapters/claude/hooks", relative(join(ROOT, "adapters/claude"), join(ROOT, "hooks")));

// Generated folders are owned by this script: anything not produced now is stale.
const owned = [
  "adapters/opencode/agents", "adapters/opencode/commands",
  "adapters/pi/agents", "adapters/pi/skills",
  "adapters/codex/agents", "adapters/codex/skills", "adapters/codex/rules",
  "adapters/claude/skills", "adapters/claude/agents",
];
const stale = owned.flatMap((dir) =>
  existsSync(join(ROOT, dir))
    ? readdirSync(join(ROOT, dir)).map((f) => `${dir}/${f}`).filter((p) => !out.has(p) && !links.has(p))
    : [],
);

const linkOk = (p, target) => {
  try { return lstatSync(join(ROOT, p)).isSymbolicLink() && readlinkSync(join(ROOT, p)) === target; }
  catch { return false; }
};
const changed = [
  ...[...out].filter(([p, c]) => !existsSync(join(ROOT, p)) || read(p) !== c).map(([p]) => p),
  ...[...links].filter(([p, t]) => !linkOk(p, t)).map(([p]) => `${p} -> ${links.get(p)}`),
];

if (CHECK) {
  if (changed.length || stale.length) {
    console.error("Adapters are stale. Run: node scripts/build-adapters.mjs");
    for (const p of [...changed, ...stale]) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`Adapters are up to date (${out.size} files, ${links.size} links).`);
} else {
  for (const [p, c] of out) { mkdirSync(dirname(join(ROOT, p)), { recursive: true }); writeFileSync(join(ROOT, p), c); }
  for (const [p, t] of links) {
    const abs = join(ROOT, p);
    mkdirSync(dirname(abs), { recursive: true });
    try { lstatSync(abs); rmSync(abs, { force: true }); } catch {}
    symlinkSync(t, abs);
  }
  for (const p of stale) rmSync(join(ROOT, p), { recursive: true, force: true });
  console.log(`Wrote ${changed.length} changed entry(ies), removed ${stale.length} stale, ${out.size} files and ${links.size} links total.`);
}
