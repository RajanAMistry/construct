# Tool and authentication preflight

Status: Draft. Instructions and synthetic scenarios reviewed; no live connection or authentication flow tested.

Before using a tool that accesses an external service, check availability, existing authentication and the intended target, in that order. Reuse a suitable existing connection. Authentication establishes identity; it does not authorize additional actions.

## Procedure

1. **Check the tool.** Inspect the harness's available tools or check the executable with `command -v gh` or `command -v glab`. For a CLI, inspect its version and local `--help` before choosing commands or flags. If it is missing, report that and ask whether to use an available alternative or provide installation steps. Do not install globally or change an existing installation automatically.
2. **Check for an existing connection.** Use the connector's connection metadata or the CLI's documented authentication-status mechanism. Start with local, non-secret metadata. Never print token values, use token-display commands, dump credential files or request secrets in chat. Check whether credential environment variables are set without displaying their values. An installed tool or a variable's presence alone does not establish a working connection.
3. **Identify which connection.** Confirm the service, hostname, account or workspace, authentication method and credential source where safely observable. Distinguish a saved CLI login, an environment-provided token, an SSH identity and a managed connector session. Inspect the installed version's credential precedence; an environment token may override a saved login. Match the selected identity and host to the user's target. A Git SSH connection does not establish authentication for `gh` or `glab`. If multiple connections exist and the intended one is unclear, ask which to use. Do not switch accounts or hosts automatically.
4. **Ask when authentication is missing or unclear.** Ask for the method, not the credential: “Which authentication method should this tool use: an existing CLI login, a token supplied through your environment or secret manager, or a connected integration? Which host and account should it target?” Offer only methods supported by that tool and version. Reuse an answer already supplied for the current target. The user completes sign-in or adds secrets through the tool's secure flow; do not launch login, reset credentials, overwrite tokens or edit credential stores automatically. Continue independent local work while authentication is pending.
5. **Proceed within scope.** After authentication is configured, repeat the safe status and target checks. Use the least privilege required for the requested operation. A connected account may still lack repository or workspace access; report that separately. Recheck after a target, account or credential change, or an authentication failure, rather than repeating checks before every call.

## Offline checks and live status

For an offline assignment or synthetic test, inspect metadata, local help and recorded test fixtures only. Do not run a status command that contacts the service, a login flow or a probe request. Record `configured, validity unverified` when local configuration is present and `unknown` when the tool cannot reveal safe local status. Do not call either state a verified connection or infer that authentication is missing.

For an assignment that includes online service access, a documented read-only status check may establish the current connection. For example, `gh auth status --hostname <host>` and `glab auth status --hostname <host>` are status-command candidates; confirm the installed version's help first. These commands may contact the service. Never add token-display flags. Capture output privately and return only a sanitized status summary; do not put account details, private hosts, scopes or diagnostic output into this public library.

A timeout, DNS failure, proxy denial or unavailable service does not prove that credentials are absent or expired. Report the observed error separately from authentication state. Ask about a new authentication method only when the existing method is absent, unsuitable or cannot be established, and explain that uncertainty.

## Reporting

Return only what the user needs for the task: tool availability/version, target match, connection state, authentication method/source if known, and the next step. Report account identity privately only when needed to select the correct connection. Use `unknown` for anything not observed; never infer identity or permissions from a successful help command. Keep raw status output and credentials out of logs, generated data and committed fixtures.

## Synthetic acceptance scenarios

Use fictional hosts, account labels and credential-source names. Fake secrets are unnecessary. These are expected outcomes for offline tests, not evidence of a live service connection.

| Input fixture | Expected behavior |
| --- | --- |
| Required CLI absent | Stop dependent commands; offer an available alternative or installation instructions |
| CLI present, no authentication configured | Ask for supported authentication method and target; do not initiate login |
| One configured connection matches the target | Reuse it; offline checks report validity unverified |
| Several accounts, no clear target match | Ask which account and host to use; do not switch automatically |
| Environment credential overrides saved login | Identify the effective source using documented precedence without exposing its value |
| Git SSH configured, forge CLI has no authentication | Treat the CLI as unconfigured; do not assume SSH authenticates its API |
| Connection check times out | Report connectivity failure and unknown authentication validity; do not replace credentials |
| Authenticated identity lacks target access | Report authorization failure separately; do not request broader permissions automatically |
| Status command requires network during offline testing | Leave connection validity unverified; do not execute it |
