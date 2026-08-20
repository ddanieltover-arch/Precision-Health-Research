import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { listCustomers, type DbCustomer } from '../services/adminService';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await listCustomers();
        if (alive) setCustomers(data);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to load customers');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Customers" subtitle="Researcher accounts and order history totals" />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

      <div className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-bold">Name</th>
                <th className="px-4 py-2 font-bold">Email</th>
                <th className="px-4 py-2 font-bold">Phone</th>
                <th className="px-4 py-2 font-bold">Orders</th>
                <th className="px-4 py-2 font-bold">Spent</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No customers yet
                  </td>
                </tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-2.5">
                    <Link to={`/admin/customers/${c.id}`} className="font-bold text-[var(--brand-primary)]">
                      {c.name || 'Unnamed'}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{c.email || '—'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{c.phone || '—'}</td>
                  <td className="px-4 py-2.5">{c.order_count ?? 0}</td>
                  <td className="px-4 py-2.5 font-semibold">
                    {c.total_spent != null ? `£${Number(c.total_spent).toFixed(2)}` : '£0.00'}
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
