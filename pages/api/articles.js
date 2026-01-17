function getAuthBearer(req) {
  const h = req.headers["authorization"];
  if (!h || typeof h !== "string") return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

function safeSlug(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function yyyymmddUTC(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function validatePath(p) {
  // must be NoteMD/articles/<yyyymmdd>_<slug>.md and no traversal
  if (typeof p !== "string") return false;
  if (p.includes("..") || p.includes("\\") || p.startsWith("/")) return false;
  if (!p.startsWith("NoteMD/articles/")) return false;
  if (!p.endsWith(".md")) return false;
  return true;
}

async function ghFetch(url, token, init) {
  const headers = Object.assign(
    {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Authorization": `Bearer ${token}`
    },
    (init && init.headers) || {}
  );
  return fetch(url, Object.assign({}, init, { headers }));
}

function encodeGhPath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  const apiKey = process.env.API_KEY || "";
  const bearer = getAuthBearer(req);
  if (!apiKey || bearer !== apiKey) {
    res.statusCode = 401;
    return res.end("Unauthorized");
  }

  const owner = process.env.GITHUB_OWNER || "hideosuzuki2024fx-blip";
  const repo = process.env.GITHUB_REPO || "NoteGenerator";
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN || "";

  if (!token) {
    res.statusCode = 500;
    return res.end("Missing GITHUB_TOKEN");
  }

  try {
    const json = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const title = String(json.title || "").trim();
    const content = String(json.content || "");
    if (!title || !content) {
      res.statusCode = 400;
      return res.end("title and content are required");
    }

    const slug = safeSlug(json.slug || title);
    const ymd = String(json.yyyymmdd || "").trim() || yyyymmddUTC();
    const path = `NoteMD/articles/${ymd}_${slug}.md`;

    if (!validatePath(path)) {
      res.statusCode = 400;
      return res.end("Invalid path");
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeGhPath(path)}`;

    // Check existing (for sha)
    let sha = null;
    const getResp = await ghFetch(url, token, { method: "GET" });
    if (getResp.status === 200) {
      const getJson = await getResp.json();
      sha = getJson.sha;
    } else if (getResp.status !== 404) {
      const t = await getResp.text();
      res.statusCode = 502;
      return res.end(`GitHub GET failed: ${getResp.status} ${t}`);
    }

    const commitMessage =
      (json.commit_message && String(json.commit_message).trim()) ||
      `Add article: ${ymd}_${slug}`;

    const putBody = {
      message: commitMessage,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch
    };
    if (sha) putBody.sha = sha;

    const putResp = await ghFetch(url, token, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(putBody)
    });

    if (putResp.status !== 201 && putResp.status !== 200) {
      const t = await putResp.text();
      res.statusCode = 502;
      return res.end(`GitHub PUT failed: ${putResp.status} ${t}`);
    }

    const out = await putResp.json();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 200;
    res.end(JSON.stringify({
      ok: true,
      path,
      html_url: out.content && out.content.html_url ? out.content.html_url : null
    }));
  } catch (e) {
    res.statusCode = 500;
    res.end(`Server error: ${e && e.message ? e.message : String(e)}`);
  }
}
