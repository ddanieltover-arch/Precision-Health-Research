const fs = require('fs');

let catalog = fs.readFileSync('./src/data/catalog.ts', 'utf8');

const idToImage = {
  'bpc-157': '/heroes/bpc-157-uk-hero.jpg',
  'tb-500': '/heroes/tb-500-uk-sample.jpg',
  'semaglutide': '/heroes/semaglutide-uk-hero.jpg',
  'tirzepatide': '/heroes/tirzepatide-uk-hero.jpg',
  'retatrutide': '/heroes/retatrutide-uk-hero.jpg',
  'cjc-1295-without-dac': '/heroes/cjc-1295-uk-hero.jpg',
  'cjc-1295-with-dac': '/heroes/cjc-1295-uk-hero.jpg',
  'cjc-1295-ipa': '/heroes/cjc-1295-ipa-uk-hero.jpg',
  'ghk-cu': '/heroes/ghk-cu-uk-hero.jpg',
  'bpc-tb-blend': '/heroes/bpc-tb-uk-hero.jpg',
  'hgh-191aa': '/heroes/hgh-191aa-uk-hero.jpg'
};

for (const [id, url] of Object.entries(idToImage)) {
  const reg = new RegExp("(id:\\s*'" + id + "'[\\s\\S]*?thumbnailUrl:\\s*)'[^']+'");
  catalog = catalog.replace(reg, "$1'" + url + "'");
}

fs.writeFileSync('./src/data/catalog.ts', catalog, 'utf8');
console.log('Updated catalog.ts with UK hero images!');
