import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { deleteOrder, getOrder, listOrderItems, updateOrder, type DbOrder } from '../services/adminService';
import { sendNotification } from '../../lib/notifyClient';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled', 'refunded'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];
const PAYMENT_METHODS = ['bank_transfer', 'crypto', 'card', 'other'];
const SHIPPING_METHODS = [
  'royal_mail_24',
  'royal_mail_special',
  'dpd_uk',
  'dpd_saturday',
  'tracked24',
  'specialDelivery',
  'standard',
  'pickup',
];

type AddressForm = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
};

function parseAddress(raw: unknown): AddressForm {
  const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    firstName: String(obj.firstName ?? obj.first_name ?? ''),
    lastName: String(obj.lastName ?? obj.last_name ?? ''),
    address: String(obj.address ?? obj.line1 ?? ''),
    city: String(obj.city ?? ''),
    county: String(obj.county ?? obj.state ?? ''),
    postcode: String(obj.postcode ?? obj.zip ?? ''),
    country: String(obj.country ?? 'United Kingdom'),
  };
}

export const AdminOrderDetailPage: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { canWriteSales } = useAdminAuth();
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [address, setAddress] = useState<AddressForm>(parseAddress(null));
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const baselineRef = useRef<{ status: string | null; payment: string | null }>({ status: null, payment: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [o, lines] = await Promise.all([getOrder(id), listOrderItems(id)]);
        if (!alive) return;
        setOrder(o);
        setAddress(parseAddress(o?.shipping_address_json));
        setItems(lines);
        baselineRef.current = {
          status: o?.status ?? null,
          payment: o?.payment_status ?? null,
        };
        if (!o) setError('Order not found');
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to load order');
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const lineTotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0), 0),
    [items]
  );

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !canWriteSales) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const statusChanged =
        order.status !== baselineRef.current.status ||
        order.payment_status !== baselineRef.current.payment;

      const updated = await updateOrder(order.id, {
        order_number: order.order_number,
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        shipping_method: order.shipping_method,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        total: order.total,
        notes: order.notes,
        contact_email: order.contact_email,
        contact_phone: order.contact_phone,
        shipping_address_json: address,
      });
      setOrder(updated);
      setAddress(parseAddress(updated.shipping_address_json));

      if (statusChanged && updated.contact_email) {
        const notify = await sendNotification({
          type: 'order_status',
          email: updated.contact_email,
          name: [address.firstName, address.lastName].filter(Boolean).join(' ') || undefined,
          phone: updated.contact_phone || undefined,
          orderId: updated.order_number || updated.id,
          orderStatus: updated.status || 'updated',
          paymentStatus: updated.payment_status || undefined,
          paymentMethod: updated.payment_method || undefined,
          shippingMethod: updated.shipping_method || undefined,
          shippingAddress: [
            [address.firstName, address.lastName].filter(Boolean).join(' '),
            address.address,
            address.city,
            address.county,
            address.postcode,
            address.country,
          ]
            .filter(Boolean)
            .join('\n') || undefined,
          message: updated.notes || undefined,
          notes: updated.notes || undefined,
          subtotal: updated.subtotal ?? undefined,
          shippingCost: updated.shipping_cost ?? undefined,
          total: updated.total ?? undefined,
          currency: 'GBP',
        });
        if (notify.ok) {
          setMessage('Order saved · status emails sent to customer and admin');
        } else {
          setMessage(`Order saved · email warning: ${notify.error || 'notification failed'}`);
        }
      } else {
        setMessage(statusChanged ? 'Order saved (no contact email for status notify)' : 'Order saved');
      }

      baselineRef.current = {
        status: updated.status ?? null,
        payment: updated.payment_status ?? null,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!order || !canWriteSales) return;
    const label = order.order_number || order.id.slice(0, 8);
    const confirmed = window.confirm(`Delete order ${label}? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    setMessage('');
    setError('');
    try {
      await deleteOrder(order.id);
      navigate('/admin/orders', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
    }
  };

  if (!order && !error) return <div className="text-sm text-slate-500 py-10">Loading order…</div>;
  if (!order) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  const disabled = !canWriteSales;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={order.order_number || order.id.slice(0, 8)}
        subtitle="Edit fulfillment, payment, totals, and shipping address"
        actions={
          <div className="flex items-center gap-3">
            <Link to="/admin/orders" className="text-xs font-bold text-slate-500 hover:text-[var(--brand-primary)]">
              ← Orders
            </Link>
            {canWriteSales && (
              <button
                type="button"
                disabled={deleting || saving}
                onClick={() => void onDelete()}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete order'}
              </button>
            )}
          </div>
        }
      />

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}
      {!canWriteSales && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Your role is read-only for sales. Sign in as ADMIN / SUPER_ADMIN / SALES_MANAGER to edit.
        </div>
      )}

      <form onSubmit={onSave} className="space-y-6">
        <section className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="md:col-span-2 text-sm font-extrabold text-slate-900">Order details</h2>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Order number</span>
            <input
              disabled={disabled}
              value={order.order_number || ''}
              onChange={(e) => setOrder({ ...order, order_number: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Fulfillment status</span>
            <select
              disabled={disabled}
              value={order.status || 'pending'}
              onChange={(e) => setOrder({ ...order, status: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            >
              {!ORDER_STATUSES.includes(order.status || '') && order.status && (
                <option value={order.status}>{order.status}</option>
              )}
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Payment status</span>
            <select
              disabled={disabled}
              value={order.payment_status || 'pending'}
              onChange={(e) => setOrder({ ...order, payment_status: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            >
              {!PAYMENT_STATUSES.includes(order.payment_status || '') && order.payment_status && (
                <option value={order.payment_status}>{order.payment_status}</option>
              )}
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Payment method</span>
            <select
              disabled={disabled}
              value={order.payment_method || ''}
              onChange={(e) => setOrder({ ...order, payment_method: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            >
              <option value="">—</option>
              {!PAYMENT_METHODS.includes(order.payment_method || '') && order.payment_method && (
                <option value={order.payment_method}>{order.payment_method}</option>
              )}
              {PAYMENT_METHODS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Shipping method</span>
            <select
              disabled={disabled}
              value={order.shipping_method || ''}
              onChange={(e) => setOrder({ ...order, shipping_method: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            >
              <option value="">—</option>
              {!SHIPPING_METHODS.includes(order.shipping_method || '') && order.shipping_method && (
                <option value={order.shipping_method}>{order.shipping_method}</option>
              )}
              {SHIPPING_METHODS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Contact email</span>
            <input
              disabled={disabled}
              type="email"
              value={order.contact_email || ''}
              onChange={(e) => setOrder({ ...order, contact_email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Contact phone</span>
            <input
              disabled={disabled}
              value={order.contact_phone || ''}
              onChange={(e) => setOrder({ ...order, contact_phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Subtotal (£)</span>
            <input
              disabled={disabled}
              type="number"
              step="0.01"
              value={order.subtotal ?? ''}
              onChange={(e) =>
                setOrder({ ...order, subtotal: e.target.value === '' ? null : Number(e.target.value) })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Shipping cost (£)</span>
            <input
              disabled={disabled}
              type="number"
              step="0.01"
              value={order.shipping_cost ?? ''}
              onChange={(e) =>
                setOrder({ ...order, shipping_cost: e.target.value === '' ? null : Number(e.target.value) })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>

          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Total (£)</span>
            <input
              disabled={disabled}
              type="number"
              step="0.01"
              value={order.total ?? ''}
              onChange={(e) =>
                setOrder({ ...order, total: e.target.value === '' ? null : Number(e.target.value) })
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>

          <label className="space-y-1.5 block md:col-span-2">
            <span className="text-xs font-bold text-slate-700">Internal notes</span>
            <textarea
              disabled={disabled}
              rows={3}
              value={order.notes || ''}
              onChange={(e) => setOrder({ ...order, notes: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="md:col-span-2 text-sm font-extrabold text-slate-900">Shipping address</h2>
          {(
            [
              ['firstName', 'First name'],
              ['lastName', 'Last name'],
              ['address', 'Address'],
              ['city', 'City'],
              ['county', 'County'],
              ['postcode', 'Postcode'],
              ['country', 'Country'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="space-y-1.5 block">
              <span className="text-xs font-bold text-slate-700">{label}</span>
              <input
                disabled={disabled}
                value={address[key]}
                onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
              />
            </label>
          ))}
        </section>

        {canWriteSales && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-5 py-2.5 text-xs font-bold disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save order changes'}
            </button>
            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => void onDelete()}
              className="rounded-xl border border-red-200 bg-white text-red-700 px-5 py-2.5 text-xs font-bold hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? 'Deleting…' : 'Delete order'}
            </button>
          </div>
        )}
      </form>

      <section className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">Line items</h2>
          <span className="text-xs text-slate-500">
            Lines total: <strong className="text-slate-800">£{lineTotal.toFixed(2)}</strong>
          </span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-bold">Product</th>
              <th className="px-4 py-2 font-bold">Qty</th>
              <th className="px-4 py-2 font-bold">Unit</th>
              <th className="px-4 py-2 font-bold">Line</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No line items
                </td>
              </tr>
            )}
            {items.map((item) => {
              const qty = Number(item.quantity || 0);
              const unit = Number(item.unit_price || 0);
              return (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5">{item.products?.name || item.product_id}</td>
                  <td className="px-4 py-2.5">{qty}</td>
                  <td className="px-4 py-2.5">£{unit.toFixed(2)}</td>
                  <td className="px-4 py-2.5 font-semibold">£{(qty * unit).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
