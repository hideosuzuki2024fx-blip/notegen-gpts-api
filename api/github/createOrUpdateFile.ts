import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { path, content, message } = req.body;
    const token = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = ["hideosuzuki2024fx-blip", "NoteGenerator"];

    // 既存ファイルか確認してSHAを取得
    let sha;
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      sha = data.sha;
    } catch {
      sha = undefined; // 新規作成
    }

    const result = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: message || `update from GPTs API: ${path}`,
      content: Buffer.from(content).toString("base64"),
      sha
    });

    res.status(200).json({
      message: "File committed successfully",
      path,
      commit: result.data.commit.sha
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
