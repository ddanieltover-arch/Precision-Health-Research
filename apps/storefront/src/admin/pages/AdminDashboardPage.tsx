import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { getDashboardCounts, listRecentOrders, type DbOrder } from '../services/adminService';
import { Package, ShoppingCart, Users, Layers, AlertCircle } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    categories: 0,
    pendingOrders: 0,
  });
  const [recent, setRecent] = useState<DbOrder[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [c, orders] = await Promise.all([getDashboardCounts(), listRecentOrders()]);
        if (!alive) return;
        setCounts(c);
        setRecent(orders);
        if (c.errors.length) setError(c.errors.join(' · '));
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cards = [
    { label: 'Products', value: counts.products, to: '/admin/products', icon: Package },
    { label: 'Orders', value: counts.orders, to: '/admin/orders', icon: ShoppingCart },
    { label: 'Pending orders', value: counts.pendingOrders, to: '/admin/orders', icon: AlertCircle },
    { label: 'Customers', value: counts.customers, to: '/admin/customers', icon: Users },
    { label: 'Categories', value: counts.categories, to: '/admin/categories', icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Dashboard" subtitle="Live catalog and order queues" />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-[var(--brand-border)] bg-white p-4 hover:border-[var(--brand-primary)] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className="w-4 h-4 text-[var(--brand-primary)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              {loading ? '—' : card.value}
            </div>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">Recent orders</h2>
          <Link to="/admin/orders" className="text-xs font-bold text-[var(--brand-primary)]">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-bold">Order</th>
                <th className="px-4 py-2 font-bold">Email</th>
                <th className="px-4 py-2 font-bold">Status</th>
                <th className="px-4 py-2 font-bold">Total</th>
                <th className="px-4 py-2 font-bold">Created</th>
              </tr>
            </thead>
            <tbody>
              {!loading && recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No orders yet
                  </td>
                </tr>
              )}
              {recent.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-2.5">
                    <Link to={`/admin/orders/${order.id}`} className="font-bold text-[var(--brand-primary)]">
                      {order.order_number || order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{order.contact_email || '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                      {order.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold">
                    {order.total != null ? `£${Number(order.total).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
