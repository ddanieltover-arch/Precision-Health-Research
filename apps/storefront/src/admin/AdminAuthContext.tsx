import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ADMIN_SESSION_KEY, type AdminRole, supabase } from '../lib/supabase';

export interface AdminUser {
  email: string;
  name: string;
  role: AdminRole;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  canWriteCms: boolean;
  canWriteSales: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function getBootstrapCredentials() {
  const email =
    (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim() ||
    'info@ph-research.store';
  const password = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim() || '';
  return { email, password };
}

function readSession(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

function writeSession(user: AdminUser | null) {
  if (!user) {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    return;
  }
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readSession());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const { email: bootstrapEmail, password: bootstrapPassword } = getBootstrapCredentials();

    // Prefer Supabase Auth when available
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });
      if (!error && data.user) {
        const adminUser: AdminUser = {
          email: data.user.email || normalized,
          name: data.user.user_metadata?.name || 'Admin',
          role: (data.user.app_metadata?.role as AdminRole) || 'ADMIN',
        };
        writeSession(adminUser);
        setUser(adminUser);
        return { ok: true };
      }
      // Fall through to bootstrap credentials if Supabase auth fails
    }

    if (!bootstrapPassword) {
      return {
        ok: false,
        error: 'Admin password not configured. Set VITE_ADMIN_PASSWORD in .env',
      };
    }

    if (normalized === bootstrapEmail.toLowerCase() && password === bootstrapPassword) {
      const adminUser: AdminUser = {
        email: bootstrapEmail,
        name: 'Precision Admin',
        role: 'SUPER_ADMIN',
      };
      writeSession(adminUser);
      setUser(adminUser);
      return { ok: true };
    }

    return { ok: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        /* ignore */
      }
    }
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(() => {
    const role = user?.role;
    const canWriteCms = Boolean(
      role && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role)
    );
    const canWriteSales = Boolean(
      role && ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(role)
    );
    return { user, loading, login, logout, canWriteCms, canWriteSales };
  }, [user, loading, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
