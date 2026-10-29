# team-capacity-dashboard: rules for Claude

## Core rules

1. Clean code a junior can read.
2. Keep `apps/web/tests/` in sync with `apps/web/src/`: it mirrors it file by file.
3. `apps/web` is the Next.js app and `apps/server` the Go API. Run `pnpm` commands from the repo root.
