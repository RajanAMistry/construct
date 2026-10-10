# <Feature name>

Last verified against `<branch>` `<sha>` on <YYYY-MM-DD>. Tracking item: [<reference>](url). Flag: `<flag or none>`.

## In one paragraph

What a user sees, where, and why it exists.

## Page map

```mermaid
flowchart LR
  A["/route"] --> B[Controller or page]
  B --> C[Entry module]
  C --> D[Root component]
```

## Component tree

```mermaid
flowchart TD
  Root --> Child1
  Root --> Child2
  Child1 -. emits .-> Root
```

## Data flow

```mermaid
sequenceDiagram
  participant U as User
  participant V as UI component
  participant C as API client
  participant S as Server handler
  participant M as Data store
  U->>V: action
  V->>C: query / mutation
  C->>S: request
  S->>M: read / write
  M-->>S: data
  S-->>C: response
  C-->>V: cache update
```

## Files

| Role | Path | Notes |
| --- | --- | --- |

## Flags and permissions

## Tests

| Layer | Path | Covers |
| --- | --- | --- |

## History (change trail)

## Open follow-ups

## Gotchas
