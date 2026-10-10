// pi extension for prime directive 1. A bash call that pushes to or posts on a
// forge asks the user first, the same rule as the Claude Code hook. Patterns
// come from hooks/outbound.json so every harness shares one list.
// pi docs: https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(readFileSync(join(here, "..", "..", "..", "hooks", "outbound.json"), "utf8"));
const ignore = new RegExp(spec.bash_ignore, "gim");
const outbound = new RegExp(spec.bash_regex, "im");

export default function (pi: any) {
  pi.on("tool_call", async (event: any, ctx: any) => {
    if (event.toolName !== "bash") return undefined;
    const command = String(event.input?.command ?? "").replace(ignore, "");
    if (!outbound.test(command)) return undefined;

    // No UI (print or RPC mode) means nobody can say yes, so block with the reason.
    if (!ctx.hasUI) return { block: true, reason: spec.reason };
    const ok = await ctx.ui.confirm("construct: push or post?", `${spec.reason}\n\n${command}`);
    return ok ? undefined : { block: true, reason: "Blocked by the user." };
  });
}
