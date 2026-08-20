import React, { useMemo, useState } from 'react';
import { AdminPageHeader } from '../AdminLayout';
import { COA_DATABASE } from '../../data/coas';

/** COA library CMS — currently sourced from static storefront data; editable locally in-session. */
export const AdminCoasPage: React.FC = () => {
  const initial = useMemo(() => COA_DATABASE.map((c) => ({ ...c })), []);
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  const filtered = rows.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.productName.toLowerCase().includes(q) ||
      c.lotNumber.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="COAs"
        subtitle="Certificates of Analysis library (storefront data/coas.ts)"
        actions={
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search COAs…"
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
          />
        }
      />

      {message && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900">{message}</div>
      )}

      <div className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-bold">Product</th>
                <th className="px-4 py-2 font-bold">Lot</th>
                <th className="px-4 py-2 font-bold">Purity</th>
                <th className="px-4 py-2 font-bold">Tested</th>
                <th className="px-4 py-2 font-bold">Status</th>
                <th className="px-4 py-2 font-bold">Lab</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No COAs match
                  </td>
                </tr>
              )}
              {filtered.map((coa, idx) => (
                <tr key={coa.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">{coa.productName}</td>
                  <td className="px-4 py-2.5">
                    <input
                      value={coa.lotNumber}
                      onChange={(e) => {
                        const next = [...rows];
                        const i = next.findIndex((r) => r.id === coa.id);
                        if (i >= 0) next[i] = { ...next[i], lotNumber: e.target.value };
                        setRows(next);
                      }}
                      className="w-36 rounded-lg border border-slate-200 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      step="0.01"
                      value={coa.purityScore}
                      onChange={(e) => {
                        const next = [...rows];
                        const i = next.findIndex((r) => r.id === coa.id);
                        if (i >= 0) next[i] = { ...next[i], purityScore: Number(e.target.value) };
                        setRows(next);
                      }}
                      className="w-20 rounded-lg border border-slate-200 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{coa.testDate}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={coa.status}
                      onChange={(e) => {
                        const next = [...rows];
                        const i = next.findIndex((r) => r.id === coa.id);
                        if (i >= 0) next[i] = { ...next[i], status: e.target.value as 'Passed' | 'Verified' };
                        setRows(next);
                      }}
                      className="rounded-lg border border-slate-200 px-2 py-1"
                    >
                      <option value="Passed">Passed</option>
                      <option value="Verified">Verified</option>
                    </select>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{coa.labName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              setMessage(
                'COA edits are session-local until a COAs Supabase table is added. Export changes to data/coas.ts for now.'
              )
            }
            className="rounded-xl bg-[var(--brand-primary)] text-white px-3 py-2 text-xs font-bold"
          >
            Mark reviewed
          </button>
        </div>
      </div>
    </div>
  );
};
