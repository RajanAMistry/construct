#!/usr/bin/env bash
# PreToolUse guard for prime directive 1, shared by Claude Code and Codex.
# Commands that push, post, approve, merge or otherwise change forge state
# become a permission prompt in Claude Code ("ask") and a block with a reason
# in Codex ("deny"), because Codex hooks cannot prompt yet. Never allows
# anything by itself.
#
#   confirm-outbound.sh [claude|codex]     default: claude
#
# Patterns live in outbound.json next to this script, shared with the pi
# extension and every generated adapter. Needs jq; skips the check without it,
# so install jq first.
set -uo pipefail

DIALECT="${1:-claude}"
command -v jq >/dev/null 2>&1 || exit 0
spec="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/outbound.json"
[ -r "$spec" ] || exit 0
input="$(cat)"
tool="$(jq -r '.tool_name // empty' <<<"$input")"
reason="$(jq -r '.reason' "$spec")"

decide() { # $1 = ask|deny, $2 = reason
  jq -n --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: $d, permissionDecisionReason: $r}}'
  exit 0
}

if [ "$DIALECT" = "codex" ]; then
  # The generated Codex hook config only routes forge MCP write tools and the
  # residual API-mutation bash patterns here; prefix commands are covered by
  # the generated rules file, which prompts instead of denying.
  [ "$tool" = "Bash" ] || decide deny "construct: $tool changes forge state. Only run it if the current message asked for it."
  cmd="$(jq -r '.tool_input.command // empty' <<<"$input" | sed -E "s/$(jq -r '.bash_ignore' "$spec")//g")"
  grep -Eiq "$(jq -r '.codex_hook_regex' "$spec")" <<<"$cmd" &&
    decide deny "$reason Codex hooks cannot prompt; ask the user to run it themselves or disable this hook in /hooks for the session."
  exit 0
fi

# Claude Code dialect: the matcher in hooks.json sends Bash plus forge MCP
# write tools here.
[ "$tool" = "Bash" ] || decide ask "construct: $tool changes forge state. Only run it if the current message asked for it."
cmd="$(jq -r '.tool_input.command // empty' <<<"$input" | sed -E "s/$(jq -r '.bash_ignore' "$spec")//g")"
grep -Eiq "$(jq -r '.bash_regex' "$spec")" <<<"$cmd" && decide ask "$reason"
exit 0
