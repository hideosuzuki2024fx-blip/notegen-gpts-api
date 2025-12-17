module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  // OpenAPI YAML (served at /openapi.yaml via vercel.json rewrite)
  const yaml = `openapi: 3.0.3
info:
  title: NoteGenerator Commit API
  version: 1.0.0
servers:
  - url: https://YOUR_VERCEL_DOMAIN
paths:
  /articles:
    post:
      operationId: saveArticle
      summary: Commit a Markdown article into GitHub
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title, content]
              properties:
                title:
                  type: string
                  description: Article title
                content:
                  type: string
                  description: Markdown content (UTF-8)
                slug:
                  type: string
                  description: Optional filename slug (fallback: derived from title)
                yyyymmdd:
                  type: string
                  description: Optional date prefix like 20251217 (fallback: UTC today)
                commit_message:
                  type: string
                  description: Optional commit message
      responses:
        "200":
          description: Saved
          content:
            application/json:
              schema:
                type: object
                properties:
                  ok: { type: boolean }
                  path: { type: string }
                  html_url: { type: string }
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
`;

  res.setHeader("Content-Type", "text/yaml; charset=utf-8");
  res.statusCode = 200;
  res.end(yaml);
};
