const fs = require('fs');
const https = require('https');
const path = require('path');

const orig = JSON.parse(fs.readFileSync('extracted_ph_products.json', 'utf8'));

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP status ' + res.statusCode));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        resolve({ size: buf.length, magic: buf.slice(0, 4) });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading all ' + orig.length + ' catalog hero images from Supabase storage...');
  let success = 0;
  let failed = 0;

  for (let i = 0; i < orig.length; i++) {
    const item = orig[i];
    const url = item.img;
    const filename = url.split('/').pop();
    const dest = path.join('./public/heroes', filename);
    try {
      const res = await downloadFile(url, dest);
      success++;
      console.log('[' + (i + 1) + '/' + orig.length + '] Downloaded ' + filename + ' (' + (res.size / 1024).toFixed(1) + ' KB)');
    } catch (err) {
      failed++;
      console.error('[' + (i + 1) + '/' + orig.length + '] Failed ' + filename + ': ' + err.message);
    }
  }

  console.log('Finished downloading. Success: ' + success + ', Failed: ' + failed);
}

run();
