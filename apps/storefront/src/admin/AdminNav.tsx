import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/coas', label: 'COAs' },
  { to: '/admin/inquiries', label: 'Inquiries' },
] as const;

export const AdminNav: React.FC<{ current?: string }> = () => {
  const { user, logout } = useAdminAuth();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap gap-2">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={'end' in link ? link.end : false}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'bg-white text-slate-600 border border-[var(--brand-border)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="hidden sm:inline">{user?.email}</span>
        <span className="px-2 py-0.5 rounded bg-[var(--brand-tint)] text-[var(--brand-primary)] font-bold">
          {user?.role}
        </span>
        <button
          type="button"
          onClick={() => logout()}
          className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
