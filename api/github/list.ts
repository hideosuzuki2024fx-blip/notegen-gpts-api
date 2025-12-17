import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default async function handler(req, res) {
  const { path = "" } = req.query;

  try {
    const response = await octokit.repos.getContent({
      owner: "hideosuzuki2024fx-blip",
      repo: "NoteGenerator",
      path,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
