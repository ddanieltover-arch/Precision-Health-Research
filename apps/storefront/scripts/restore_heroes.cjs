const fs = require('fs');
const https = require('https');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HEROES_DIR = path.join(ROOT, 'public', 'heroes');
const ORIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'extracted_ph_products.json'), 'utf8'));
const BASE = 'https://tbgmkqklkshkjfhcqtzz.supabase.co/storage/v1/object/public/catalog-heroes';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error('HTTP ' + res.statusCode));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const magic = buf.slice(0, 3);
          const ok =
            (magic[0] === 0xff && magic[1] === 0xd8) ||
            (magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e) ||
            buf.slice(0, 4).toString() === 'RIFF';
          if (!ok) {
            return reject(new Error('Downloaded file is not a valid image'));
          }
          fs.writeFileSync(dest, buf);
          resolve(buf.length);
        });
      })
      .on('error', reject);
  });
}

async function downloadAll() {
  fs.mkdirSync(HEROES_DIR, { recursive: true });
  let success = 0;
  let failed = 0;

  for (let i = 0; i < ORIG.length; i++) {
    const item = ORIG[i];
    const filename = item.img.split('/').pop();
    const dest = path.join(HEROES_DIR, filename);
    try {
      const size = await downloadFile(item.img, dest);
      success++;
      console.log(`[${i + 1}/${ORIG.length}] OK ${filename} (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      failed++;
      console.error(`[${i + 1}/${ORIG.length}] FAIL ${filename}: ${err.message}`);
    }
  }

  console.log(`Download finished. Success: ${success}, Failed: ${failed}`);
}

function remapCatalog() {
  let catalog = fs.readFileSync(path.join(ROOT, 'src', 'data', 'catalog.ts'), 'utf8');
  const slugToFile = {};
  for (const item of ORIG) {
    slugToFile[item.link.replace('/products/', '')] = item.img.split('/').pop();
  }

  const manual = {
    'bpc-157': 'phr-tb-500-hero-1779562911590.png',
    'tb-500': 'phr-tb-500-hero-1779562911590.png',
    'ghk-cu': 'ahk-cu.png',
    'ahk-cu': 'ahk-cu.png',
    'mt-2': 'mt-2-melanotan-2-acetate.png',
    'mt-1': 'mt-1.png',
    'pt-141': 'pt-141-10mg.png',
    dsip: 'dsip-5mg.png',
    'thymosin-alpha-1': 'thymosin-a1-10mg.png',
    'snap-8': 'snap-8-10mg.png',
    'vip-peptide': 'tb-500-10mg.png',
    'pnc-27': 'tb-500-10mg.png',
    semaglutide: 'semaglutide.png',
    tirzepatide: 'semaglutide.png',
    retatrutide: 'retatrutide.png',
    cagrilintide: 'cagrilintide.png',
    'mots-c': 'ss-31.png',
    epitalon: 'epitalon-50mg.png',
    'ss-31': 'ss-31.png',
    bam15: 'ss-31.png',
    adipotide: 'semaglutide.png',
    'glutathione-1200mg': 'glutathione-1200mg.png',
    'fat-blaster-lc526': 'fat-blaster-lc526.png',
    'bpc-tb-blend': 'phr-bpc-157-tb-500-blend-hero.png',
    'glow-peptide-blend': 'glow-10mg-70mg-10mg.png',
    'klow-peptide-blend': 'klow-10mg-10mg-10mg-50mg.png',
    'sermorelin-acetate': 'sermorelin-acetate.png',
    'cjc-1295-with-dac': 'cjc-1295-with-dac.png',
    'cjc-1295-without-dac': 'cjc-1295-without-dac.png',
    'cjc-1295-ipa': 'cjc-1295-without-dac-ipa-5mg.png',
    cerebrolysin: 'cerebrolysin.png',
    'hgh-191aa': 'hgh-191aa-somatropin.png',
    'hgh-fragment-176-191': 'hgh-fragment-176-191.png',
    'hcg-5000iu': 'hcg.png',
    'hmg-75iu': 'hmg.png',
    'mgf-2mg': 'mgf.png',
    'aod-9604': 'hgh-fragment-176-191.png',
    'bacteriostatic-water': 'bac-water.png',
    'reconstitution-solution': 'bac-water.png',
    'acetic-acid-solution': 'phr-acetic-acid-hero-1779531175424.jpg',
    'portable-insulin-cooler': 'phr-bacteriostatic-water-hero-1779531080681.jpg',
    'insulin-syringes-100pk': 'bacteriostatic-water-30ml.png',
    '5-amino-1mq': '5-amino-1mq.png',
    'yk-11': 'yk11-10mg-50-tablets.png',
    'mk-677': 'phr-mk-677-hero-1779530620912.jpg',
    'rad-140': 'phr-rad140-hero-1779530597763.jpg',
    'accutane-20mg': 'phr-mk-906-hero-1779530784704.jpg',
    'tudca-250mg': 'phr-andarine-s4-hero-1779531125576.jpg',
    'anadrol-50mg': 'anadrol-50mg-50-tablets.png',
    'winstrol-20mg': 'winstrol-20mg-50-tablets.png',
    'turinabol-20mg': 'turinabol-20mg-50-tablets.png',
    'aicar-10mg-tabs': 'aicar-10mg-50-tablets.png',
    'zio-shredz-20mg': 'zio-shredz-20mg-50-tablets.png',
    'win-depot': 'win-depot-50mg.png',
    'sustanon-250': 'phr-sustanon-250mg-hero-1779507582506.png',
    'trenbolone-enanthate': 'trenbolone-enanthate-200mg.png',
    'tren-a': 'tren-a-100mg.jpg',
    'tnt-400': 'phr-t400-hero-1779531725252.jpg',
    'tnt-200': 'tnt-200-200mg.jpg',
    'test-undecanoate': 'testosterone-undecanoate-250mg.jpg',
  };

  const products = [
    ...catalog.matchAll(
      /\{\s*\n\s*id: '([^']+)',[\s\S]*?slug: '([^']+)',[\s\S]*?thumbnailUrl: '([^']+)'/g
    ),
  ];

  let updated = 0;
  for (const [, id, slug] of products) {
    const file = slugToFile[id] || slugToFile[slug] || manual[id];
    if (!file) {
      console.warn('No mapping for', id);
      continue;
    }
    const next = `/heroes/${file}`;
    const reg = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?thumbnailUrl:\\s*)'[^']+'`);
    const before = catalog;
    catalog = catalog.replace(reg, `$1'${next}'`);
    if (catalog !== before) updated++;
  }

  fs.writeFileSync(path.join(ROOT, 'src', 'data', 'catalog.ts'), catalog, 'utf8');
  console.log(`Remapped ${updated} product thumbnailUrls to restored Supabase images.`);
}

(async () => {
  await downloadAll();
  remapCatalog();
})();
