# Contributing

Thanks for taking the time to contribute to the Team Capacity Dashboard!

## Development workflow

1. **Fork & branch**
   - Fork the repository.
   - Create a feature branch from `main` (e.g. `feat/add-new-widget`).

2. **Set up locally**
   - Use Node 26 (22.12+ and 24 also work; Vitest doesn't support 25).
   - Install pnpm once: `npm install -g pnpm`
   - Install dependencies: `pnpm install`
   - Start the dev server: `pnpm dev`

3. **Before opening a PR**
   - Run unit tests with coverage: `pnpm test`
   - Ensure the app builds: `pnpm build`

4. **Pull Request guidelines**
   - Keep PRs focused and reasonably small.
   - Update documentation (README, comments, etc.) when behaviour or APIs change.
   - Add or update tests for new or changed functionality where it makes sense.

## Code style

- TypeScript with `strict` mode is enabled; keep types precise.
- React components are arrow functions with typed props, no `FC`.
- Biome lints and formats your files on every commit (pre-commit hook).

## CI/CD

GitHub Actions runs tests (with coverage), and build on every PR targeting `main`. Please make sure your changes pass locally before opening or updating a PR.
