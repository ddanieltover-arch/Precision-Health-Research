import React, { useEffect, useState } from 'react';
import { AdminPageHeader } from '../AdminLayout';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'CLOSED' | 'SPAM';
  createdAt: string;
}

const STORAGE_KEY = 'phr_admin_inquiries';

function readInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

function writeInquiries(rows: Inquiry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

/** Inquiries queue — local store until contact form posts to Supabase. */
export const AdminInquiriesPage: React.FC = () => {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const existing = readInquiries();
    if (existing.length === 0) {
      const demo: Inquiry[] = [
        {
          id: crypto.randomUUID(),
          name: 'Lab Coordinator',
          email: 'research@example.ac.uk',
          subject: 'Bulk BPC-157 quote',
          message: 'Please quote 50 × 10mg vials with COAs for Q3 study.',
          status: 'NEW',
          createdAt: new Date().toISOString(),
        },
      ];
      writeInquiries(demo);
      setRows(demo);
      setSeeded(true);
    } else {
      setRows(existing);
    }
  }, []);

  const updateStatus = (id: string, status: Inquiry['status']) => {
    const next = rows.map((r) => (r.id === id ? { ...r, status } : r));
    setRows(next);
    writeInquiries(next);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inquiries"
        subtitle="Contact / compound inquiry queue"
      />

      {seeded && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900">
          Seeded a sample inquiry. Wire the storefront contact form to persist here (or to Supabase) for live intake.
        </div>
      )}

      <div className="rounded-2xl border border-[var(--brand-border)] bg-white overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-bold">From</th>
              <th className="px-4 py-2 font-bold">Subject</th>
              <th className="px-4 py-2 font-bold">Status</th>
              <th className="px-4 py-2 font-bold">Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No inquiries
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{row.name}</div>
                  <div className="text-slate-500">{row.email}</div>
                  <p className="mt-2 text-slate-600 max-w-sm">{row.message}</p>
                </td>
                <td className="px-4 py-3 font-semibold">{row.subject}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.status}
                    onChange={(e) => updateStatus(row.id, e.target.value as Inquiry['status'])}
                    className="rounded-lg border border-slate-200 px-2 py-1"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="SPAM">SPAM</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-500">{new Date(row.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
