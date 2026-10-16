# Contributing

Thanks for taking the time to contribute to the Team Capacity Dashboard!

## Development workflow

1. **Fork & branch**
   - Fork the repository.
   - Create a feature branch from `main` (e.g. `feat/add-new-widget`).

2. **Set up locally**
   - Use Node 26 (22.12+ and 24 also work; Vitest doesn't support 25).
   - Install dependencies: `npm install`
   - Start the dev server: `npm run dev`

3. **Before opening a PR**
   - Lint: `npm run lint`
   - Format (check): `npm run format`
   - Fix formatting (if needed): `npm run format:fix`
   - Run unit tests with coverage: `npm run test:coverage`
   - Ensure the app builds: `npm run build`

4. **Pull Request guidelines**
   - Keep PRs focused and reasonably small.
   - Update documentation (README, comments, etc.) when behaviour or APIs change.
   - Add or update tests for new or changed functionality where it makes sense.

## Code style

- TypeScript with `strict` mode is enabled; keep types precise.
- React components are arrow functions with typed props, no `FC`.
- Use ESLint and Prettier to keep the codebase consistent.

## CI/CD

GitHub Actions runs lint, tests (with coverage), and build on every PR targeting `main`. Please make sure your changes pass locally before opening or updating a PR.
