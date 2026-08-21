import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { handleNotifyRequest } from './email/send.js';
import { handleCreateOrderRequest } from './orders/createOrder.js';
import { handleAdminOrderRequest } from './admin/ordersAdmin.js';
import { handleAdminCustomerRequest } from './admin/customersAdmin.js';

/**
 * Local /api/* endpoints so Resend + order persistence work during `vite` without Vercel CLI.
 */
export function notifyDevPlugin(): Plugin {
  return {
    name: 'phr-notify-dev-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir || process.cwd(), '');
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        const allowed = new Set([
          '/api/notify',
          '/api/create-order',
          '/api/admin-orders',
          '/api/admin-customers',
        ]);
        if (!url || !allowed.has(url)) {
          next();
          return;
        }

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-phr-admin-key');
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
          const raw = Buffer.concat(chunks).toString('utf8');
          const body = raw ? JSON.parse(raw) : {};
          const adminKeyHeader = req.headers['x-phr-admin-key'];
          const adminKey = Array.isArray(adminKeyHeader) ? adminKeyHeader[0] : adminKeyHeader;

          let status = 500;
          let result: unknown = { ok: false, error: 'Unhandled' };

          if (url === '/api/admin-orders') {
            ({ status, result } = await handleAdminOrderRequest(body, adminKey));
          } else if (url === '/api/admin-customers') {
            ({ status, result } = await handleAdminCustomerRequest(body, adminKey));
          } else if (url === '/api/create-order') {
            ({ status, result } = await handleCreateOrderRequest(body));
          } else {
            ({ status, result } = await handleNotifyRequest(body));
          }

          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: false,
              error: err instanceof Error ? err.message : 'API middleware failed',
            }),
          );
        }
      });
    },
  };
}
