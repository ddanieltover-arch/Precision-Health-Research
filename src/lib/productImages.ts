export const SUPABASE_CATALOG_HERO_BASE = 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes';

export const DEFAULT_PRODUCT_IMAGE = '/images/hero-peptide.avif';

/** Remote CDN fallback keyed by catalog product id */
export const PRODUCT_REMOTE_IMAGES: Record<string, string> = {
  'bpc-157': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/bpc-157-uk-hero.png',
  'tb-500': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/tb-500-uk-hero.png',
  'ghk-cu': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/ghk-cu-uk-hero.png',
  'ahk-cu': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/ahk-cu-uk-hero.png',
  'sermorelin-acetate': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/sermorelin-uk-hero.png',
  'cjc-1295-with-dac': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/cjc-1295-with-dac-uk-hero.png',
  'cjc-1295-without-dac': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/cjc-1295-without-dac-uk-hero.png',
  'cjc-1295-ipa': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/cjc-ipa-uk-hero.png',
  'mt-2': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/mt-2-uk-hero.png',
  'mt-1': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/mt-1-uk-hero.png',
  'pt-141': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/pt-141-uk-hero.png',
  'dsip': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/dsip-uk-hero.png',
  'thymosin-alpha-1': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/thymosin-a1-uk-hero.png',
  'cerebrolysin': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/cerebrolysin-uk-hero.png',
  'snap-8': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/snap-8-uk-hero.png',
  'vip-peptide': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/vip-uk-hero.png',
  'pnc-27': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/pnc-27-uk-hero.png',
  'semaglutide': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/semaglutide-uk-hero.png',
  'tirzepatide': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/tirzepatide-uk-hero.png',
  'retatrutide': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/retatrutide-uk-hero.png',
  'cagrilintide': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/cagrilintide-uk-hero.png',
  'mots-c': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/mots-c-uk-hero.png',
  'epitalon': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/epitalon-uk-hero.png',
  'ss-31': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/ss-31-uk-hero.png',
  'bam15': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/bam15-uk-hero.png',
  'adipotide': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/adipotide-uk-hero.png',
  'glutathione-1200mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/glutathione-uk-hero.png',
  'fat-blaster-lc526': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/fat-blaster-uk-hero.png',
  'bpc-tb-blend': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/bpc-tb-blend-uk-hero.png',
  'glow-peptide-blend': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/glow-blend-uk-hero.png',
  'klow-peptide-blend': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/klow-blend-uk-hero.png',
  'win-depot': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/win-depot-uk-hero.png',
  'sustanon-250': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/sustanon-uk-hero.png',
  'trenbolone-enanthate': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/tren-e-uk-hero.png',
  'tren-a': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/tren-a-uk-hero.png',
  'tnt-400': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/tnt-400-uk-hero.png',
  'tnt-200': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/tnt-200-uk-hero.png',
  'test-undecanoate': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/test-undecanoate-uk-hero.png',
  'accutane-20mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/accutane-uk-hero.png',
  'anadrol-50mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/anadrol-uk-hero.png',
  'winstrol-20mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/winstrol-uk-hero.png',
  'turinabol-20mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/turinabol-uk-hero.png',
  'aicar-10mg-tabs': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/aicar-uk-hero.png',
  'zio-shredz-20mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/zio-shredz-uk-hero.png',
  'tudca-250mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/tudca-uk-hero.png',
  'mk-677': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/mk-677-uk-hero.png',
  'rad-140': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/rad-140-uk-hero.png',
  'yk-11': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/yk-11-uk-hero.png',
  '5-amino-1mq': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/5-amino-1mq-uk-hero.png',
  'hgh-191aa': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/hgh-191aa-uk-hero.png',
  'hgh-fragment-176-191': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/hgh-fragment-uk-hero.png',
  'hcg-5000iu': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/hcg-uk-hero.png',
  'hmg-75iu': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/hmg-uk-hero.png',
  'mgf-2mg': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/mgf-uk-hero.png',
  'aod-9604': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/aod-9604-uk-hero.png',
  'bacteriostatic-water': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/bacteriostatic-water-uk-hero.png',
  'reconstitution-solution': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/bac-water-uk-hero.png',
  'acetic-acid-solution': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/acetic-acid-uk-hero.png',
  'portable-insulin-cooler': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/portable-cooler-uk-hero.png',
  'insulin-syringes-100pk': 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes/insulin-syringes-uk-hero.png',
};

export function getProductImageCandidates(src?: string, productId?: string): string[] {
  const candidates: string[] = [];

  // Always prefer the catalog thumbnail first (UK heroes from /public/heroes).
  if (src) {
    candidates.push(src);
  }

  if (src?.startsWith('/heroes/')) {
    // Same filename on CDN — only helps if that exact UK hero was uploaded remotely.
    const filename = src.slice('/heroes/'.length);
    candidates.push(`${SUPABASE_CATALOG_HERO_BASE}/${filename}`);
  } else if (productId && PRODUCT_REMOTE_IMAGES[productId]) {
    // Legacy remote mapping only when no local /heroes path is configured.
    candidates.push(PRODUCT_REMOTE_IMAGES[productId]);
  }

  candidates.push(DEFAULT_PRODUCT_IMAGE);

  return [...new Set(candidates.filter(Boolean))];
}
