# team-capacity-dashboard: rules for Claude

## Core rules

1. Clean code a junior can read.

## Folders

- `src/app/`: routes only. A `page.tsx` renders its view.
- `src/views/<page>/`: code for one page.
- `src/components/`: shared by several pages (`layout/`, `widgets/`,
  `firebase/`).
- `src/providers/`, `src/lib/`: React providers and non-React code.
- `cypress/e2e/`: browser tests.
