// ✅ Note ジェネレーター GitHub Commits API
//    Vercel上で /api/github/commits?path=articles/ の形式で呼び出し可能
//    GPT からも JIT 経由で直接アクセスできるように runtime: "edge" を指定

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // クエリから owner / repo / path を取得
    const {
      owner = "hideosuzuki2024fx-blip",
      repo = "NoteGenerator",
      path = "articles/",
    } = req.query;

    // Vercel の環境変数に設定された GitHub Personal Access Token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "❌ Missing GITHUB_TOKEN in environment." });
    }

    // GitHub API 呼び出し
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}`;
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "NoteGen-Vercel-Agent",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `❌ GitHub API error: ${errText}`,
      });
    }

    const commits = await response.json();

    // コミットメッセージ・URL・著者・日付を整形
    const formatted = commits.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author?.date || c.commit.committer?.date,
      url: c.html_url,
      author: c.commit.author?.name || c.commit.committer?.name,
    }));

    // 成功レスポンス
    return res.status(200).json({
      ok: true,
      count: formatted.length,
      commits: formatted,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "❌ Unexpected error during GitHub commit fetch.",
    });
  }
}

// ✅ Edge Runtime 対応（GPT / JITプラグイン からの直接アクセスを許可）
export const config = {
  runtime: "edge",
};
