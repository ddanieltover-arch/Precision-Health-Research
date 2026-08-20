import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface CreateOrderLineItem {
  slug?: string;
  productId?: string;
  name: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  orderNumber?: string;
  email: string;
  phone: string;
  firstName: string;
  lastName?: string;
  address: string;
  city: string;
  county?: string;
  postcode: string;
  country?: string;
  paymentMethod: string;
  shippingMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  notes?: string;
  items: CreateOrderLineItem[];
}

export interface CreateOrderResult {
  ok: boolean;
  orderId?: string;
  orderNumber?: string;
  customerId?: string;
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

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '').trim();
}

function makeOrderNumber(): string {
  return `PHR-UK-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function handleCreateOrderRequest(
  body: unknown,
): Promise<{ status: number; result: CreateOrderResult }> {
  const payload = (body || {}) as Partial<CreateOrderPayload>;

  const email = String(payload.email || '')
    .trim()
    .toLowerCase();
  const phone = normalizePhone(String(payload.phone || ''));
  const firstName = String(payload.firstName || '').trim();
  const lastName = String(payload.lastName || '').trim();
  const address = String(payload.address || '').trim();
  const city = String(payload.city || '').trim();
  const county = String(payload.county || '').trim();
  const postcode = String(payload.postcode || '')
    .trim()
    .toUpperCase();
  const country = String(payload.country || 'United Kingdom').trim();
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!isValidEmail(email)) {
    return { status: 400, result: { ok: false, error: 'Valid email is required' } };
  }
  if (!firstName || !address || !city || !postcode) {
    return { status: 400, result: { ok: false, error: 'Shipping details are incomplete' } };
  }
  if (items.length === 0) {
    return { status: 400, result: { ok: false, error: 'Order has no line items' } };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return {
      status: 500,
      result: { ok: false, error: 'Order service is not configured (missing Supabase credentials)' },
    };
  }

  const slugs = [
    ...new Set(
      items
        .flatMap((item) => [item.slug, item.productId])
        .map((value) => String(value || '').trim())
        .filter(Boolean),
    ),
  ];

  const slugToId = new Map<string, string>();
  if (slugs.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, slug')
      .in('slug', slugs);
    if (productsError) {
      return { status: 500, result: { ok: false, error: productsError.message } };
    }
    for (const row of products || []) {
      slugToId.set(row.slug as string, row.id as string);
    }
  }

  // Fallback: match by product name when slug is missing (email-only payloads).
  for (const item of items) {
    const key = String(item.slug || item.productId || '').trim();
    if (key && slugToId.has(key)) continue;
    const name = String(item.name || '').trim();
    if (!name) continue;
    const { data: byName } = await supabase
      .from('products')
      .select('id, slug')
      .ilike('name', `${name.split('(')[0].trim()}%`)
      .limit(1)
      .maybeSingle();
    if (byName?.id) {
      const mapKey = key || (byName.slug as string) || name;
      slugToId.set(mapKey, byName.id as string);
      if (key) slugToId.set(key, byName.id as string);
      item.slug = item.slug || (byName.slug as string);
    }
  }

  const unresolved = items.filter((item) => {
    const key = String(item.slug || item.productId || '').trim();
    return !key || !slugToId.has(key);
  });
  if (unresolved.length > 0) {
    const names = unresolved.map((item) => item.name || item.slug || item.productId).join(', ');
    return {
      status: 400,
      result: { ok: false, error: `Could not match catalog products in database: ${names}` },
    };
  }

  const orderNumber = String(payload.orderNumber || makeOrderNumber()).trim() || makeOrderNumber();

  const { data: existing } = await supabase
    .from('orders')
    .select('id, order_number, customer_id')
    .eq('order_number', orderNumber)
    .maybeSingle();
  if (existing) {
    return {
      status: 200,
      result: {
        ok: true,
        orderId: existing.id as string,
        orderNumber: (existing.order_number as string) || orderNumber,
        customerId: (existing.customer_id as string) || undefined,
      },
    };
  }

  const shippingAddress = {
    firstName,
    lastName,
    address,
    city,
    county: county || undefined,
    postcode,
    country,
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      status: 'pending',
      payment_status: 'pending',
      payment_method: String(payload.paymentMethod || 'bank_transfer'),
      shipping_method: String(payload.shippingMethod || ''),
      contact_email: email,
      contact_phone: phone || null,
      subtotal: Number(payload.subtotal) || 0,
      shipping_cost: Number(payload.shippingCost) || 0,
      total: Number(payload.total) || 0,
      notes: payload.notes ? String(payload.notes) : null,
      shipping_address_json: shippingAddress,
    })
    .select('id, order_number, customer_id')
    .single();

  if (orderError || !order) {
    return {
      status: 500,
      result: { ok: false, error: orderError?.message || 'Failed to create order' },
    };
  }

  const lineRows = items.map((item) => {
    const key = String(item.slug || item.productId || '').trim();
    return {
      order_id: order.id,
      product_id: slugToId.get(key)!,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      unit_price: Number(item.unitPrice) || 0,
    };
  });

  const { error: itemsError } = await supabase.from('order_items').insert(lineRows);
  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id);
    return { status: 500, result: { ok: false, error: itemsError.message } };
  }

  if (order.customer_id) {
    const fullName = `${firstName} ${lastName}`.trim();
    await supabase
      .from('customers')
      .update({
        name: fullName || null,
        phone,
        default_address: shippingAddress,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.customer_id);
  }

  return {
    status: 200,
    result: {
      ok: true,
      orderId: order.id as string,
      orderNumber: (order.order_number as string) || orderNumber,
      customerId: (order.customer_id as string) || undefined,
    },
  };
}
