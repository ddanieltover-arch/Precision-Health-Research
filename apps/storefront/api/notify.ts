import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 30,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    // Dynamic import so load failures return JSON instead of a blank 500
    const { handleNotifyRequest } = await import('../server/email/send.js');
    const { status, result } = await handleNotifyRequest(req.body);
    return res.status(status).json(result);
  } catch (err) {
    console.error('[api/notify]', err);
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Notify handler crashed',
    });
  }
}
