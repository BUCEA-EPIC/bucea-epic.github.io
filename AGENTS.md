# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Vue 3 frontend and FastAPI backend for the EPIC 314 website.

- `vue3/`: Vite frontend. Source lives in `vue3/src/`: shared UI in `components/`, pages in `views/`, routes in `router/`, static data in `data/`, and images in `assets/`. Public documents and favicon files live in `vue3/public/`.
- `fastapi/`: backend API. Application code lives in `fastapi/app/`: `core/` for config/database/security, `models/` for SQLAlchemy tables, `routers/` for endpoints, and `utils/` for helpers. Runtime uploads go in `fastapi/uploads/`.
- `nginx/`: deployment reverse-proxy config.

## Build, Test, and Development Commands

- `cd vue3 && npm install`: install frontend dependencies.
- `cd vue3 && npm run dev`: start the Vite dev server on port `5173`; `/api` requests proxy to `127.0.0.1:8000`.
- `cd vue3 && npm run build`: create the production frontend bundle in `vue3/dist/`.
- `cd vue3 && npm run preview`: preview the production build locally.
- `cd fastapi && pip install -r requirements.txt`: install backend dependencies.
- `cd fastapi && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`: run the API locally; docs are at `/docs`.

There is currently no configured automated test command.

## Coding Style & Naming Conventions

Use 2-space indentation in Vue, JavaScript, and CSS files. Vue page components use PascalCase with a `View.vue` suffix, for example `HomeView.vue`; shared UI components use PascalCase, for example `Navbar.vue`. JavaScript modules use camelCase names such as `newsData.js`.

Use 4-space indentation in Python. Keep FastAPI routers grouped by audience or feature, with explicit names such as `public.py`, `admin.py`, and `database.py`.

## Testing Guidelines

No test framework is installed yet. For frontend changes, run `npm run build` before opening a PR. For backend changes, start Uvicorn and verify affected endpoints in `/docs`. If adding tests later, place frontend specs under `vue3/src/__tests__/` and backend tests under `fastapi/tests/` with `test_*.py` names.

## Commit & Pull Request Guidelines

Recent history uses short messages, sometimes Conventional Commit style (`chore: ...`) and sometimes Chinese summaries. Keep commits concise and imperative; use prefixes like `feat:`, `fix:`, `chore:`, or `docs:` when helpful.

Pull requests should describe the user-facing change, list frontend/backend areas touched, note verification commands, link related issues, and include screenshots for visible UI changes.

## Security & Configuration Tips

Do not add secrets to source files. Backend settings come from environment variables or `fastapi/.env`; copy `fastapi/.env.example` for local setup and keep real admin keys and SMTP credentials untracked.
