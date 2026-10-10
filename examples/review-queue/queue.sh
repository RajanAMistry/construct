#!/usr/bin/env bash
# Synthetic review-queue helper. Pure git, no network, no forge.
#
# Stands in for a forge CLI so the review-queue skill can be practised against
# local branches: every branch named review/* is one "item in the queue".
# Copy this shape and replace the git calls with your forge CLI for a real queue.
#
#   queue.sh list              unmerged review/* branches, oldest update first
#   queue.sh brief <branch>    write meta.md, notes.md, diff.patch, files.txt to $OUT/<slug>/
#   queue.sh apply <branch>    stash local work (if dirty), record it, check out the branch
#   queue.sh restore <branch>  back to the original branch, pop the recorded stash
#
# Env: OUT (default ~/.cache/review-queue), BASE (default main, else master)
set -euo pipefail

OUT="${OUT:-$HOME/.cache/review-queue}"
APPLIED="$OUT/applied"

die() { printf 'queue: %s\n' "$*" >&2; exit 1; }

# The cache holds change content and must never be committed, or here even
# stashed: git stash -u would swallow it when it sits inside the repository.
ensure_out_outside_repo() {
  local root; root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
  [ -n "$root" ] || return 0
  case "$(cd "$OUT" 2>/dev/null && pwd || printf '%s' "$OUT")" in
    "$root"|"$root"/*) die "OUT ($OUT) is inside the repository. Point OUT somewhere outside it." ;;
  esac
}

base_branch() {
  if [ -n "${BASE:-}" ]; then printf '%s' "$BASE"; return; fi
  git show-ref --verify --quiet refs/heads/main && printf 'main' && return
  git show-ref --verify --quiet refs/heads/master && printf 'master' && return
  die "no main or master branch; set BASE"
}

need_branch() {
  [ -n "${1:-}" ] || die "usage: queue.sh $CMD <branch>"
  git show-ref --verify --quiet "refs/heads/$1" || die "no local branch: $1"
}

slug() { printf '%s' "$1" | tr '/' '-'; }

cmd_list() {
  local base; base="$(base_branch)"
  ensure_out_outside_repo
  printf 'branch\tupdated\tauthor\tdiff\tsubject\n'
  git for-each-ref --format='%(refname:short)|%(committerdate:short)|%(authorname)|%(contents:subject)' \
      --sort=committerdate 'refs/heads/review/*' |
  while IFS='|' read -r br date author subject; do
    git merge-base --is-ancestor "$br" "$base" && continue
    local stat
    stat="$(git diff --numstat "$base...$br" | awk '{a+=$1; d+=$2; n++} END {printf "+%d/-%d %df", a, d, n}')"
    printf '%s\t%s\t%s\t%s\t%s\n' "$br" "$date" "$author" "$stat" "$subject"
  done
  local n
  n="$(git for-each-ref 'refs/heads/review/*' | wc -l | tr -d ' ')"
  printf '\n%s review/* branches, unmerged ones listed above\n' "$n"
}

cmd_brief() {
  need_branch "${1:-}"
  ensure_out_outside_repo
  local br="$1" base dir; base="$(base_branch)"; dir="$OUT/$(slug "$br")"
  mkdir -p "$dir"

  {
    printf '# %s\n\n' "$br"
    printf -- '- subject: %s\n' "$(git log -1 --format='%s' "$br")"
    printf -- '- author: %s\n' "$(git log -1 --format='%an' "$br")"
    printf -- '- updated: %s\n' "$(git log -1 --format='%cd' --date=short "$br")"
    printf -- '- base: %s\n' "$base"
    printf -- '- diff:\n\n```\n%s\n```\n' "$(git diff --stat "$base...$br" | tail -20)"
  } > "$dir/meta.md"

  printf '# Discussions\n\nSynthetic mode: a local branch has no discussions. A real brief keeps open threads only and collapses bot notes to one line.\n' > "$dir/notes.md"

  git diff "$base...$br" -- . ':!*yarn.lock' ':!*package-lock.json' ':!*pnpm-lock.yaml' ':!*.snap' > "$dir/diff.patch"

  {
    local flags=""
    git diff --numstat "$base...$br" -- . ':!*yarn.lock' ':!*package-lock.json' ':!*pnpm-lock.yaml' ':!*.snap' |
    while IFS=$'\t' read -r add del path; do printf '%s\t+%s/-%s\n' "$path" "$add" "$del"; done
    git diff --name-only "$base...$br" | grep -Eq '\.(vue|jsx?|tsx?|s?css)$|^(app|src|components|pages)/' && flags="$flags UI"
    git diff --name-only "$base...$br" | grep -Eqi '(^|/)(db|database)/.*(migrat|schema)' && flags="$flags MIGRATION"
    printf 'FLAGS:%s\n' "${flags:- none}"
    printf 'TEST_FILES: %s\n' "$(git diff --name-only "$base...$br" | grep -E '(spec|test)' | tr '\n' ' ')"
  } > "$dir/files.txt"

  printf 'brief %s:\n' "$br"
  head -6 "$dir/meta.md" | tail -5
  grep -E '^(FLAGS|TEST_FILES)' "$dir/files.txt"
  printf 'files: %s\n' "$dir"
}

cmd_apply() {
  need_branch "${1:-}"
  ensure_out_outside_repo
  local br="$1"; mkdir -p "$OUT"
  [ -e "$APPLIED" ] && die "another item is unrestored: $(cat "$APPLIED" | head -1). Restore it first."
  local stashed="no"
  if [ -n "$(git status --porcelain)" ]; then
    git stash push -u -m "queue-$(slug "$br")" >/dev/null
    stashed="yes"
  fi
  local orig; orig="$(git rev-parse --abbrev-ref HEAD)"
  printf '%s\n%s\n%s\n' "$br" "$orig" "$stashed" > "$APPLIED"
  git checkout --quiet "$br"
  printf 'applied %s (was %s, stashed: %s)\n' "$br" "$orig" "$stashed"
  grep -q MIGRATION "$OUT/$(slug "$br")/files.txt" 2>/dev/null &&
    printf 'note: MIGRATION flag set, restart your dev environment if you check the UI\n' || true
}

cmd_restore() {
  need_branch "${1:-}"
  ensure_out_outside_repo
  local br="$1"
  [ -e "$APPLIED" ] || die "nothing applied"
  [ "$(head -1 "$APPLIED")" = "$br" ] || die "applied item is $(head -1 "$APPLIED"), not $br"
  local orig stashed; orig="$(sed -n 2p "$APPLIED")"; stashed="$(sed -n 3p "$APPLIED")"
  if [ "$stashed" = "no" ] && [ -n "$(git status --porcelain)" ]; then
    die "tree changed during the review and nothing was stashed. Resolve by hand; state kept as is."
  fi
  git checkout --quiet "$orig"
  if [ "$stashed" = "yes" ]; then
    local ref
    ref="$(git stash list --format='%gd %s' | grep -F "queue-$(slug "$br")" | head -1 | cut -d' ' -f1)"
    [ -n "$ref" ] || die "recorded stash not found. Check git stash list; nothing popped."
    git stash pop "$ref" >/dev/null || die "stash pop conflicted on $ref. Resolve by hand; the stash is kept."
  fi
  rm -f "$APPLIED"
  printf 'restored %s (stash popped: %s)\n' "$orig" "$stashed"
}

CMD="${1:-}"; shift || true
case "$CMD" in
  list) cmd_list ;;
  brief) cmd_brief "${1:-}" ;;
  apply) cmd_apply "${1:-}" ;;
  restore) cmd_restore "${1:-}" ;;
  *) die "usage: queue.sh {list|brief <branch>|apply <branch>|restore <branch>}" ;;
esac
