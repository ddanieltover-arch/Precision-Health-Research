const fs = require('fs');
const path = require('path');

let catalog = fs.readFileSync('./src/data/catalog.ts', 'utf8');

const idToImage = {
  'cerebrolysin': '/heroes/cerebrolysin-uk-hero.jpg',
  'fat-blaster-lc526': '/heroes/fat-blaster-uk-hero.jpg',
  'sustanon-250': '/heroes/sustanon-uk-hero.jpg',
  'bacteriostatic-water': '/heroes/bac-water-uk-hero.jpg',
  'reconstitution-solution': '/heroes/bac-water-uk-hero.jpg',
  'win-depot': '/heroes/sustanon-uk-hero.jpg',
  'trenbolone-enanthate': '/heroes/sustanon-uk-hero.jpg',
  'tren-a': '/heroes/sustanon-uk-hero.jpg',
  'tnt-400': '/heroes/sustanon-uk-hero.jpg',
  'tnt-200': '/heroes/sustanon-uk-hero.jpg',
  'test-undecanoate': '/heroes/sustanon-uk-hero.jpg'
};

for (const [id, url] of Object.entries(idToImage)) {
  const reg = new RegExp("(id:\\s*'" + id + "'[\\s\\S]*?thumbnailUrl:\\s*)'[^']+'");
  catalog = catalog.replace(reg, "$1'" + url + "'");
}

fs.writeFileSync('./src/data/catalog.ts', catalog, 'utf8');
console.log('Updated catalog.ts with the 4 new UK hero images!');

if (fs.existsSync('dist/heroes')) {
  fs.readdirSync('public/heroes').forEach(f => {
    const src = path.join('public/heroes', f);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, path.join('dist/heroes', f));
    }
  });
  console.log('Synchronized all images to dist/heroes');
}
