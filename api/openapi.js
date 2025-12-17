module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  const proto =
    (req.headers["x-forwarded-proto"] && String(req.headers["x-forwarded-proto"]).split(",")[0].trim()) ||
    "https";
  const host =
    (req.headers["x-forwarded-host"] && String(req.headers["x-forwarded-host"]).split(",")[0].trim()) ||
    (req.headers["host"] ? String(req.headers["host"]).trim() : "");

  const baseUrl = host ? `${proto}://${host}` : "https://notegen-gpts-j8y1sxjzt-maogons-projects.vercel.app";

  const yaml = `openapi: 3.1.0
info:
  title: NoteGenerator Commit API
  version: 1.0.0
servers:
  - url: ${baseUrl}
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
              $ref: '#/components/schemas/SaveArticleRequest'
      responses:
        "200":
          description: Saved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SaveArticleResponse'
components:
  schemas:
    SaveArticleRequest:
      type: object
      required:
        - title
        - content
      properties:
        title:
          type: string
          description: Article title
        content:
          type: string
          description: Markdown content (UTF-8)
        slug:
          type: string
          description: Optional filename slug (fallback - derived from title)
        yyyymmdd:
          type: string
          description: Optional date prefix like 20251217 (fallback - UTC today)
        commit_message:
          type: string
          description: Optional commit message
    SaveArticleResponse:
      type: object
      properties:
        ok:
          type: boolean
        path:
          type: string
        html_url:
          type: string
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
`;

  res.setHeader("Content-Type", "text/yaml; charset=utf-8");
  res.statusCode = 200;
  res.end(yaml);
};
