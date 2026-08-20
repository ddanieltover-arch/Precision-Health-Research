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
  <div className="min-h-screen bg-[#f4f7fb]">
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary-dark)] text-white text-xs font-extrabold tracking-tight shadow-sm"
              aria-label="Admin home"
            >
              PH
            </Link>
            <div className="min-w-0">
              <Link to="/admin" className="block text-[15px] font-extrabold text-slate-900 font-display leading-tight truncate">
                Precision Health
              </Link>
              <p className="text-[11px] font-medium text-slate-500 leading-tight">Operations console</p>
            </div>
          </div>
          <Link
            to="/"
            className="shrink-0 text-xs font-semibold text-slate-500 hover:text-[var(--brand-primary)] transition-colors"
          >
            View storefront
          </Link>
        </div>
        <div className="border-t border-slate-100 pb-0.5 pt-0.5">
          <AdminNav />
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">
      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Supabase env vars missing. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
        </div>
      )}
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
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb] text-sm text-slate-500">
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
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {actions}
  </div>
);
