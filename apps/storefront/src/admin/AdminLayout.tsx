import React, { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { AdminNav } from './AdminNav';
import { isSupabaseConfigured } from '../lib/supabase';

function useAdminNoIndex() {
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !robots;
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    const previous = robots.getAttribute('content');
    robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (created) robots?.remove();
      else if (previous) robots?.setAttribute('content', previous);
    };
  }, []);
}

const AdminChrome: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <header className="border-b border-[var(--brand-border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">Admin</p>
          <Link to="/admin" className="text-lg font-extrabold text-slate-900 font-display">
            Precision Health CMS
          </Link>
        </div>
        <Link to="/" className="text-xs font-bold text-slate-500 hover:text-[var(--brand-primary)]">
          ← Storefront
        </Link>
      </div>
    </header>

    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">
      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Supabase env vars missing. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
        </div>
      )}
      <AdminNav />
      <Outlet />
    </div>
  </div>
);

const AdminGate: React.FC = () => {
  useAdminNoIndex();
  const { user, loading } = useAdminAuth();
  const location = useLocation();
  const isLogin = location.pathname === '/admin/login';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading admin…
      </div>
    );
  }

  if (!user && !isLogin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (user && isLogin) {
    return <Navigate to="/admin" replace />;
  }

  if (isLogin) {
    return <Outlet />;
  }

  return <AdminChrome />;
};

export const AdminApp: React.FC = () => (
  <AdminAuthProvider>
    <AdminGate />
  </AdminAuthProvider>
);

export const AdminPageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  title,
  subtitle,
  actions,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-[var(--brand-border)]">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)] mb-1">Admin</p>
      <h1 className="text-2xl font-extrabold text-slate-900 font-display">{title}</h1>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {actions}
  </div>
);
