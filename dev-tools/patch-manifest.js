const {promises: fs} = require('fs');
const path = require('path');
const jiff = require('jiff');

const MANIFEST = path.join('./manifest.json');
const BASE = path.join('./manifests/base-manifest.json');
const PATCH = path.join(process.argv[2]);

async function main() {
  const [base, patch] = await Promise.all([
    fs.readFile(BASE),
    fs.readFile(PATCH)
  ].map(p => p.then(c => JSON.parse(c.toString()))));
  
  const manifest = jiff.patchInPlace(patch, base);

  return fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 4));
}

main().catch(console.error);