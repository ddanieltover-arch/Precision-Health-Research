export type NotifyType =
  | 'contact'
  | 'newsletter'
  | 'quick_inquiry'
  | 'order_confirmation'
  | 'order_status';

export interface OrderLineItem {
  name: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface NotifyPayload {
  type: NotifyType;
  /** End-user email — always required so both sides can be notified */
  email: string;
  name?: string;
  subject?: string;
  message?: string;
  phone?: string;
  institution?: string;
  /** Contact / quick inquiry reference */
  ticketId?: string;
  /** Order fields */
  orderId?: string;
  orderStatus?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingMethod?: string;
  shippingAddress?: string;
  items?: OrderLineItem[];
  subtotal?: number;
  shippingCost?: number;
  discount?: number;
  total?: number;
  currency?: string;
  notes?: string;
}

export interface NotifyResult {
  ok: boolean;
  ticketId?: string;
  orderId?: string;
  error?: string;
  emailsSent?: number;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}
