# notegen-gpts-api

Vercel serverless API for GPTs Actions.

## Purpose

- `POST /articles`: commit Markdown into GitHub repo.
- `GET /openapi.yaml`: provide OpenAPI spec for GPTs Actions.
- `GET /viewer`: serve static photo viewer (`public/photoviewer/index.html`).

## Directory Structure

- `api/`: serverless API handlers (single canonical API implementation).
- `api/github/`: GitHub operation handlers.
- `public/`: static files including OpenAPI JSON and photo viewer assets.
- `docs/`: setup and operation notes.

## Required Environment Variables

- `API_KEY`
- `GITHUB_TOKEN`
- `GITHUB_OWNER` (default: `hideosuzuki2024fx-blip`)
- `GITHUB_REPO` (default: `NoteGenerator`)
- `GITHUB_BRANCH` (default: `main`)

## Local Development

```bash
npm install
npm run dev
```

## Change Log

### 2026-02-06

- Removed duplicate API implementation under `pages/api` and unified handlers under `api/`.
- Removed accidental build artifact commits (`.next/cache/*`) and `dummy.md`.
- Fixed `api/test.ts` response typo (`send`).
- Fixed `api/github/deleteFile.ts` owner variable bug.
- Rebuilt `.gitignore` for Next.js/Vercel API workflow.
