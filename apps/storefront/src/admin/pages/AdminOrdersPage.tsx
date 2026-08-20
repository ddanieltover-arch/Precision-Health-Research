import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { listOrders, updateOrder, deleteOrder, type DbOrder } from '../services/adminService';
import { sendNotification } from '../../lib/notifyClient';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled', 'refunded'];

export const AdminOrdersPage: React.FC = () => {
  const { canWriteSales } = useAdminAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await listOrders());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onQuickStatus = async (order: DbOrder, status: string) => {
    if (!canWriteSales) return;
    setSavingId(order.id);
    setError('');
    try {
      const updated = await updateOrder(order.id, { status });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, ...updated } : o)));
      if (updated.contact_email) {
        const notify = await sendNotification({
          type: 'order_status',
          email: updated.contact_email,
          orderId: updated.order_number || updated.id,
          orderStatus: updated.status || status,
          paymentStatus: updated.payment_status || undefined,
          paymentMethod: updated.payment_method || undefined,
          shippingMethod: updated.shipping_method || undefined,
          phone: updated.contact_phone || undefined,
          total: updated.total ?? undefined,
          currency: 'GBP',
        });
        if (!notify.ok) {
          setError(`Status saved, but email failed: ${notify.error || 'unknown error'}`);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Status update failed');
      await load();
    } finally {
      setSavingId(null);
    }
  };

  const onDelete = async (order: DbOrder) => {
    if (!canWriteSales) return;
    const label = order.order_number || order.id.slice(0, 8);
    const confirmed = window.confirm(`Delete order ${label}? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(order.id);
    setError('');
    try {
      await deleteOrder(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Orders" subtitle="Edit full details, change status inline, or delete orders" />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

      <div className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-bold">Order</th>
                <th className="px-4 py-2 font-bold">Customer</th>
                <th className="px-4 py-2 font-bold">Status</th>
                <th className="px-4 py-2 font-bold">Payment</th>
                <th className="px-4 py-2 font-bold">Total</th>
                <th className="px-4 py-2 font-bold">Created</th>
                <th className="px-4 py-2 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No orders yet
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-2.5">
                    <Link to={`/admin/orders/${order.id}`} className="font-bold text-[var(--brand-primary)]">
                      {order.order_number || order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{order.contact_email || '—'}</td>
                  <td className="px-4 py-2.5">
                    {canWriteSales ? (
                      <select
                        value={order.status || 'pending'}
                        disabled={savingId === order.id || deletingId === order.id}
                        onChange={(e) => onQuickStatus(order, e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1 bg-white"
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
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold">{order.status || '—'}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{order.payment_status || '—'}</td>
                  <td className="px-4 py-2.5 font-semibold">
                    {order.total != null ? `£${Number(order.total).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <Link to={`/admin/orders/${order.id}`} className="font-bold text-[var(--brand-primary)]">
                      Edit
                    </Link>
                    {canWriteSales && (
                      <>
                        <span className="text-slate-300 mx-2">|</span>
                        <button
                          type="button"
                          disabled={deletingId === order.id}
                          onClick={() => onDelete(order)}
                          className="font-bold text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingId === order.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
