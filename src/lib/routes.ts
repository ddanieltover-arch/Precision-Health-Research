import type { ActiveView } from '../types';

/** Canonical URL path for each app view (except product detail, which needs a slug). */
export const VIEW_PATHS: Record<Exclude<ActiveView, 'product-detail'>, string> = {
  home: '/',
  catalog: '/catalog',
  calculator: '/calculator',
  coa: '/coa',
  research: '/research',
  guide: '/guide',
  'peptide-guide': '/guide',
  about: '/about',
  faq: '/faq',
  shipping: '/shipping',
  contact: '/contact',
  track: '/track',
  compare: '/compare',
  terms: '/terms',
  privacy: '/privacy',
  refunds: '/refunds',
  quality: '/quality',
};

const PATH_TO_VIEW: Record<string, ActiveView> = {
  '/': 'home',
  '/catalog': 'catalog',
  '/calculator': 'calculator',
  '/coa': 'coa',
  '/research': 'research',
  '/guide': 'guide',
  '/peptide-guide': 'guide',
  '/about': 'about',
  '/faq': 'faq',
  '/shipping': 'shipping',
  '/contact': 'contact',
  '/track': 'track',
  '/compare': 'compare',
  '/terms': 'terms',
  '/privacy': 'privacy',
  '/refunds': 'refunds',
  '/quality': 'quality',
};

export function pathForView(view: ActiveView, productSlug?: string | null): string {
  if (view === 'product-detail') {
    return productSlug ? `/product/${productSlug}` : '/catalog';
  }
  return VIEW_PATHS[view] ?? '/';
}

export function viewFromPath(pathname: string): ActiveView {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized.startsWith('/product/')) return 'product-detail';
  return PATH_TO_VIEW[normalized] ?? 'home';
}

export function productSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/product\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}
