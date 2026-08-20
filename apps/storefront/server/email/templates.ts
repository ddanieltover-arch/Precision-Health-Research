import type { NotifyPayload, OrderLineItem } from './types.js';

const BRAND = {
  name: 'Precision Health Research',
  site: 'https://www.ph-research.store',
  support: 'info@ph-research.store',
  phone: '+44 7723 206940',
  primary: '#335e90',
  navy: '#0f1d2f',
  muted: '#64748b',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(amount: number | undefined, currency = 'GBP'): string {
  const value = typeof amount === 'number' ? amount : 0;
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(value);
  } catch {
    return `£${value.toFixed(2)}`;
  }
}

function layout(options: {
  preheader: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(options.title)}</title>
  <!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(options.preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dbe3ef;">
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.navy} 0%,#1b3552 100%);padding:28px 32px;">
              <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7dd3fc;font-weight:700;margin-bottom:8px;">
                Analytical Laboratory Supply
              </div>
              <div style="font-size:22px;line-height:1.25;font-weight:800;color:#ffffff;">
                ${escapeHtml(BRAND.name)}
              </div>
              <div style="margin-top:6px;font-size:13px;color:#cbd5e1;">
                ${escapeHtml(options.title)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px 32px;font-size:14px;line-height:1.65;color:#334155;">
              ${options.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;font-size:12px;line-height:1.6;color:${BRAND.muted};">
                    <strong style="color:#0f172a;">Laboratory Support</strong><br />
                    Email: <a href="mailto:${BRAND.support}" style="color:${BRAND.primary};text-decoration:none;">${BRAND.support}</a><br />
                    WhatsApp: <a href="https://wa.me/447723206940" style="color:${BRAND.primary};text-decoration:none;">${BRAND.phone}</a><br />
                    Web: <a href="${BRAND.site}" style="color:${BRAND.primary};text-decoration:none;">${BRAND.site.replace('https://', '')}</a>
                    ${options.footerNote ? `<p style="margin:12px 0 0 0;">${escapeHtml(options.footerNote)}</p>` : ''}
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0 0;font-size:11px;color:#94a3b8;text-align:center;line-height:1.5;">
                © ${year} ${escapeHtml(BRAND.name)}. Research compounds for laboratory use only.<br />
                Not for human or veterinary administration.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;width:38%;font-size:12px;color:#64748b;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;font-weight:600;vertical-align:top;">${valueHtml}</td>
  </tr>`;
}

function detailsTable(rows: Array<[string, string]>): string {
  if (!rows.length) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 8px 0;">
    ${rows.map(([label, value]) => detailRow(label, value)).join('')}
  </table>`;
}

/** Build detail rows from submitted values — skips blank optional fields. */
function submittedDetails(
  rows: Array<[string, string | number | undefined | null, { html?: boolean; multiline?: boolean; always?: boolean }?]>,
): string {
  const out: Array<[string, string]> = [];
  for (const [label, raw, opts] of rows) {
    const text = raw == null ? '' : String(raw).trim();
    if (!text && !opts?.always) continue;
    const display = text || '—';
    if (opts?.html) {
      out.push([label, display]);
    } else if (opts?.multiline) {
      out.push([label, `<div style="white-space:pre-wrap;font-weight:500;">${escapeHtml(display)}</div>`]);
    } else {
      out.push([label, escapeHtml(display)]);
    }
  }
  return detailsTable(out);
}

function itemsTable(items: OrderLineItem[] | undefined, currency = 'GBP'): string {
  if (!items?.length) return '<p style="margin:12px 0;color:#64748b;font-size:13px;">No line items listed.</p>';
  const rows = items
    .map(
      (item) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;">
          <strong>${escapeHtml(item.name)}</strong>
          ${item.variant ? `<div style="font-size:12px;color:#64748b;font-weight:400;">${escapeHtml(item.variant)}</div>` : ''}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:center;color:#334155;">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:right;color:#334155;">${escapeHtml(formatMoney(item.unitPrice, currency))}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:right;color:#0f172a;font-weight:600;">${escapeHtml(formatMoney(item.lineTotal, currency))}</td>
      </tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 4px 0;">
    <tr>
      <td style="padding:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:700;">Compound</td>
      <td style="padding:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:700;text-align:center;">Qty</td>
      <td style="padding:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:700;text-align:right;">Unit</td>
      <td style="padding:0 0 8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:700;text-align:right;">Line</td>
    </tr>
    ${rows}
  </table>`;
}

function orderTotalsHtml(payload: NotifyPayload): string {
  const currency = payload.currency || 'GBP';
  const rows: Array<[string, string]> = [
    ['Subtotal', escapeHtml(formatMoney(payload.subtotal, currency))],
    ['Shipping', escapeHtml(formatMoney(payload.shippingCost, currency))],
  ];
  if ((payload.discount || 0) > 0) {
    rows.push(['Discount', escapeHtml(`−${formatMoney(payload.discount, currency)}`)]);
  }
  rows.push([
    'Order total',
    `<span style="font-size:16px;color:${BRAND.primary};">${escapeHtml(formatMoney(payload.total, currency))}</span>`,
  ]);
  return detailsTable(rows);
}

function paymentLabel(method?: string): string {
  if (method === 'crypto') return 'Cryptocurrency (BTC) — 5% discount applied';
  if (method === 'bank_transfer') return 'UK Bank Transfer (Faster Payments)';
  return method?.trim() || '';
}

function ctaButton(label: string, href: string): string {
  return `<p style="margin:22px 0 8px 0;">
    <a href="${href}" style="display:inline-block;background:${BRAND.primary};color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 20px;border-radius:10px;">
      ${escapeHtml(label)}
    </a>
  </p>`;
}

function greeting(name?: string): string {
  const safe = name?.trim();
  return safe ? `Hello ${escapeHtml(safe)},` : 'Hello,';
}

function mono(value: string): string {
  return `<span style="font-family:ui-monospace,Consolas,monospace;">${escapeHtml(value)}</span>`;
}

function mailtoLink(email: string): string {
  return `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND.primary};">${escapeHtml(email)}</a>`;
}

export function buildContactUserEmail(payload: NotifyPayload, ticketId: string) {
  const html = layout({
    preheader: `We received your inquiry ${ticketId}`,
    title: 'Inquiry received',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting(payload.name)}</p>
      <p style="margin:0 0 12px 0;">Thank you for contacting ${escapeHtml(BRAND.name)}. Here is a copy of everything you submitted.</p>
      ${submittedDetails([
        ['Ticket reference', mono(ticketId), { html: true, always: true }],
        ['Name', payload.name, { always: true }],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Subject', payload.subject || 'Analytical inquiry', { always: true }],
        ['Message', payload.message, { multiline: true, always: true }],
        ['Phone', payload.phone],
        ['Institution', payload.institution],
      ])}
      <p style="margin:16px 0 0 0;">A specialist typically responds within <strong>4 business hours</strong> (Mon–Fri, 08:00–18:00 GMT).</p>
      ${ctaButton('Visit laboratory storefront', BRAND.site)}
    `,
    footerNote: 'Please keep this ticket reference for follow-up correspondence.',
  });
  return {
    subject: `We received your inquiry · ${ticketId}`,
    html,
  };
}

export function buildContactAdminEmail(payload: NotifyPayload, ticketId: string) {
  const html = layout({
    preheader: `New contact inquiry from ${payload.name || payload.email}`,
    title: 'New contact inquiry',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">A new laboratory support inquiry was submitted on the storefront. Full submission details:</p>
      ${submittedDetails([
        ['Ticket', mono(ticketId), { html: true, always: true }],
        ['Name', payload.name, { always: true }],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Phone', payload.phone],
        ['Institution', payload.institution],
        ['Subject', payload.subject || '—', { always: true }],
        ['Message', payload.message, { multiline: true, always: true }],
      ])}
      ${ctaButton('Reply to researcher', `mailto:${encodeURIComponent(payload.email)}?subject=${encodeURIComponent(`Re: ${payload.subject || ticketId}`)}`)}
    `,
  });
  return {
    subject: `[PHR] New contact · ${ticketId} · ${payload.subject || 'Inquiry'}`,
    html,
    replyTo: payload.email,
  };
}

export function buildNewsletterUserEmail(payload: NotifyPayload) {
  const html = layout({
    preheader: 'You are subscribed to batch and compound alerts',
    title: 'Subscription confirmed',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting(payload.name)}</p>
      <p style="margin:0 0 12px 0;">You are now subscribed to ${escapeHtml(BRAND.name)} research alerts. We will notify you about new compound releases, batch synthesis updates, and COA availability.</p>
      ${submittedDetails([
        ['Subscribed email', mailtoLink(payload.email), { html: true, always: true }],
        ['Name', payload.name],
      ])}
      <p style="margin:16px 0 0 0;">You can unsubscribe at any time by replying to this email with <strong>UNSUBSCRIBE</strong>.</p>
      ${ctaButton('Browse catalog', `${BRAND.site}/catalog`)}
    `,
  });
  return {
    subject: 'Subscription confirmed · Precision Health Research',
    html,
  };
}

export function buildNewsletterAdminEmail(payload: NotifyPayload) {
  const html = layout({
    preheader: `New newsletter subscriber: ${payload.email}`,
    title: 'New newsletter subscriber',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">A researcher subscribed to laboratory alerts from the storefront footer.</p>
      ${submittedDetails([
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Name', payload.name],
        ['Source', 'Storefront newsletter form', { always: true }],
      ])}
    `,
  });
  return {
    subject: `[PHR] Newsletter subscriber · ${payload.email}`,
    html,
    replyTo: payload.email,
  };
}

export function buildQuickInquiryUserEmail(payload: NotifyPayload, ticketId: string) {
  const html = layout({
    preheader: `Quick inquiry received · ${ticketId}`,
    title: 'Quick inquiry received',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting(payload.name)}</p>
      <p style="margin:0 0 12px 0;">Your direct compound inquiry has been dispatched to our scientific support team. Here is a copy of your submission:</p>
      ${submittedDetails([
        ['Ticket reference', mono(ticketId), { html: true, always: true }],
        ['Name', payload.name],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Message', payload.message, { multiline: true, always: true }],
      ])}
      <p style="margin:16px 0 0 0;">Expect a reply within <strong>4 business hours</strong> via email or WhatsApp.</p>
    `,
  });
  return {
    subject: `Quick inquiry received · ${ticketId}`,
    html,
  };
}

export function buildQuickInquiryAdminEmail(payload: NotifyPayload, ticketId: string) {
  const html = layout({
    preheader: `Quick inquiry from ${payload.email}`,
    title: 'New quick inquiry',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">A researcher submitted a quick inquiry from the floating Lab Support panel. Full details:</p>
      ${submittedDetails([
        ['Ticket', mono(ticketId), { html: true, always: true }],
        ['Name', payload.name || 'Not provided', { always: true }],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Message', payload.message, { multiline: true, always: true }],
      ])}
      ${ctaButton('Reply to researcher', `mailto:${encodeURIComponent(payload.email)}?subject=${encodeURIComponent(`Re: ${ticketId}`)}`)}
    `,
  });
  return {
    subject: `[PHR] Quick inquiry · ${ticketId}`,
    html,
    replyTo: payload.email,
  };
}

export function buildOrderUserEmail(payload: NotifyPayload) {
  const currency = payload.currency || 'GBP';
  const orderId = payload.orderId || 'PHR-ORDER';
  const pay = paymentLabel(payload.paymentMethod);

  const html = layout({
    preheader: `Order ${orderId} received — payment instructions enclosed`,
    title: 'Order confirmation',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting(payload.name)}</p>
      <p style="margin:0 0 12px 0;">Thank you for your research supply order. Below is a full record of what you submitted.</p>
      ${submittedDetails([
        ['Order reference', mono(orderId), { html: true, always: true }],
        ['Customer name', payload.name, { always: true }],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Phone', payload.phone],
        ['Payment method', pay, { always: true }],
        ['Shipping method', payload.shippingMethod, { always: true }],
        ['Shipping ETA', payload.shippingEta],
        ['Delivery address', payload.shippingAddress, { multiline: true, always: true }],
        ['Order notes', payload.notes, { multiline: true }],
      ])}
      <h3 style="margin:20px 0 0 0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#0f172a;">Order contents</h3>
      ${itemsTable(payload.items, currency)}
      ${orderTotalsHtml(payload)}
      <div style="margin:18px 0;padding:14px 16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;font-size:13px;color:#1e3a5f;">
        <strong>Next step — complete payment</strong><br />
        ${
          payload.paymentMethod === 'crypto'
            ? 'Reply to this email (or contact info@ph-research.store) quoting your order reference to receive the official BTC deposit address.'
            : 'Reply to this email (or contact info@ph-research.store) quoting your order reference to receive UK Sort Code and Account Number details for Faster Payments.'
        }
      </div>
      ${ctaButton('Track shipment updates', `${BRAND.site}/track`)}
    `,
    footerNote: 'Products are supplied strictly for in-vitro laboratory research.',
  });
  return {
    subject: `Order confirmed · ${orderId}`,
    html,
  };
}

export function buildOrderAdminEmail(payload: NotifyPayload) {
  const currency = payload.currency || 'GBP';
  const orderId = payload.orderId || 'PHR-ORDER';
  const pay = paymentLabel(payload.paymentMethod) || payload.paymentMethod || '—';
  const html = layout({
    preheader: `New order ${orderId} from ${payload.email}`,
    title: 'New storefront order',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">A new research order was placed on the storefront. Full checkout details:</p>
      ${submittedDetails([
        ['Order', mono(orderId), { html: true, always: true }],
        ['Customer name', payload.name, { always: true }],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Phone', payload.phone],
        ['Institution', payload.institution],
        ['Payment method', pay, { always: true }],
        ['Payment status', payload.paymentStatus],
        ['Shipping method', payload.shippingMethod, { always: true }],
        ['Shipping ETA', payload.shippingEta],
        ['Delivery address', payload.shippingAddress, { multiline: true, always: true }],
        ['Order notes', payload.notes, { multiline: true }],
      ])}
      <h3 style="margin:20px 0 0 0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#0f172a;">Line items</h3>
      ${itemsTable(payload.items, currency)}
      ${orderTotalsHtml(payload)}
      ${ctaButton('Email payment details to customer', `mailto:${encodeURIComponent(payload.email)}?subject=${encodeURIComponent(`Payment details for ${orderId}`)}`)}
    `,
  });
  return {
    subject: `[PHR] New order · ${orderId} · ${formatMoney(payload.total, currency)}`,
    html,
    replyTo: payload.email,
  };
}

export function buildOrderStatusUserEmail(payload: NotifyPayload) {
  const orderId = payload.orderId || 'PHR-ORDER';
  const status = payload.orderStatus || 'updated';
  const html = layout({
    preheader: `Order ${orderId} status: ${status}`,
    title: 'Order status update',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting(payload.name)}</p>
      <p style="margin:0 0 12px 0;">Your laboratory order status has been updated. Current details:</p>
      ${submittedDetails([
        ['Order reference', mono(orderId), { html: true, always: true }],
        ['Customer name', payload.name],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Phone', payload.phone],
        ['Fulfilment status', status, { always: true }],
        ['Payment status', payload.paymentStatus],
        ['Payment method', paymentLabel(payload.paymentMethod) || payload.paymentMethod],
        ['Shipping method', payload.shippingMethod],
        ['Delivery address', payload.shippingAddress, { multiline: true }],
        ['Notes / message', payload.message || payload.notes, { multiline: true }],
      ])}
      ${payload.items?.length ? `<h3 style="margin:20px 0 0 0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#0f172a;">Order contents</h3>${itemsTable(payload.items, payload.currency || 'GBP')}` : ''}
      ${(payload.total != null || payload.subtotal != null) ? orderTotalsHtml(payload) : ''}
      ${ctaButton('Track order', `${BRAND.site}/track`)}
    `,
  });
  return {
    subject: `Order ${orderId} · ${status}`,
    html,
  };
}

export function buildOrderStatusAdminEmail(payload: NotifyPayload) {
  const orderId = payload.orderId || 'PHR-ORDER';
  const status = payload.orderStatus || 'updated';
  const html = layout({
    preheader: `Status change for ${orderId}`,
    title: 'Order status change copy',
    bodyHtml: `
      <p style="margin:0 0 12px 0;">Customer notification was sent for an order status change. Snapshot of details included:</p>
      ${submittedDetails([
        ['Order', mono(orderId), { html: true, always: true }],
        ['Customer name', payload.name],
        ['Email', mailtoLink(payload.email), { html: true, always: true }],
        ['Phone', payload.phone],
        ['Fulfilment status', status, { always: true }],
        ['Payment status', payload.paymentStatus],
        ['Payment method', paymentLabel(payload.paymentMethod) || payload.paymentMethod],
        ['Shipping method', payload.shippingMethod],
        ['Delivery address', payload.shippingAddress, { multiline: true }],
        ['Notes / message', payload.message || payload.notes, { multiline: true }],
      ])}
    `,
  });
  return {
    subject: `[PHR] Order status · ${orderId} · ${status}`,
    html,
  };
}

export { BRAND, escapeHtml, formatMoney };
