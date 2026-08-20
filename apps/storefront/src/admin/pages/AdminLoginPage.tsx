import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';
import { ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError('');
    const result = await login(email, password);
    setPending(false);
    if (!result.ok) {
      setError(result.error || 'Login failed');
      return;
    }
    navigate(from.startsWith('/admin') ? from : '/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--brand-border)] bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[var(--brand-tint)] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[var(--brand-primary)]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">Staff sign in</h1>
          <p className="text-xs text-slate-500">Precision Health Research CMS</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-700">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-700">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-sm py-2.5 disabled:opacity-60"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};
