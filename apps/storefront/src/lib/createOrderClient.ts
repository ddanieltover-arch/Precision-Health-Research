export interface CreateOrderLineItem {
  slug?: string;
  productId?: string;
  name: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
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

export interface CreateOrderResponse {
  ok: boolean;
  orderId?: string;
  orderNumber?: string;
  customerId?: string;
  error?: string;
}

export async function createStorefrontOrder(
  payload: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data: CreateOrderResponse | null = null;
  try {
    data = (await response.json()) as CreateOrderResponse;
  } catch {
    data = null;
  }

  if (!response.ok || !data?.ok) {
    return {
      ok: false,
      orderId: data?.orderId,
      orderNumber: data?.orderNumber,
      customerId: data?.customerId,
      error: data?.error || `Order save failed (${response.status})`,
    };
  }

  return data;
}
