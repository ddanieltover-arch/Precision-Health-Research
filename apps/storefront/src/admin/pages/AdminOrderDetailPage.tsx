import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { getOrder, listOrderItems, updateOrder, type DbOrder } from '../services/adminService';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled', 'refunded'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

export const AdminOrderDetailPage: React.FC = () => {
  const { id = '' } = useParams();
  const { canWriteSales } = useAdminAuth();
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [o, lines] = await Promise.all([getOrder(id), listOrderItems(id)]);
        if (!alive) return;
        setOrder(o);
        setItems(lines);
        if (!o) setError('Order not found');
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to load order');
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !canWriteSales) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateOrder(order.id, {
        status: order.status,
        payment_status: order.payment_status,
        notes: order.notes,
        contact_email: order.contact_email,
        contact_phone: order.contact_phone,
      });
      setOrder(updated);
      setMessage('Order updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!order && !error) return <div className="text-sm text-slate-500 py-10">Loading order…</div>;
  if (!order) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={order.order_number || order.id.slice(0, 8)}
        subtitle="Order detail and fulfillment controls"
        actions={
          <Link to="/admin/orders" className="text-xs font-bold text-slate-500 hover:text-[var(--brand-primary)]">
            ← Orders
          </Link>
        }
      />

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

      <form onSubmit={onSave} className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1.5 block">
          <span className="text-xs font-bold text-slate-700">Status</span>
          <select
            disabled={!canWriteSales}
            value={order.status || 'pending'}
            onChange={(e) => setOrder({ ...order, status: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
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
            disabled={!canWriteSales}
            value={order.payment_status || 'pending'}
            onChange={(e) => setOrder({ ...order, payment_status: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-bold text-slate-700">Contact email</span>
          <input
            disabled={!canWriteSales}
            value={order.contact_email || ''}
            onChange={(e) => setOrder({ ...order, contact_email: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-bold text-slate-700">Contact phone</span>
          <input
            disabled={!canWriteSales}
            value={order.contact_phone || ''}
            onChange={(e) => setOrder({ ...order, contact_phone: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1.5 block md:col-span-2">
          <span className="text-xs font-bold text-slate-700">Notes</span>
          <textarea
            disabled={!canWriteSales}
            rows={3}
            value={order.notes || ''}
            onChange={(e) => setOrder({ ...order, notes: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <div className="md:col-span-2 text-xs text-slate-500 space-y-1">
          <div>Total: <strong className="text-slate-900">{order.total != null ? `£${Number(order.total).toFixed(2)}` : '—'}</strong></div>
          <div>Payment: {order.payment_method || '—'} · Shipping: {order.shipping_method || '—'}</div>
        </div>
        {canWriteSales && (
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 w-fit rounded-xl bg-[var(--brand-primary)] text-white px-4 py-2.5 text-xs font-bold disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save order'}
          </button>
        )}
      </form>

      <section className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">Line items</h2>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-bold">Product</th>
              <th className="px-4 py-2 font-bold">Qty</th>
              <th className="px-4 py-2 font-bold">Unit</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                  No line items
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5">{item.products?.name || item.product_id}</td>
                <td className="px-4 py-2.5">{item.quantity}</td>
                <td className="px-4 py-2.5">£{Number(item.unit_price || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
