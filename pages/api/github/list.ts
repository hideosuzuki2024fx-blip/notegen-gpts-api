import { Octokit } from "@octokit/rest";
import type { NextApiRequest, NextApiResponse } from "next";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = "hideosuzuki2024fx-blip";
const repo = "NoteGenerator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = "" } = req.query;

  try {
    const result = await octokit.repos.getContent({
      owner,
      repo,
      path: path as string,
    });

    res.status(200).json((result.data));
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
