import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isAuthorizedAdminKey } from './ordersAdmin.js';

export type AdminCustomerAction = 'list' | 'get' | 'update';

export interface AdminCustomerRequest {
  action: AdminCustomerAction;
  id?: string;
  patch?: Record<string, unknown>;
}

export interface AdminCustomerResult {
  ok: boolean;
  customer?: Record<string, unknown> | null;
  customers?: Record<string, unknown>[];
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

const UPDATE_FIELDS = new Set(['name', 'email', 'phone', 'default_address', 'address_json']);

export async function handleAdminCustomerRequest(
  body: unknown,
  adminKey: string | undefined | null,
): Promise<{ status: number; result: AdminCustomerResult }> {
  if (!isAuthorizedAdminKey(adminKey)) {
    return { status: 401, result: { ok: false, error: 'Unauthorized' } };
  }

  const payload = (body || {}) as Partial<AdminCustomerRequest>;
  const action = payload.action;
  const id = String(payload.id || '').trim();

  if (action !== 'list' && action !== 'get' && action !== 'update') {
    return { status: 400, result: { ok: false, error: 'Invalid action' } };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return {
      status: 500,
      result: { ok: false, error: 'Customer admin service is not configured' },
    };
  }

  if (action === 'list') {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) return { status: 500, result: { ok: false, error: error.message } };
    return {
      status: 200,
      result: { ok: true, customers: (data || []) as Record<string, unknown>[] },
    };
  }

  if (!id) {
    return { status: 400, result: { ok: false, error: 'Customer id is required' } };
  }

  if (action === 'get') {
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).maybeSingle();
    if (error) return { status: 500, result: { ok: false, error: error.message } };
    if (!data) return { status: 404, result: { ok: false, error: 'Customer not found' } };
    return { status: 200, result: { ok: true, customer: data as Record<string, unknown> } };
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
    .from('customers')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) return { status: 500, result: { ok: false, error: error.message } };
  if (!data) return { status: 404, result: { ok: false, error: 'Customer not found' } };
  return { status: 200, result: { ok: true, customer: data as Record<string, unknown> } };
}
