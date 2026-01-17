
import { Octokit } from "@octokit/rest";
import type { NextApiRequest, NextApiResponse } from "next";

const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});

const owner = "hideosuzuki2024fx-blip";
const repo = "NoteGenerator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { path, message } = req.body;

  if (!path || !message) {
    res.status(400).json({ error: "Missing required fields: path, message" });
    return;
  }

  try {
    const { data } = await octokit.repos.getContent({uowner, repo, path});
    if (Array.isArray(data) || !data.sha) {
      throw new Error("path is not a file or SHA not found");
    }

    const result = await octokit.repos.deleteFile({uowner, repo, path, message, sha: data.sha});

    res.status(200).json(result.data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
