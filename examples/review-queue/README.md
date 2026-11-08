# Review queue example

A synthetic, runnable implementation of the helper contract in the [review-queue](../../skills/developer/review-queue/SKILL.md) skill. Pure git, no network, no forge, no credentials. Local branches named `review/*` stand in for pull requests.

Purpose: show the shape of the four commands (`list`, `brief`, `apply`, `restore`) and the four cache files (`meta.md`, `notes.md`, `diff.patch`, `files.txt`), including the stash-safe apply and restore. Copy `queue.sh`, keep the contract, and replace the git calls with your forge CLI (`gh api graphql`, `glab api graphql`) to drive a real queue.

Read [git-workflow](../../skills/developer/git-workflow/SKILL.md) before using this against existing work. Run the walkthrough only in a disposable synthetic repository. This example records a stash message rather than its object ID and is not a general recovery tool; inspect state and stop on ambiguity or work added during review. Stashing an existing working tree needs agreement first.

## Try it

```sh
SCRATCH=$(mktemp -d) && cd "$SCRATCH" && git init -q -b main . && git commit -q --allow-empty -m "init"
echo "export const hello = 1" > hello.js && git add . && git commit -q -m "add hello"
git checkout -q -b review/greeting && echo "export const hi = 2" >> hello.js
mkdir -p spec && echo "test('hi', () => {})" > spec/hello.test.js
git add . && git commit -q -m "greeting variant with a test"
git checkout -q main && echo "local work" > wip.txt
Q=<checkout>/examples/review-queue/queue.sh
OUT="$SCRATCH-cache" $Q list
OUT="$SCRATCH-cache" $Q brief review/greeting
OUT="$SCRATCH-cache" $Q apply review/greeting
OUT="$SCRATCH-cache" $Q restore review/greeting
git status --short   # wip.txt is back, the stash was popped
```

Replace `<checkout>` with the path to this repository. Keep `OUT` outside the repository; the script refuses a cache directory inside it, because `git stash -u` would swallow the cache mid-review.

## What is synthetic

- `list` reads local branches instead of a forge GraphQL query for review requests.
- `notes.md` is a placeholder: a local branch has no discussions.
- `files.txt` flags are guessed from paths (`UI`, `MIGRATION`) instead of forge labels.
- `apply` and `restore` are the real thing: the stash-safety rules are the point of the example.
