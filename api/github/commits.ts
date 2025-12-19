import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { path = "articles/", owner = "hideosuzuki2024fx-blip", repo = "NoteGenerator" } = req.query;

    // PAT は Vercel の環境変数に設定済み (ex: process.env.GITHUB_TOKEN)
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Missing GITHUB_TOKEN in environment." });
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}`;
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "NoteGen-Vercel-Agent"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `GitHub API error: ${errText}` });
    }

    const commits = await response.json();

    // コミットメッセージと日付・URLを整形
    const formatted = commits.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author.date,
      url: c.html_url,
      author: c.commit.author.name,
    }));

    return res.status(200).json({ ok: true, commits: formatted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Unexpected error" });
  }
}
