import { getAdminWriteKey, supabase } from '../../lib/supabase';

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number | null;
  created_at?: string;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_desc: string | null;
  category_id: string | null;
  thumbnail_url: string | null;
  base_price: number | null;
  compare_price: number | null;
  stock: number | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  cas_number: string | null;
  molecular_formula: string | null;
  molecular_weight: string | null;
  sequence: string | null;
  created_at?: string;
  updated_at?: string;
  categories?: { name: string; slug: string } | null;
}

export interface DbOrder {
  id: string;
  order_number: string | null;
  customer_id: string | null;
  status: string | null;
  total: number | null;
  subtotal: number | null;
  shipping_cost: number | null;
  payment_status: string | null;
  payment_method: string | null;
  shipping_method: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  shipping_address_json: unknown;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbCustomer {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  order_count: number | null;
  total_spent: number | null;
  created_at: string | null;
  updated_at: string | null;
  address_json: unknown;
}

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

function requireAdminKey() {
  const adminKey = getAdminWriteKey();
  if (!adminKey) {
    throw new Error('Admin write session expired. Sign out and sign in again.');
  }
  return adminKey;
}

async function adminOrdersApi<T extends Record<string, unknown>>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/admin-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-phr-admin-key': requireAdminKey(),
    },
    body: JSON.stringify(body),
  });
  let data: (T & { ok?: boolean; error?: string }) | null = null;
  try {
    data = (await response.json()) as T & { ok?: boolean; error?: string };
  } catch {
    data = null;
  }
  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || `Admin orders request failed (${response.status})`);
  }
  return data;
}

async function adminCustomersApi<T extends Record<string, unknown>>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/admin-customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-phr-admin-key': requireAdminKey(),
    },
    body: JSON.stringify(body),
  });
  let data: (T & { ok?: boolean; error?: string }) | null = null;
  try {
    data = (await response.json()) as T & { ok?: boolean; error?: string };
  } catch {
    data = null;
  }
  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || `Admin customers request failed (${response.status})`);
  }
  return data;
}

export async function getDashboardCounts() {
  const client = requireClient();
  const [products, categories, sales] = await Promise.all([
    client.from('products').select('id', { count: 'exact', head: true }),
    client.from('categories').select('id', { count: 'exact', head: true }),
    adminOrdersApi<{
      counts?: { orders: number; customers: number; pendingOrders: number };
    }>({ action: 'dashboard' }),
  ]);

  return {
    products: products.count ?? 0,
    orders: sales.counts?.orders ?? 0,
    customers: sales.counts?.customers ?? 0,
    categories: categories.count ?? 0,
    pendingOrders: sales.counts?.pendingOrders ?? 0,
    errors: [products.error, categories.error].filter(Boolean).map((e) => e!.message),
  };
}

export async function listRecentOrders(limit = 8) {
  const data = await adminOrdersApi<{ orders?: DbOrder[] }>({ action: 'recent', limit });
  return data.orders || [];
}

export async function listProducts() {
  const client = requireClient();
  const { data, error } = await client
    .from('products')
    .select('id, name, slug, base_price, stock, is_active, is_featured, thumbnail_url, category_id, short_desc, updated_at, categories(name, slug)')
    .order('name', { ascending: true })
    .limit(1000);
  if (error) throw error;
  return (data || []) as unknown as DbProduct[];
}

export async function getProduct(id: string) {
  const client = requireClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as DbProduct | null;
}

export async function updateProduct(id: string, patch: Partial<DbProduct>) {
  const client = requireClient();
  const { data, error } = await client
    .from('products')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data as DbProduct;
}

export async function createProduct(payload: Partial<DbProduct>) {
  const client = requireClient();
  const { data, error } = await client.from('products').insert(payload).select('*').maybeSingle();
  if (error) throw error;
  return data as DbProduct;
}

export async function deleteProduct(id: string) {
  const client = requireClient();
  const { error } = await client.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function listCategories() {
  const client = requireClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []) as DbCategory[];
}

export async function updateCategory(id: string, patch: Partial<DbCategory>) {
  const client = requireClient();
  const { data, error } = await client.from('categories').update(patch).eq('id', id).select('*').maybeSingle();
  if (error) throw error;
  return data as DbCategory;
}

export async function createCategory(payload: Partial<DbCategory>) {
  const client = requireClient();
  const { data, error } = await client.from('categories').insert(payload).select('*').maybeSingle();
  if (error) throw error;
  return data as DbCategory;
}

export async function deleteCategory(id: string) {
  const client = requireClient();
  const { error } = await client.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function listOrders() {
  const data = await adminOrdersApi<{ orders?: DbOrder[] }>({ action: 'list', limit: 500 });
  return data.orders || [];
}

export async function getOrder(id: string) {
  const data = await adminOrdersApi<{ order?: DbOrder | null }>({ action: 'get', id });
  return data.order ?? null;
}

export async function listOrderItems(orderId: string) {
  const data = await adminOrdersApi<{ items?: any[] }>({ action: 'items', id: orderId });
  return data.items || [];
}

export async function updateOrder(id: string, patch: Partial<DbOrder>) {
  const data = await adminOrdersApi<{ order?: DbOrder }>({ action: 'update', id, patch });
  if (!data.order) throw new Error('Order update returned no row');
  return data.order;
}

export async function deleteOrder(id: string) {
  await adminOrdersApi({ action: 'delete', id });
}

export async function listCustomers() {
  const data = await adminCustomersApi<{ customers?: DbCustomer[] }>({ action: 'list' });
  return data.customers || [];
}

export async function getCustomer(id: string) {
  const data = await adminCustomersApi<{ customer?: DbCustomer | null }>({ action: 'get', id });
  return data.customer ?? null;
}

export async function updateCustomer(id: string, patch: Partial<DbCustomer>) {
  const data = await adminCustomersApi<{ customer?: DbCustomer }>({ action: 'update', id, patch });
  if (!data.customer) throw new Error('Customer update returned no row');
  return data.customer;
}
