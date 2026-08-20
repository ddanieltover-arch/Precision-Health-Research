const fs = require('fs');

let catalog = fs.readFileSync('./src/data/catalog.ts', 'utf8');

const idToImage = {
  'mt-2': '/heroes/mt2-uk-hero.jpg',
  'mt-1': '/heroes/mt1-uk-hero.jpg',
  'pt-141': '/heroes/pt141-uk-hero.jpg',
  'epitalon': '/heroes/epitalon-uk-hero.jpg',
  'dsip': '/heroes/dsip-uk-hero.jpg',
  'mots-c': '/heroes/motsc-uk-hero.jpg',
  'ss-31': '/heroes/ss31-uk-hero.jpg',
  'glutathione-1200mg': '/heroes/glutathione-uk-hero.jpg',
  'hgh-fragment-176-191': '/heroes/hgh-frag-uk-hero.jpg',
  'aod-9604': '/heroes/aod9604-uk-hero.jpg',
  'klow-peptide-blend': '/heroes/bpc-tb-uk-hero.jpg',
  'glow-peptide-blend': '/heroes/ghk-cu-uk-hero.jpg',
  'cagrilintide': '/heroes/semaglutide-uk-hero.jpg',
  'sermorelin-acetate': '/heroes/cjc-1295-uk-hero.jpg',
  'thymosin-alpha-1': '/heroes/tb-500-uk-sample.jpg',
  'ahk-cu': '/heroes/ghk-cu-uk-hero.jpg',
  'snap-8': '/heroes/bpc-157-uk-hero.jpg',
  'vip-peptide': '/heroes/bpc-157-uk-hero.jpg',
  'pnc-27': '/heroes/tb-500-uk-sample.jpg',
  'bam15': '/heroes/motsc-uk-hero.jpg',
  'adipotide': '/heroes/semaglutide-uk-hero.jpg',
  'hcg-5000iu': '/heroes/hgh-191aa-uk-hero.jpg',
  'hmg-75iu': '/heroes/hgh-191aa-uk-hero.jpg',
  'mgf-2mg': '/heroes/hgh-191aa-uk-hero.jpg'
};

for (const [id, url] of Object.entries(idToImage)) {
  const reg = new RegExp("(id:\\s*'" + id + "'[\\s\\S]*?thumbnailUrl:\\s*)'[^']+'");
  catalog = catalog.replace(reg, "$1'" + url + "'");
}

fs.writeFileSync('./src/data/catalog.ts', catalog, 'utf8');
console.log('Updated catalog.ts with remaining UK hero images!');
