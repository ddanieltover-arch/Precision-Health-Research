import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminPageHeader } from '../AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import {
  getProduct,
  listCategories,
  updateProduct,
  type DbCategory,
  type DbProduct,
} from '../services/adminService';

export const AdminProductEditPage: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { canWriteCms } = useAdminAuth();
  const [product, setProduct] = useState<DbProduct | null>(null);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [p, cats] = await Promise.all([getProduct(id), listCategories()]);
        if (!alive) return;
        setProduct(p);
        setCategories(cats);
        if (!p) setError('Product not found');
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Failed to load');
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const setField = <K extends keyof DbProduct>(key: K, value: DbProduct[K]) => {
    setProduct((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !canWriteCms) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateProduct(product.id, {
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_desc: product.short_desc,
        category_id: product.category_id,
        thumbnail_url: product.thumbnail_url,
        base_price: product.base_price,
        compare_price: product.compare_price,
        stock: product.stock,
        is_active: product.is_active,
        is_featured: product.is_featured,
        cas_number: product.cas_number,
        molecular_formula: product.molecular_formula,
        molecular_weight: product.molecular_weight,
        sequence: product.sequence,
      });
      setProduct(updated);
      setMessage('Saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!product && !error) {
    return <div className="text-sm text-slate-500 py-10">Loading product…</div>;
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-red-600">{error}</div>
        <button type="button" onClick={() => navigate('/admin/products')} className="text-xs font-bold text-[var(--brand-primary)]">
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={product.name}
        subtitle="Edit product core fields, pricing, and publish state"
        actions={
          <Link to="/admin/products" className="text-xs font-bold text-slate-500 hover:text-[var(--brand-primary)]">
            ← Products
          </Link>
        }
      />

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

      <form onSubmit={onSave} className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Name</span>
            <input
              disabled={!canWriteCms}
              value={product.name || ''}
              onChange={(e) => setField('name', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Slug</span>
            <input
              disabled={!canWriteCms}
              value={product.slug || ''}
              onChange={(e) => setField('slug', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block md:col-span-2">
            <span className="text-xs font-bold text-slate-700">Short description</span>
            <input
              disabled={!canWriteCms}
              value={product.short_desc || ''}
              onChange={(e) => setField('short_desc', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block md:col-span-2">
            <span className="text-xs font-bold text-slate-700">Description</span>
            <textarea
              disabled={!canWriteCms}
              rows={5}
              value={product.description || ''}
              onChange={(e) => setField('description', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Category</span>
            <select
              disabled={!canWriteCms}
              value={product.category_id || ''}
              onChange={(e) => setField('category_id', e.target.value || null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Thumbnail URL</span>
            <input
              disabled={!canWriteCms}
              value={product.thumbnail_url || ''}
              onChange={(e) => setField('thumbnail_url', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Base price</span>
            <input
              type="number"
              step="0.01"
              disabled={!canWriteCms}
              value={product.base_price ?? 0}
              onChange={(e) => setField('base_price', Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Compare price</span>
            <input
              type="number"
              step="0.01"
              disabled={!canWriteCms}
              value={product.compare_price ?? ''}
              onChange={(e) => setField('compare_price', e.target.value === '' ? null : Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Stock</span>
            <input
              type="number"
              disabled={!canWriteCms}
              value={product.stock ?? 0}
              onChange={(e) => setField('stock', Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">CAS</span>
            <input
              disabled={!canWriteCms}
              value={product.cas_number || ''}
              onChange={(e) => setField('cas_number', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Formula</span>
            <input
              disabled={!canWriteCms}
              value={product.molecular_formula || ''}
              onChange={(e) => setField('molecular_formula', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-slate-700">Molecular weight</span>
            <input
              disabled={!canWriteCms}
              value={product.molecular_weight || ''}
              onChange={(e) => setField('molecular_weight', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="space-y-1.5 block md:col-span-2">
            <span className="text-xs font-bold text-slate-700">Sequence</span>
            <textarea
              disabled={!canWriteCms}
              rows={2}
              value={product.sequence || ''}
              onChange={(e) => setField('sequence', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              disabled={!canWriteCms}
              checked={Boolean(product.is_active)}
              onChange={(e) => setField('is_active', e.target.checked)}
            />
            Active
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              disabled={!canWriteCms}
              checked={Boolean(product.is_featured)}
              onChange={(e) => setField('is_featured', e.target.checked)}
            />
            Featured
          </label>
        </div>

        {canWriteCms && (
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-4 py-2.5 text-xs font-bold disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        )}
      </form>
    </div>
  );
};
