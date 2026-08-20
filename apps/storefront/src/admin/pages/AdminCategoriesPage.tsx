import React, { useEffect, useState } from 'react';
import { AdminPageHeader } from '../AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type DbCategory,
} from '../services/adminService';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const AdminCategoriesPage: React.FC = () => {
  const { canWriteCms } = useAdminAuth();
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await listCategories());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
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
    try {
      await createCategory({
        name: newName.trim(),
        slug: slugify(newName),
        description: null,
        sort_order: categories.length,
      });
      setNewName('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  };

  const onSaveRow = async (cat: DbCategory) => {
    if (!canWriteCms) return;
    try {
      await updateCategory(cat.id, {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sort_order: cat.sort_order,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const onDelete = async (cat: DbCategory) => {
    if (!canWriteCms) return;
    if (!window.confirm(`Delete category “${cat.name}”?`)) return;
    try {
      await deleteCategory(cat.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        subtitle="Classifications used by the storefront catalog filters"
        actions={
          canWriteCms ? (
            <form onSubmit={onCreate} className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New category"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
              <button type="submit" className="rounded-xl bg-[var(--brand-primary)] text-white px-3 py-2 text-xs font-bold">
                Add
              </button>
            </form>
          ) : null
        }
      />

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}

      <div className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-bold">Name</th>
              <th className="px-4 py-2 font-bold">Slug</th>
              <th className="px-4 py-2 font-bold">Sort</th>
              <th className="px-4 py-2 font-bold"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No categories
                </td>
              </tr>
            )}
            {categories.map((cat, idx) => (
              <tr key={cat.id} className="border-t border-slate-100">
                <td className="px-4 py-2">
                  <input
                    disabled={!canWriteCms}
                    value={cat.name}
                    onChange={(e) => {
                      const next = [...categories];
                      next[idx] = { ...cat, name: e.target.value };
                      setCategories(next);
                    }}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    disabled={!canWriteCms}
                    value={cat.slug}
                    onChange={(e) => {
                      const next = [...categories];
                      next[idx] = { ...cat, slug: e.target.value };
                      setCategories(next);
                    }}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    disabled={!canWriteCms}
                    value={cat.sort_order ?? 0}
                    onChange={(e) => {
                      const next = [...categories];
                      next[idx] = { ...cat, sort_order: Number(e.target.value) };
                      setCategories(next);
                    }}
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1.5"
                  />
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  {canWriteCms && (
                    <>
                      <button type="button" onClick={() => onSaveRow(cat)} className="font-bold text-[var(--brand-primary)]">
                        Save
                      </button>
                      <button type="button" onClick={() => onDelete(cat)} className="font-bold text-red-600">
                        Delete
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
  );
};
