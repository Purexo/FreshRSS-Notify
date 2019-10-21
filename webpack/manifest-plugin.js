const {promises: fs} = require('fs');
const jiff = require('jiff');
const pkg = require('../package');

module.exports = class ManifestPlugin {
  constructor({from, to, patch}) {
    Object.assign(this, {from, to, patch});
  }
  
  apply(compiler) {
    const name = this.constructor.name;
    
    compiler.hooks.emit.tapPromise(name, async compilation => {
      const [base, patch] = await Promise.all([
        fs.readFile(this.from),
        fs.readFile(this.patch)
      ].map(p => p.then(c => JSON.parse(c.toString()))));
  
      patch.push({
        op: "add",
        path: "/version",
        value: pkg.version,
      });
  
      patch.push({
        op: "add",
        path: "/author",
        value: pkg.author,
      });
  
      patch.push({
        op: "add",
        path: "/homepage_url",
        value: pkg.homepage,
      });
      
      const manifest = JSON.stringify(
        jiff.patchInPlace(patch, base),
        null,
        4
      );
  
      compilation.emitAsset(this.to, {
        source: () => manifest,
        size: () => manifest.length,
      })
    })
  }
};