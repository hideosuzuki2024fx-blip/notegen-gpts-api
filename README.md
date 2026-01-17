# notegen-gpts-api

Vercel serverless API for GPTs Actions.

- `POST /articles` -> commits Markdown into GitHub repo
- `GET /openapi.yaml` -> OpenAPI spec for GPTs Actions
- `GET /viewer`  -> Serves the static photo gallery viewer (public/photoviewer/index.html)
- API handlers live under `pages/api` per Next.js conventions.

Set envi vars in Vercel:
- API_KEY
- GITHUB_TOKEN
- GITHUB_OWNER=hideosuzuki2024fx-blip
- GITHUB_REPO=NoteGenerator
- GITHUB_BRANCH=main
