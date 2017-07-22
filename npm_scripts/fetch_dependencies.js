const fs = require('fs');
const path = require('path');

/**
 * @param {string} src
 * @param {string} target
 */
function cp(src, target) {
  const read = fs.createReadStream(src);
  const write = fs.createWriteStream(target);
  
  const onError = (err) => console.error(err);
  
  read.on('error', onError);
  write.on('error', onError);
  
  read.pipe(write);
}

const files = [
  [
    '../node_modules/webextension-polyfill/dist/browser-polyfill.js',
    '../src/back/lib/from_npm/browser-polyfill.js',
  ],
  [
    '../node_modules/i18next/dist/umd/i18next.js',
    '../src/back/lib/from_npm/i18next.js',
  ],
];

files
  .map(([src, target]) => [path.join(__dirname, src), path.join(__dirname, target)])
  .forEach(([src, target]) => cp(src, target));