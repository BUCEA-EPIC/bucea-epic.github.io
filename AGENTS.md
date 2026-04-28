# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Vue 3 static frontend for the EPIC 314 website.

- `src/`: Vite frontend source. Shared UI lives in `components/`, pages in `views/`, routes in `router/`, static data in `data/`, and images in `assets/`.
- `public/`: static documents, favicon files, and public images copied directly into the build output.
- `DESIGN.md`: UI design specification for the Linear-style visual system.
- `.github/workflows/`: GitHub Pages deployment workflow.

## Build, Test, and Development Commands

- `npm install`: install frontend dependencies.
- `npm run dev`: start the Vite dev server on port `5173`.
- `npm run build`: create the production frontend bundle in `dist/`.
- `npm run preview`: preview the production build locally.

There is currently no configured automated test command.

## Coding Style & Naming Conventions

Use 2-space indentation in Vue, JavaScript, and CSS files. Vue page components use PascalCase with a `View.vue` suffix, for example `HomeView.vue`; shared UI components use PascalCase, for example `Navbar.vue`. JavaScript modules use camelCase names such as `newsData.js`.

Prefer existing local components, styles, and data modules over adding new dependencies. Keep pages static and frontend-only unless the project explicitly reintroduces a backend in the future.

## Testing Guidelines

No test framework is installed yet. For frontend changes, run `npm run build` before opening a PR. If adding tests later, place frontend specs under `src/__tests__/`.

## Commit & Pull Request Guidelines

Recent history uses short messages, sometimes Conventional Commit style (`chore: ...`) and sometimes Chinese summaries. Keep commits concise and imperative; use prefixes like `feat:`, `fix:`, `chore:`, or `docs:` when helpful.

Pull requests should describe the user-facing change, list frontend areas touched, note verification commands, link related issues, and include screenshots for visible UI changes.

## Security & Configuration Tips

Do not add secrets to source files. The site is deployed as static frontend assets through GitHub Pages and should not require runtime secrets.
