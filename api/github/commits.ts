// ✅ Note ジェネレーター GitHub Commits API — Edge Runtime 対応版
//    呼び出し例: https://notegen-gpts-api.vercel.app/api/github/commits?path=articles/

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner") || "hideosuzuki2024fx-blip";
    const repo = searchParams.get("repo") || "NoteGenerator";
    const path = searchParams.get("path") || "articles/";

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return new Response(
        JSON.stringify({ error: "❌ Missing GITHUB_TOKEN in environment." }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${path}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "NoteGen-Vercel-Edge",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `GitHub API error: ${errText}` }),
        { status: response.status, headers: { "content-type": "application/json" } }
      );
    }

    const commits = await response.json();

    const formatted = commits.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author?.date || c.commit.committer?.date,
      url: c.html_url,
      author: c.commit.author?.name || c.commit.committer?.name,
    }));

    return new Response(
      JSON.stringify({ ok: true, count: formatted.length, commits: formatted }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err?.message || "❌ Unexpected error during GitHub commit fetch.",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
