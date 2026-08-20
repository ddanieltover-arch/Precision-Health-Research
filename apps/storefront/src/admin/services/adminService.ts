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

export async function getDashboardCounts() {
  const client = requireClient();
  const [products, orders, customers, categories, pendingOrders] = await Promise.all([
    client.from('products').select('id', { count: 'exact', head: true }),
    client.from('orders').select('id', { count: 'exact', head: true }),
    client.from('customers').select('id', { count: 'exact', head: true }),
    client.from('categories').select('id', { count: 'exact', head: true }),
    client
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'NEW', 'processing', 'Processing']),
  ]);

  return {
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    customers: customers.count ?? 0,
    categories: categories.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    errors: [products.error, orders.error, customers.error, categories.error, pendingOrders.error]
      .filter(Boolean)
      .map((e) => e!.message),
  };
}

export async function listRecentOrders(limit = 8) {
  const client = requireClient();
  const { data, error } = await client
    .from('orders')
    .select('id, order_number, status, total, contact_email, created_at, payment_status')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as DbOrder[];
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
  const client = requireClient();
  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data || []) as DbOrder[];
}

export async function getOrder(id: string) {
  const client = requireClient();
  const { data, error } = await client.from('orders').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as DbOrder | null;
}

export async function listOrderItems(orderId: string) {
  const client = requireClient();
  const { data, error } = await client
    .from('order_items')
    .select('id, order_id, product_id, variant_id, quantity, unit_price, products(name, slug)')
    .eq('order_id', orderId);
  if (error) throw error;
  return data || [];
}

export async function updateOrder(id: string, patch: Partial<DbOrder>) {
  const adminKey = getAdminWriteKey();
  if (!adminKey) {
    throw new Error('Admin write session expired. Sign out and sign in again.');
  }

  const response = await fetch('/api/admin-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-phr-admin-key': adminKey,
    },
    body: JSON.stringify({ action: 'update', id, patch }),
  });

  let data: { ok?: boolean; order?: DbOrder; error?: string } | null = null;
  try {
    data = (await response.json()) as { ok?: boolean; order?: DbOrder; error?: string };
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok || !data.order) {
    throw new Error(data?.error || `Order update failed (${response.status})`);
  }

  return data.order;
}

export async function deleteOrder(id: string) {
  const adminKey = getAdminWriteKey();
  if (!adminKey) {
    throw new Error('Admin write session expired. Sign out and sign in again.');
  }

  const response = await fetch('/api/admin-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-phr-admin-key': adminKey,
    },
    body: JSON.stringify({ action: 'delete', id }),
  });

  let data: { ok?: boolean; error?: string } | null = null;
  try {
    data = (await response.json()) as { ok?: boolean; error?: string };
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || `Order delete failed (${response.status})`);
  }
}

export async function listCustomers() {
  const client = requireClient();
  const { data, error } = await client
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data || []) as DbCustomer[];
}

export async function getCustomer(id: string) {
  const client = requireClient();
  const { data, error } = await client.from('customers').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as DbCustomer | null;
}

export async function updateCustomer(id: string, patch: Partial<DbCustomer>) {
  const client = requireClient();
  const { data, error } = await client
    .from('customers')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data as DbCustomer;
}
