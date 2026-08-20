import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type AdminOrderAction = 'update' | 'delete';

export interface AdminOrderRequest {
  action: AdminOrderAction;
  id: string;
  patch?: Record<string, unknown>;
}

export interface AdminOrderResult {
  ok: boolean;
  order?: Record<string, unknown> | null;
  error?: string;
}

function env(name: string, fallback = ''): string {
  return (process.env[name] || fallback).trim();
}

function getServiceClient(): SupabaseClient | null {
  const url = env('VITE_SUPABASE_URL') || env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getExpectedAdminKey(): string {
  return env('ADMIN_API_SECRET') || env('ADMIN_PASSWORD') || env('VITE_ADMIN_PASSWORD');
}

export function isAuthorizedAdminKey(provided: string | undefined | null): boolean {
  const expected = getExpectedAdminKey();
  if (!expected || !provided) return false;
  return provided.trim() === expected;
}

const UPDATE_FIELDS = new Set([
  'order_number',
  'status',
  'payment_status',
  'payment_method',
  'shipping_method',
  'subtotal',
  'shipping_cost',
  'total',
  'notes',
  'contact_email',
  'contact_phone',
  'shipping_address_json',
]);

export async function handleAdminOrderRequest(
  body: unknown,
  adminKey: string | undefined | null,
): Promise<{ status: number; result: AdminOrderResult }> {
  if (!isAuthorizedAdminKey(adminKey)) {
    return { status: 401, result: { ok: false, error: 'Unauthorized' } };
  }

  const payload = (body || {}) as Partial<AdminOrderRequest>;
  const action = payload.action;
  const id = String(payload.id || '').trim();

  if (!id) {
    return { status: 400, result: { ok: false, error: 'Order id is required' } };
  }
  if (action !== 'update' && action !== 'delete') {
    return { status: 400, result: { ok: false, error: 'Invalid action' } };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return {
      status: 500,
      result: { ok: false, error: 'Order admin service is not configured' },
    };
  }

  if (action === 'delete') {
    const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', id);
    if (itemsError) {
      return { status: 500, result: { ok: false, error: itemsError.message } };
    }
    const { error: orderError } = await supabase.from('orders').delete().eq('id', id);
    if (orderError) {
      return { status: 500, result: { ok: false, error: orderError.message } };
    }
    return { status: 200, result: { ok: true } };
  }

  const rawPatch = (payload.patch && typeof payload.patch === 'object' ? payload.patch : {}) as Record<
    string,
    unknown
  >;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [key, value] of Object.entries(rawPatch)) {
    if (UPDATE_FIELDS.has(key)) patch[key] = value;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    return { status: 500, result: { ok: false, error: error.message } };
  }
  if (!data) {
    return { status: 404, result: { ok: false, error: 'Order not found' } };
  }

  return { status: 200, result: { ok: true, order: data as Record<string, unknown> } };
}
