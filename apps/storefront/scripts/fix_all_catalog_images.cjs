const fs = require('fs');

let catalog = fs.readFileSync('./src/data/catalog.ts', 'utf8');

const idToImage = {
  'accutane-20mg': '/heroes/phr-mk-906-hero-1779530784704.jpg',
  'tudca-250mg': '/heroes/phr-andarine-s4-hero-1779531125576.jpg',
  '5-amino-1mq': '/heroes/5-amino-1mq.png',
  'reconstitution-solution': '/heroes/bac-water.png',
  'portable-insulin-cooler': '/heroes/phr-bacteriostatic-water-hero-1779531080681.jpg',
  'insulin-syringes-100pk': '/heroes/bacteriostatic-water-30ml.png'
};

for (const [id, url] of Object.entries(idToImage)) {
  const reg = new RegExp("(id:\\s*'" + id + "'[\\s\\S]*?thumbnailUrl:\\s*)'[^']+'");
  catalog = catalog.replace(reg, "$1'" + url + "'");
}

fs.writeFileSync('./src/data/catalog.ts', catalog, 'utf8');
console.log('Fixed all 60 products mapping!');
