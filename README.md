# notegen-gpts-api

Vercel serverless API for GPTs Actions.

- `POST /articles` -> commits Markdown into GitHub repo
- `GET /openapi.yaml` -> OpenAPI spec for GPTs Actions

Set env vars in Vercel:
- API_KEY
- GITHUB_TOKEN
- GITHUB_OWNER=hideosuzuki2024fx-blip
- GITHUB_REPO=NoteGenerator
- GITHUB_BRANCH=main
