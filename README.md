# Project

This repository contains a Vite + React SPA with an Express server used for API routes and content management. The project supports two content storage modes:

- JSON file storage (default) — data kept under `data/*.json`.
- SQLite storage (optional) — if `better-sqlite3` is installed, the server will create `data/app.db` and automatically migrate existing JSON content into the database.

Prerequisites

- Node.js 18+ and a package manager (pnpm, npm, or yarn). The project uses pnpm in package.json but you can use npm or yarn.

Quickstart (development)

1. Install dependencies: pnpm install (or npm install)
2. Run dev server (client + server): pnpm run dev

Build & run (production-like, no Docker required)

1. Install production deps: pnpm install --production
2. Build client and server bundles: pnpm run build
3. Start server: pnpm start

Notes about SQLite and storage

- SQLite support is optional. If you want the server to use SQLite for news/rules/privacy/terms, install the native driver:

  pnpm add better-sqlite3

  or

  npm install better-sqlite3

- When the server starts and `better-sqlite3` is available, it will create `data/app.db` and migrate existing JSON files from `data/*.json` into the database (only if the DB tables are empty). No manual migration step is required.

- If `better-sqlite3` is not installed, the server will continue using JSON files (backwards compatible).

API / Content

- Public endpoints:
  - GET /api/news — list published news
  - GET /api/news/:id — get news by id or slug
  - GET /api/rules — rules document
  - GET /api/privacy — privacy policy
  - GET /api/terms — terms

- Admin endpoints (protected by simple admin middleware):
  - GET /api/admin/news — list all (drafts + published)
  - POST /api/news — create (multipart/form-data for image)
  - PUT /api/news/:id — update
  - DELETE /api/news/:id — delete
  - PUT /api/rules — update rules
  - PUT /api/privacy — update privacy
  - PUT /api/terms — update terms

Uploads

- Uploaded images are stored in `uploads/` and served statically at `/uploads`.

Environment

- The app reads environment variables via dotenv. You can set:
  - BASE_URL — base URL used for externally visible asset URLs (used by webhook code)
  - PING_MESSAGE — custom /api/ping response

Working without MCP/Netlify/Docker

- This project can be run and built locally without Netlify/Vercel or Docker. The README steps above show how to build a production bundle and start the server with `pnpm start`.
- If you want a managed deployment later, you can connect to MCP providers (Netlify / Vercel) using Builder.io UI.

Troubleshooting

- If you get errors related to missing native bindings for better-sqlite3, either install the package (see above) or remove it and rely on JSON files.
- To force migration to SQLite: install better-sqlite3, delete `data/app.db` (if exists) and restart the server — the server will import JSON files into the new DB.

Contact

- For help, use the project UI or open an issue in the repo.
