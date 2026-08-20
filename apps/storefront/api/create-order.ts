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
    const { handleCreateOrderRequest } = await import('../server/orders/createOrder.js');
    const { status, result } = await handleCreateOrderRequest(req.body);
    return res.status(status).json(result);
  } catch (err) {
    console.error('[api/create-order]', err);
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Create order handler crashed',
    });
  }
}
