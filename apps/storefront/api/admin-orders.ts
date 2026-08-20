import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 30,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-phr-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { handleAdminOrderRequest } = await import('../server/admin/ordersAdmin.js');
    const adminKey =
      (typeof req.headers['x-phr-admin-key'] === 'string' && req.headers['x-phr-admin-key']) ||
      undefined;
    const { status, result } = await handleAdminOrderRequest(req.body, adminKey);
    return res.status(status).json(result);
  } catch (err) {
    console.error('[api/admin-orders]', err);
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Admin orders handler crashed',
    });
  }
}
