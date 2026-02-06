// pages/api/listRepoFiles.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    files: [
      {
        name: '20251219_gpt-5-integration-successful.md',
        path: 'articles/20251219_gpt-5-integration-successful.md'
      }
    ]
  });
}
