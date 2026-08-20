export type NotifyType =
  | 'contact'
  | 'newsletter'
  | 'quick_inquiry'
  | 'order_confirmation'
  | 'order_status';

export interface OrderLineItemPayload {
  name: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface NotifyRequest {
  type: NotifyType;
  email: string;
  name?: string;
  subject?: string;
  message?: string;
  phone?: string;
  institution?: string;
  ticketId?: string;
  orderId?: string;
  orderStatus?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingMethod?: string;
  shippingAddress?: string;
  items?: OrderLineItemPayload[];
  subtotal?: number;
  shippingCost?: number;
  discount?: number;
  total?: number;
  currency?: string;
  notes?: string;
}

export interface NotifyResponse {
  ok: boolean;
  ticketId?: string;
  orderId?: string;
  error?: string;
  emailsSent?: number;
}

export async function sendNotification(payload: NotifyRequest): Promise<NotifyResponse> {
  const response = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data: NotifyResponse | null = null;
  try {
    data = (await response.json()) as NotifyResponse;
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    return {
      ok: false,
      ticketId: data?.ticketId,
      orderId: data?.orderId,
      emailsSent: data?.emailsSent,
      error: data?.error || `Notification failed (${response.status})`,
    };
  }

  return data;
}

const INQUIRIES_KEY = 'phr_admin_inquiries';

export interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'CLOSED' | 'SPAM';
  createdAt: string;
}

/** Persist inquiry for the admin CMS queue (same browser / shared device). */
export function persistInquiryLocally(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ticketId?: string;
}): StoredInquiry {
  const row: StoredInquiry = {
    id: input.ticketId || crypto.randomUUID(),
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    const existing = raw ? (JSON.parse(raw) as StoredInquiry[]) : [];
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify([row, ...existing].slice(0, 200)));
  } catch {
    // ignore storage failures
  }

  return row;
}
