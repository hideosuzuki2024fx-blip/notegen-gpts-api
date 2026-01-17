import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, body } = req.body as { title?: string; body?: string };
    if (!title || !body) {
      res.status(400).json({ error: "title and body required" });
      return;
    }

    // 実際の保存処理をここに実装してください
    res.status(200).json({ ok: true, article: { title, body } });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
}
