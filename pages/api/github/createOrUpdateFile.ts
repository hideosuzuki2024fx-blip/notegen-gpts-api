// pages/api/github/createOrUpdateFile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { owner, repo, path, content, message } = req.body as {
      owner: string;
      repo: string;
      path: string;
      content: string;
      message?: string;
    };

    let sha: string | undefined;
    try {
      const getResp = await octokit.repos.getContent({ owner, repo, path });
      const data = getResp.data;
      if (!Array.isArray(data) && "sha" in data) {
        sha = data.sha;
      }
    } catch (e) {
      // ファイルが存在しない場合は新規作成扱い
    }

    const encoded = Buffer.from(content, "utf8").toString("base64");

    const params: any = {
      owner,
      repo,
      path,
      message: message ?? "update file",
      content: encoded
    };
    if (sha) params.sha = sha;

    const resp = await octokit.repos.createOrUpdateFileContents(params);
    res.status(200).json({ ok: true, result: resp.data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
}
