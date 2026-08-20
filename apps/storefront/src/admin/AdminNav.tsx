import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/inquiries', label: 'Inquiries' },
] as const;

export const AdminNav: React.FC = () => {
  const { user, logout } = useAdminAuth();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <nav className="flex items-center gap-0.5 overflow-x-auto -mx-1 px-1 scrollbar-none" aria-label="Admin">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={'end' in link ? link.end : false}
            className={({ isActive }) =>
              [
                'relative shrink-0 px-3 py-2 text-[13px] font-semibold tracking-tight transition-colors',
                isActive
                  ? 'text-[var(--brand-primary-dark)]'
                  : 'text-slate-500 hover:text-slate-800',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {link.label}
                <span
                  className={[
                    'absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full transition-opacity',
                    isActive ? 'bg-[var(--brand-primary)] opacity-100' : 'opacity-0',
                  ].join(' ')}
                  aria-hidden
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <div className="min-w-0 text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">{user?.email}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{user?.role}</p>
        </div>
        <span className="sm:hidden px-2 py-0.5 rounded-md bg-[var(--brand-tint)] text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
          {user?.role}
        </span>
        <button
          type="button"
          onClick={() => logout()}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
