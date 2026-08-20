import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { getCustomer, updateCustomer, type DbCustomer } from '../services/adminService';

export const AdminCustomerDetailPage: React.FC = () => {
  const { id = '' } = useParams();
  const { canWriteSales } = useAdminAuth();
  const [customer, setCustomer] = useState<DbCustomer | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getCustomer(id);
        if (!alive) return;
        setCustomer(data);
        if (!data) setError('Customer not found');
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to load');
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !canWriteSales) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateCustomer(customer.id, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
      setCustomer(updated);
      setMessage('Customer updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!customer && !error) return <div className="text-sm text-slate-500 py-10">Loading…</div>;
  if (!customer) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={customer.name || customer.email || 'Customer'}
        subtitle="Customer profile"
        actions={
          <Link to="/admin/customers" className="text-xs font-bold text-slate-500 hover:text-[var(--brand-primary)]">
            ← Customers
          </Link>
        }
      />
      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

      <form onSubmit={onSave} className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1.5 block">
          <span className="text-xs font-bold text-slate-700">Name</span>
          <input
            disabled={!canWriteSales}
            value={customer.name || ''}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-bold text-slate-700">Email</span>
          <input
            disabled={!canWriteSales}
            value={customer.email || ''}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-bold text-slate-700">Phone</span>
          <input
            disabled={!canWriteSales}
            value={customer.phone || ''}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <div className="text-xs text-slate-500 self-end pb-2">
          Orders: {customer.order_count ?? 0} · Spent:{' '}
          {customer.total_spent != null ? `£${Number(customer.total_spent).toFixed(2)}` : '£0.00'}
        </div>
        {canWriteSales && (
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 w-fit rounded-xl bg-[var(--brand-primary)] text-white px-4 py-2.5 text-xs font-bold disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save customer'}
          </button>
        )}
      </form>
    </div>
  );
};
