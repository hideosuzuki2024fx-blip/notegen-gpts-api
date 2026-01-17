import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const owner = String(req.query.owner ?? "");
    const repo = String(req.query.repo ?? "");
    const path = String(req.query.path ?? "");

    const resp = await octokit.repos.getContent({ owner, repo, path });
    const data = resp.data;

    if (Array.isArray(data)) {
      res.status(200).json({ items: data });
      return;
    }

    res.status(200).json({ item: data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
}
