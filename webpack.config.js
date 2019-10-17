const path = require('path');
const ManifestPlugin = require('./webpack/manifest-plugin');

/**
 * @param {object} env
 * @param {string} env.patch
 *
 * @returns {*[]}
 */
module.exports = [
  // background page config
  env => ({
    entry: {
      './back': './src/back/main.js',
    },
    output: {
      filename: '[name]/main.js',
      path: path.resolve(__dirname, 'extension'),
    },
    plugins: [
      new ManifestPlugin({
        from: path.resolve(__dirname, 'src/manifests/base-manifest.json'),
        to: './manifest.json',
        patch: path.resolve(__dirname, env.patch)
      }),
    ]
  }),
];