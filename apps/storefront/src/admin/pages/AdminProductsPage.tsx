import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { createProduct, deleteProduct, listProducts, type DbProduct } from '../services/adminService';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const AdminProductsPage: React.FC = () => {
  const { canWriteCms } = useAdminAuth();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setProducts(await listProducts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWriteCms || !newName.trim()) return;
    setCreating(true);
    try {
      const created = await createProduct({
        name: newName.trim(),
        slug: slugify(newName),
        base_price: 0,
        stock: 0,
        is_active: false,
        is_featured: false,
        description: '',
        short_desc: '',
      });
      setNewName('');
      window.location.href = `/admin/products/${created.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string, name: string) => {
    if (!canWriteCms) return;
    if (!window.confirm(`Delete product “${name}”?`)) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        subtitle="Catalog CMS — create, edit, publish research compounds"
        actions={
          canWriteCms ? (
            <form onSubmit={onCreate} className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New product name"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[var(--brand-primary)]"
              />
              <button
                type="submit"
                disabled={creating || !newName.trim()}
                className="rounded-xl bg-[var(--brand-primary)] text-white px-3 py-2 text-xs font-bold disabled:opacity-50"
              >
                {creating ? 'Creating…' : 'Create'}
              </button>
            </form>
          ) : null
        }
      />

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

      <div className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-bold">Product</th>
                <th className="px-4 py-2 font-bold">Category</th>
                <th className="px-4 py-2 font-bold">Price</th>
                <th className="px-4 py-2 font-bold">Stock</th>
                <th className="px-4 py-2 font-bold">Status</th>
                <th className="px-4 py-2 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No products found
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-2.5">
                    <Link to={`/admin/products/${p.id}`} className="font-bold text-slate-900 hover:text-[var(--brand-primary)]">
                      {p.name}
                    </Link>
                    <div className="text-[10px] text-slate-400">{p.slug}</div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{p.categories?.name || '—'}</td>
                  <td className="px-4 py-2.5 font-semibold">
                    {p.base_price != null ? `£${Number(p.base_price).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-2.5">{p.stock ?? '—'}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right space-x-2">
                    <Link to={`/admin/products/${p.id}`} className="font-bold text-[var(--brand-primary)]">
                      Edit
                    </Link>
                    {canWriteCms && (
                      <button
                        type="button"
                        onClick={() => onDelete(p.id, p.name)}
                        className="font-bold text-red-600"
                      >
                        Delete
                      </button>
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
