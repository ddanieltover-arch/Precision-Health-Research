const fs = require('fs');
const path = require('path');

const catalog = fs.readFileSync(path.join(__dirname, '../src/data/catalog.ts'), 'utf8');
const extracted = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../extracted_ph_products.json'), 'utf8')
);

const BASE = 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes';
const slugToUrl = {};
for (const item of extracted) {
  slugToUrl[item.link.replace('/products/', '')] = item.img;
}

const manual = {
  'bpc-157': slugToUrl['tb-500-10mg'],
  'ghk-cu': slugToUrl['ahk-cu'],
  'mt-2': slugToUrl['mt-2-melanotan-2-acetate'],
  'pt-141': slugToUrl['pt-141-10mg'],
  dsip: slugToUrl['dsip-5mg'],
  'thymosin-alpha-1': slugToUrl['thymosin-a1-10mg'],
  'snap-8': slugToUrl['snap-8-10mg'],
  'vip-peptide': slugToUrl['tb-500-10mg'],
  'pnc-27': slugToUrl['tb-500-10mg'],
  tirzepatide: slugToUrl['semaglutide'],
  'mots-c': slugToUrl['ss-31'],
  epitalon: slugToUrl['epitalon-50mg'],
  bam15: slugToUrl['ss-31'],
  adipotide: slugToUrl['semaglutide'],
  'bpc-tb-blend': slugToUrl['tb-500-10mg'],
  'glow-peptide-blend':
    slugToUrl['glow-10mg-70mg-10mg'] || `${BASE}/glow-10mg-70mg-10mg.png`,
  'klow-peptide-blend': slugToUrl['klow-10mg-10mg-10mg-50mg'],
  'tnt-400': `${BASE}/phr-t400-hero-1779531725252.jpg`,
  'tnt-200': `${BASE}/tnt-200-200mg.jpg`,
  'hcg-5000iu': slugToUrl.hcg,
  'hmg-75iu': slugToUrl.hmg,
  'mgf-2mg': slugToUrl.mgf,
  'aod-9604': slugToUrl['hgh-fragment-176-191'],
  'reconstitution-solution': slugToUrl['bac-water'],
};

const products = [
  ...catalog.matchAll(/\{\s*\n\s*id: '([^']+)',[\s\S]*?slug: '([^']+)',[\s\S]*?thumbnailUrl: '([^']+)'/g),
];

const map = {};
for (const [, id, slug, thumb] of products) {
  const filename = thumb.replace('/heroes/', '');
  map[id] = slugToUrl[id] || slugToUrl[slug] || manual[id] || `${BASE}/${filename}`;
}

const entries = Object.entries(map)
  .map(([id, url]) => `  '${id}': '${url}',`)
  .join('\n');

const content = `export const SUPABASE_CATALOG_HERO_BASE = '${BASE}';

export const DEFAULT_PRODUCT_IMAGE = '/images/hero-peptide.avif';

/** Remote CDN fallback keyed by catalog product id */
export const PRODUCT_REMOTE_IMAGES: Record<string, string> = {
${entries}
};

export function getProductImageCandidates(src?: string, productId?: string): string[] {
  const candidates: string[] = [];

  // Always prefer the catalog thumbnail first (UK heroes from /public/heroes).
  if (src) {
    candidates.push(src);
  }

  // Same filename on CDN — useful only when that exact file was uploaded.
  if (src?.startsWith('/heroes/')) {
    const filename = src.slice('/heroes/'.length);
    candidates.push(\`\${SUPABASE_CATALOG_HERO_BASE}/\${filename}\`);
  } else if (productId && PRODUCT_REMOTE_IMAGES[productId]) {
    // Legacy remote mapping only when no local /heroes path is configured.
    candidates.push(PRODUCT_REMOTE_IMAGES[productId]);
  } else if (!src && productId && PRODUCT_REMOTE_IMAGES[productId]) {
    candidates.push(PRODUCT_REMOTE_IMAGES[productId]);
  }

  candidates.push(DEFAULT_PRODUCT_IMAGE);

  return [...new Set(candidates.filter(Boolean))];
}
`;

const outPath = path.join(__dirname, '../src/lib/productImages.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log(`Wrote ${outPath} with ${Object.keys(map).length} product image fallbacks.`);
