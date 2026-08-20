/**
 * Sync local catalog.ts -> Supabase (categories, products, variants, images).
 * Usage: node scripts/sync_catalog_to_supabase.cjs
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const envRaw = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
const SERVICE_KEY = (envRaw.match(/SUPABASE_SERVICE_ROLE_KEY="([^"]+)"/) || [])[1];
const SUPABASE_URL = (envRaw.match(/SUPABASE_URL="([^"]+)"/) || [])[1];
const HERO_BASE = `${SUPABASE_URL}/storage/v1/object/public/catalog-heroes`;

if (!SERVICE_KEY || !SUPABASE_URL) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

function loadCatalog() {
  const exporter = `
import { PRODUCTS, CATEGORIES } from '../src/data/catalog.ts';
const payload = {
  categories: CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.desc || null,
  })),
  products: PRODUCTS.map((p) => ({
    name: p.name,
    slug: p.slug,
    category: p.category,
    categorySlug: p.categorySlug,
    shortDesc: p.shortDesc,
    description: p.description,
    basePrice: p.basePrice,
    comparePrice: p.comparePrice ?? null,
    stock: p.stock,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    casNumber: p.casNumber ?? null,
    molecularFormula: p.molecularFormula ?? null,
    molecularWeight: p.molecularWeight ?? null,
    sequence: p.sequence ?? null,
    thumbnailUrl: p.thumbnailUrl?.startsWith('/heroes/')
      ? '${HERO_BASE}/' + p.thumbnailUrl.replace('/heroes/', '')
      : p.thumbnailUrl,
    variants: p.variants.map((v) => ({
      name: v.name,
      value: v.value,
      priceModifier: v.priceModifier,
      stock: v.stock,
      sku: v.sku,
    })),
  })),
};
process.stdout.write(JSON.stringify(payload));
`;
  const tmp = path.join(ROOT, 'scripts', '_catalog_export.tmp.mts');
  fs.writeFileSync(tmp, exporter, 'utf8');
  const result = spawnSync('npx', ['--yes', 'tsx', tmp], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    shell: true,
  });
  fs.unlinkSync(tmp);
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error('Failed to export catalog via tsx');
  }
  return JSON.parse(result.stdout.trim().split('\n').filter(Boolean).pop());
}

function request(method, apiPath, body, extraHeaders = {}) {
  const payload = body == null ? null : JSON.stringify(body);
  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    Accept: 'application/json',
    ...extraHeaders,
  };
  if (payload) {
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(payload);
  }

  return new Promise((resolve, reject) => {
    const u = new URL(apiPath, SUPABASE_URL);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let data = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch {
            data = text;
          }
          if (res.statusCode >= 400) {
            reject(new Error(`${method} ${apiPath} -> ${res.statusCode}: ${text}`));
          } else {
            resolve({ status: res.statusCode, data });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function ensureCategories(cats) {
  const map = {};
  const existing = (await request('GET', '/rest/v1/categories?select=id,slug,name&limit=500')).data;
  for (const c of existing) map[c.slug] = c;

  let sort = 200;
  for (const cat of cats) {
    if (map[cat.slug]) continue;
    const created = (
      await request(
        'POST',
        '/rest/v1/categories',
        {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          sort_order: sort++,
        },
        { Prefer: 'return=representation' }
      )
    ).data[0];
    map[cat.slug] = created;
    console.log('Created category', cat.slug);
  }
  return map;
}

async function upsertProduct(product, categoryId) {
  const row = {
    name: product.name,
    slug: product.slug,
    description: product.description || null,
    short_desc: product.shortDesc || null,
    category_id: categoryId || null,
    thumbnail_url: product.thumbnailUrl,
    base_price: product.basePrice,
    compare_price: product.comparePrice,
    stock: product.stock,
    is_active: product.isActive,
    is_featured: product.isFeatured,
    molecular_formula: product.molecularFormula,
    molecular_weight: product.molecularWeight,
    cas_number: product.casNumber,
    sequence: product.sequence,
    updated_at: new Date().toISOString(),
  };

  return (
    await request('POST', '/rest/v1/products?on_conflict=slug', row, {
      Prefer: 'resolution=merge-duplicates,return=representation',
    })
  ).data[0];
}

async function syncVariants(productId, variants) {
  const existing = (
    await request('GET', `/rest/v1/variants?product_id=eq.${productId}&select=id,sku,name,value`)
  ).data;

  const bySku = Object.fromEntries(existing.filter((v) => v.sku).map((v) => [v.sku, v]));
  let updated = 0;
  let created = 0;

  for (const v of variants) {
    const row = {
      product_id: productId,
      name: v.name,
      value: v.value,
      price_modifier: v.priceModifier,
      stock: v.stock,
      sku: v.sku,
    };

    if (v.sku && bySku[v.sku]) {
      await request('PATCH', `/rest/v1/variants?id=eq.${bySku[v.sku].id}`, row, {
        Prefer: 'return=minimal',
      });
      updated++;
    } else {
      // Try insert; if sku unique conflict, patch by sku
      try {
        await request('POST', '/rest/v1/variants', row, { Prefer: 'return=minimal' });
        created++;
      } catch (err) {
        if (String(err.message).includes('23505') && v.sku) {
          await request('PATCH', `/rest/v1/variants?sku=eq.${encodeURIComponent(v.sku)}`, row, {
            Prefer: 'return=minimal',
          });
          updated++;
        } else {
          throw err;
        }
      }
    }
  }

  return { updated, created };
}

async function syncPrimaryImage(productId, url, alt) {
  if (!url) return;
  const existing = (
    await request('GET', `/rest/v1/images?product_id=eq.${productId}&select=id&order=sort_order&limit=1`)
  ).data;

  if (existing?.[0]?.id) {
    await request(
      'PATCH',
      `/rest/v1/images?id=eq.${existing[0].id}`,
      { url, alt_text: alt, sort_order: 0 },
      { Prefer: 'return=minimal' }
    );
  } else {
    await request(
      'POST',
      '/rest/v1/images',
      { product_id: productId, url, alt_text: alt, sort_order: 0 },
      { Prefer: 'return=minimal' }
    );
  }
}

async function main() {
  const { categories, products } = loadCatalog();
  console.log(`Loaded ${categories.length} categories, ${products.length} products`);

  const categoryMap = await ensureCategories(categories);
  let ok = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const cat = categoryMap[product.categorySlug];
      const row = await upsertProduct(product, cat?.id || null);
      const v = await syncVariants(row.id, product.variants);
      await syncPrimaryImage(row.id, product.thumbnailUrl, product.name);
      ok++;
      console.log(
        `OK ${product.slug} variants +${v.created}/~${v.updated} image=${product.thumbnailUrl?.split('/').pop()}`
      );
    } catch (err) {
      failed++;
      console.error(`FAIL ${product.slug}: ${err.message}`);
    }
  }

  console.log(`\nSync complete. Success: ${ok}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
