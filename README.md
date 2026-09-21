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
- **State & Data**: @tanstack/react-query for server state, Recharts for data visualisation
- **Backend & Auth**: Next.js API routes, Firebase SDK integration
- **Quality & Tooling**: ESLint, Prettier, Husky git hooks, strict TypeScript config
- **Testing**: Vitest (unit/integration), Testing Library, Cypress (end-to-end)

Planned backend (coming soon): a Go service exposing a JSON API, connected to a PostgreSQL database and deployed on Render alongside the database for managed, scalable hosting.

### This repository is set up to feel like a "senior" engineering environment around the code:

- **ESLint + Prettier**
  - Lint the whole project with `npm run lint`.
  - Check formatting with `npm run format` and auto-fix with `npm run format:fix`.
- **TypeScript strictness**
  - `tsconfig.json` uses `"strict": true` for safer types across the app.
- **GitHub Actions CI**
  - Workflow in `.github/workflows/ci.yml` runs on pushes and PRs to `main`.
  - Steps: install dependencies, `npm run lint`, `npm run test:coverage`, and `npm run build`.
- **Build & deployment pipeline**
  - `npm run build` performs a production build used both locally and in CI.
  - Recommended: connect the repo to Vercel so merges to `main` trigger automatic deployments.
- **Contribution flow & code review**
  - See `CONTRIBUTING.md` for local workflow and pre-PR checks.
  - PRs use `.github/pull_request_template.md` with a lightweight code review checklist.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Seeding Firestore (dev only)

To populate Firebase/Firestore with the mock domain data used by the app (skills, teams, sprints, projects, risk rules/insights/events), run the dev seed endpoint while the dev server is running:

```bash
curl -X POST http://localhost:3000/api/dev/seed-all
```

This calls the handler in `src/app/api/dev/seed-all/route.ts` and will create or update the corresponding collections in your Firestore project. Use this only in development; for production, configure real data and proper Firestore security rules.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Option 1: Deploy with Vercel (recommended)

This project is currently deployed on Vercel; the steps below describe how to deploy your own instance.

You can deploy this app either directly from your local machine or via a Git repository.

#### Deploy from your local machine using Vercel CLI

1. From the project root, install dependencies (if not already done):
   - `npm install`
2. (Optional) Verify the app builds locally:
   - `npm run build`
3. Install the Vercel CLI (once):
   - `npm install -g vercel`
4. Deploy for the first time:
   - `vercel`
   - When prompted in the browser, sign up or log in to Vercel.
   - In the terminal prompts, choose **Create a new project** and accept the detected Next.js settings.
5. For subsequent production deployments, run:
   - `vercel --prod`

After deployment, Vercel will give you a URL like `https://your-project-name.vercel.app` where the dashboard is available.

For more details and advanced options, see the official [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
