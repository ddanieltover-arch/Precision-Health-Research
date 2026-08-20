import { Resend } from 'resend';
import type { EmailMessage, NotifyPayload, NotifyResult } from './types.js';
import {
  BRAND,
  buildContactAdminEmail,
  buildContactUserEmail,
  buildNewsletterAdminEmail,
  buildNewsletterUserEmail,
  buildOrderAdminEmail,
  buildOrderStatusAdminEmail,
  buildOrderStatusUserEmail,
  buildOrderUserEmail,
  buildQuickInquiryAdminEmail,
  buildQuickInquiryUserEmail,
} from './templates.js';

function env(name: string, fallback = ''): string {
  return (process.env[name] || fallback).trim();
}

function getResendClient(): Resend | null {
  const key = env('RESEND_API_KEY');
  if (!key) return null;
  return new Resend(key);
}

function getFromAddress(): string {
  return env('EMAIL_FROM', `${BRAND.name} <${BRAND.support}>`);
}

function getAdminEmail(): string {
  return env('ADMIN_EMAIL', env('VITE_ADMIN_EMAIL', BRAND.support));
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function makeTicketId(prefix: string): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${n}`;
}

async function sendOne(client: Resend, message: EmailMessage): Promise<void> {
  const { data, error } = await client.emails.send({
    from: getFromAddress(),
    to: [message.to],
    subject: message.subject,
    html: message.html,
    replyTo: message.replyTo,
  });
  if (error) {
    const msg =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message: string }).message)
        : 'Resend send failed';
    throw new Error(msg);
  }
  if (!data?.id) {
    throw new Error('Resend returned no message id');
  }
}

function buildMessages(payload: NotifyPayload): {
  ticketId?: string;
  orderId?: string;
  user: EmailMessage;
  admin: EmailMessage;
} {
  switch (payload.type) {
    case 'contact': {
      const ticketId = payload.ticketId || makeTicketId('PHR');
      const userTpl = buildContactUserEmail(payload, ticketId);
      const adminTpl = buildContactAdminEmail(payload, ticketId);
      return {
        ticketId,
        user: { to: payload.email, subject: userTpl.subject, html: userTpl.html },
        admin: {
          to: getAdminEmail(),
          subject: adminTpl.subject,
          html: adminTpl.html,
          replyTo: adminTpl.replyTo,
        },
      };
    }
    case 'newsletter': {
      const userTpl = buildNewsletterUserEmail(payload);
      const adminTpl = buildNewsletterAdminEmail(payload);
      return {
        user: { to: payload.email, subject: userTpl.subject, html: userTpl.html },
        admin: {
          to: getAdminEmail(),
          subject: adminTpl.subject,
          html: adminTpl.html,
          replyTo: adminTpl.replyTo,
        },
      };
    }
    case 'quick_inquiry': {
      const ticketId = payload.ticketId || makeTicketId('PHR-Q');
      const userTpl = buildQuickInquiryUserEmail(payload, ticketId);
      const adminTpl = buildQuickInquiryAdminEmail(payload, ticketId);
      return {
        ticketId,
        user: { to: payload.email, subject: userTpl.subject, html: userTpl.html },
        admin: {
          to: getAdminEmail(),
          subject: adminTpl.subject,
          html: adminTpl.html,
          replyTo: adminTpl.replyTo,
        },
      };
    }
    case 'order_confirmation': {
      const orderId = payload.orderId || makeTicketId('PHR-UK');
      const withOrder = { ...payload, orderId };
      const userTpl = buildOrderUserEmail(withOrder);
      const adminTpl = buildOrderAdminEmail(withOrder);
      return {
        orderId,
        user: { to: payload.email, subject: userTpl.subject, html: userTpl.html },
        admin: {
          to: getAdminEmail(),
          subject: adminTpl.subject,
          html: adminTpl.html,
          replyTo: adminTpl.replyTo,
        },
      };
    }
    case 'order_status': {
      const orderId = payload.orderId || 'PHR-ORDER';
      const userTpl = buildOrderStatusUserEmail(payload);
      const adminTpl = buildOrderStatusAdminEmail(payload);
      return {
        orderId,
        user: { to: payload.email, subject: userTpl.subject, html: userTpl.html },
        admin: {
          to: getAdminEmail(),
          subject: adminTpl.subject,
          html: adminTpl.html,
        },
      };
    }
    default:
      throw new Error(`Unsupported notification type: ${(payload as NotifyPayload).type}`);
  }
}

export function validatePayload(body: unknown): { ok: true; payload: NotifyPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON body' };
  }
  const payload = body as Partial<NotifyPayload>;
  const allowed: NotifyPayload['type'][] = [
    'contact',
    'newsletter',
    'quick_inquiry',
    'order_confirmation',
    'order_status',
  ];
  if (!payload.type || !allowed.includes(payload.type)) {
    return { ok: false, error: 'Invalid notification type' };
  }
  if (!payload.email || !isValidEmail(payload.email)) {
    return { ok: false, error: 'A valid email address is required' };
  }
  if (payload.type === 'contact' || payload.type === 'quick_inquiry') {
    if (!payload.message?.trim()) {
      return { ok: false, error: 'Message is required' };
    }
  }
  if (payload.type === 'order_confirmation' && (!payload.items || payload.items.length === 0)) {
    return { ok: false, error: 'Order items are required' };
  }
  if (payload.type === 'order_status' && !payload.orderId) {
    return { ok: false, error: 'Order ID is required' };
  }
  return { ok: true, payload: payload as NotifyPayload };
}

export async function processNotification(payload: NotifyPayload): Promise<NotifyResult> {
  const client = getResendClient();
  if (!client) {
    return { ok: false, error: 'RESEND_API_KEY is not configured on the server' };
  }

  const built = buildMessages(payload);
  const adminEmail = getAdminEmail().toLowerCase();
  const userEmail = payload.email.toLowerCase();

  // Always notify both sides. If admin === user, still send one admin-labelled and one user-labelled message.
  const queue: EmailMessage[] = [built.user, built.admin];
  if (adminEmail === userEmail) {
    // Keep both sends so inbox still gets confirmation + ops copy with different subjects.
  }

  let emailsSent = 0;
  const errors: string[] = [];

  for (const message of queue) {
    try {
      await sendOne(client, message);
      emailsSent += 1;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Send failed');
    }
  }

  if (emailsSent < 2) {
    return {
      ok: false,
      ticketId: built.ticketId,
      orderId: built.orderId,
      emailsSent,
      error: errors.join('; ') || 'Failed to deliver both admin and user notifications',
    };
  }

  // Persist storefront orders so admin CMS stays in sync (idempotent by order number).
  if (payload.type === 'order_confirmation') {
    try {
      const { handleCreateOrderRequest } = await import('../orders/createOrder.js');
      const fullName = String(payload.name || '').trim();
      const nameParts = fullName.split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ');
      const lines = String(payload.shippingAddress || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => line.toLowerCase() !== fullName.toLowerCase());
      const countryIdx = lines.findIndex((line) =>
        /united kingdom|^uk$|united states|^usa$/i.test(line),
      );
      const country = countryIdx >= 0 ? lines[countryIdx] : 'United Kingdom';
      const rest = countryIdx >= 0 ? lines.filter((_, i) => i !== countryIdx) : lines;
      const postcode = rest.length >= 1 ? rest[rest.length - 1] : 'N/A';
      const city = rest.length >= 2 ? rest[1] : 'Unknown';
      const county = rest.length >= 4 ? rest[2] : '';
      const street = rest[0] || 'Address not provided';

      const persist = await handleCreateOrderRequest({
        orderNumber: built.orderId,
        email: payload.email,
        phone: payload.phone || '',
        firstName,
        lastName,
        address: street,
        city,
        county: county || undefined,
        postcode,
        country,
        paymentMethod: payload.paymentMethod || 'bank_transfer',
        shippingMethod: payload.shippingMethod || '',
        subtotal: payload.subtotal ?? payload.total ?? 0,
        shippingCost: payload.shippingCost ?? 0,
        total: payload.total ?? 0,
        notes: payload.notes,
        items: (payload.items || []).map((item) => ({
          slug: item.slug,
          productId: item.productId,
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
      if (!persist.result.ok) {
        console.error('[notify] order persist failed:', persist.result.error);
      }
    } catch (err) {
      console.error('[notify] order persist crashed:', err);
    }
  }

  return {
    ok: true,
    ticketId: built.ticketId,
    orderId: built.orderId,
    emailsSent,
  };
}

export async function handleNotifyRequest(body: unknown): Promise<{ status: number; result: NotifyResult }> {
  const validated = validatePayload(body);
  if (!validated.ok) {
    return { status: 400, result: { ok: false, error: validated.error } };
  }
  try {
    const result = await processNotification(validated.payload);
    return { status: result.ok ? 200 : 502, result };
  } catch (err) {
    return {
      status: 500,
      result: { ok: false, error: err instanceof Error ? err.message : 'Unexpected email error' },
    };
  }
}
