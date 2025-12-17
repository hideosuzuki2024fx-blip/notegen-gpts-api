import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path parameter" });

  try {
    const token = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = ["hideosuzuki2024fx-blip", "NoteGenerator"];

    const { data } = await octokit.repos.getContent({ owner, repo, path });

    if (data.content) {
      const decoded = Buffer.from(data.content, "base64").toString("utf-8");
      res.status(200).json({ path, content: decoded });
    } else {
      res.status(404).json({ error: "File not found or not readable" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
