# Team Capacity Dashboard

Team Capacity Dashboard is a Next.js web application for engineering managers and tech leads. It provides an overview of:

- Each team’s capacity (how much work they can realistically take on)
- Current and planned workload across projects and sprints
- Delivery risks such as over‑allocation, missing skills, and single points of failure

The app exposes dashboards, charts, and detailed team/project views to help answer questions like:

- Which teams are overloaded in the upcoming sprint?
- Where are our biggest delivery risks?
- What happens if a key engineer becomes unavailable?

This project is also used as a playground to practice senior‑level frontend skills: performance optimisation, complex data modelling, testing, CI/CD, cloud integration, and Generative AI–assisted workflows.

## Tech Stack

- **Framework & Language**: Next.js (App Router), React, TypeScript
- **Styling & UI**: Tailwind CSS, custom components, lucide-react icons
- **Data**: each page loads its data on the server; charts use tzardom-ui
- **Backend & Auth**: Next.js Server Actions, Firebase Auth, Firestore through its REST API as the logged-in user
- **Quality & Tooling**: Biome, a git pre-commit hook (`.githooks/`), strict TypeScript config
- **Testing**: Vitest (unit/integration), Testing Library, Playwright (end-to-end)

Planned backend (coming soon): a Go service exposing a JSON API, connected to a PostgreSQL database and deployed on Render alongside the database for managed, scalable hosting.

### This repository is set up to feel like a "senior" engineering environment around the code:

- **Biome**
  - The pre-commit hook lints and formats the files you commit.
  - Fix the whole project with `pnpm lint`.
- **TypeScript strictness**
  - `tsconfig.json` uses `"strict": true` for safer types across the app.
- **GitHub Actions CI**
  - Workflow in `.github/workflows/ci.yml` runs on pushes and PRs to `main`.
  - Steps: install dependencies, `pnpm test`, and `pnpm build`.
- **Build & deployment pipeline**
  - `pnpm build` performs a production build used both locally and in CI.
  - Recommended: connect the repo to Vercel so merges to `main` trigger automatic deployments.
- **Contribution flow & code review**
  - See `CONTRIBUTING.md` for local workflow and pre-PR checks.
  - PRs use `.github/pull_request_template.md` with a lightweight code review checklist.

## Project structure

One repo with two apps. Run every `pnpm` command from the repo root.

```
apps/
├── web/      Next.js dashboard (UI): src/, tests/, its configs and local.env
└── server/   Go API with PostgreSQL
```

`pnpm dev` starts both: the dashboard on port 3333 and the API on port 4444.

## Server (Go + PostgreSQL)

You need Go 1.24 or newer (`brew install go`) and Docker. The first time:

```bash
pnpm db:up                                  # starts PostgreSQL in Docker
cd apps/server && go mod tidy && cd ../..   # downloads the Go packages and writes go.sum (commit it)
pnpm seed                                   # optional: fills the local database with demo data
pnpm dev
```

The server builds its tables when it starts, from the numbered SQL files in `apps/server/migrations/`. To change a table, add a new numbered file; never edit one that has already run. `pnpm seed` replaces everything in the local database with `apps/server/cmd/seed/seed.sql`, and refuses to run on a database that isn't on your computer.

Settings come from `apps/server/local.env` (see `example.env`). Without it, the server uses the local database from `docker-compose.yml`.

| Route | Answers |
|---|---|
| `GET /health` | `{"status":"ok"}` when the server and database are up |
| `GET /users` | every user |
| `GET /teams`, `GET /teams/{id}` | teams with their members and skills |
| `GET /projects?teamId=` | projects, optionally only one team's |
| `GET /sprints` | sprints, the earliest first |
| `GET /risk/rules`, `/risk/insights?teamId=`, `/risk/events?teamId=` | risk rules, the risks they found, and events like vacations |

The routes don't check who is asking yet: login comes in the next step, so only run the server on your own computer for now.

`pnpm test` also runs the Go tests (`*_test.go`, next to the code). The ones that need a database each get an empty schema of their own in the local database, and are skipped when it isn't running.

## Getting Started

You need Node 26 (22.12+ and 24 also work; Vitest doesn't support 25) and pnpm
(`npm install -g pnpm`). Install the dependencies with `pnpm install`,
then run the development server:

```bash
pnpm dev
```

Open [http://localhost:3333](http://localhost:3333) with your browser to see the result.

There's no page at `/`: it redirects to `/overview`. You can start editing that page in `apps/web/src/app/overview/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Running with or without Firebase

Copy `apps/web/example.env` to `apps/web/local.env` to use real data. Restart the dev server after changing it. Without it, nobody can log in: pages with data ask you to log in, and the login page shows a "needs Firebase configured" message. The mock data in `apps/web/tests/mockData.ts` is only for tests.

| Page type | Guard |
|---|---|
| Page with data (`overview`, `risk`, `teams`, `teams/[id]`, `user`) | `getCurrentUser()`; shows `<LoginRequired>` when nobody is logged in |
| Login and sign-up (`login`, `register`) | `<FirebaseGate feature="Feature">` |

Read and write Firestore only on the server, through the helpers in `apps/web/src/lib/firebase/collections.ts`.

## Login and teams

With Firebase set up, every page with data needs a login. No private key is needed, only the public values in `example.env`:

- Logging in happens in the browser with Firebase Auth. The browser then saves its login token in a cookie, and saves the new one each time Firebase renews it (about every hour).
- On each page the server asks Firebase whose token it is, then reads Firestore with that same token. So `firestore.rules` decides what each user can see and change.

Users can sign up at `/register`, or be added in Firebase console → **Authentication → Users → Add user**.

Any logged-in user can create teams on `/teams`. A team belongs to the person who created it (its `ownerId`): only they see it, rename it, delete it, and manage its members on the team's page. The overview and risk pages only count the projects, risks and events of the user's own teams.

Team members are accounts. Each time someone logs in, their email is saved in the `users` collection (the document ID is their account's UID), so others can pick them: in the "Add team" dialog, or with "Add a member" on a team's page. Each member's role and capacity per sprint are set on the team's page. People with an account show up in the list after their first login.

## Firestore rules

`firestore.rules` is what keeps the data private: each team can only be read and changed by the user who created it, everyone logged in can see the list of accounts (`users`) but only write their own, and logged-in users can read the shared data (projects, sprints and risks). The app needs these rules published: paste the file into Firebase console → Firestore → Rules and click **Publish**, and again after every change.

## End-to-end tests

The end-to-end tests use Playwright and run in Chromium, Firefox and WebKit (Safari). They need Firebase set up (`apps/web/local.env`) with some teams in Firestore, and a test user to log in as: `E2E_EMAIL` and `E2E_PASSWORD` in the same file. Install the browsers once, then run them:

```bash
pnpm --filter web exec playwright install chromium firefox webkit
pnpm e2e
```

Playwright starts the dev server on port 3333 by itself, so stop your own
`pnpm dev` (or anything else on port 3333) first. `pnpm e2e:ui` opens the interactive runner.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Option 1: Deploy with Vercel (recommended)

This project is currently deployed on Vercel; the steps below describe how to deploy your own instance.

The app lives in `apps/web`, so set the Vercel project's **Root Directory** to `apps/web` (Project → Settings → Build and Deployment).

You can deploy this app either directly from your local machine or via a Git repository.

#### Deploy from your local machine using Vercel CLI

1. From the project root, install dependencies (if not already done):
   - `pnpm install`
2. (Optional) Verify the app builds locally:
   - `pnpm build`
3. Install the Vercel CLI (once):
   - `pnpm add -g vercel`
4. Deploy for the first time:
   - `vercel`
   - When prompted in the browser, sign up or log in to Vercel.
   - In the terminal prompts, choose **Create a new project** and accept the detected Next.js settings.
5. For subsequent production deployments, run:
   - `vercel --prod`

After deployment, Vercel will give you a URL like `https://your-project-name.vercel.app` where the dashboard is available.

For more details and advanced options, see the official [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
