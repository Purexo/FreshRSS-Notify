const path = require('path');
const ManifestPlugin = require('./webpack/manifest-plugin');
const {ProvidePlugin} = require('webpack');

const BUILD_FOLDER = path.resolve(__dirname, 'extension');

/**
 * @param {object} env
 * @param {string} env.patch
 */
module.exports = [
  // background page config
  env => ({
    entry: {
      './back': './src/back/main.js',
    },
    output: {
      filename: '[name]/main.js',
      path: BUILD_FOLDER,
    },
    plugins: [
      new ManifestPlugin({
        from: path.resolve(__dirname, 'src/manifests/base-manifest.json'),
        to: './manifest.json',
        patch: path.resolve(__dirname, env.patch)
      }),
    ]
  }),
  // front pages config
  {
    entry: {
      './front/options': './src/front/options/main.js',
      './front/panel': './src/front/panel/main.js',
    },
    output: {
      filename: '[name]/main.js',
      path: BUILD_FOLDER,
    },
    plugins: [
      new ProvidePlugin({
        $: 'jquery',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.html$/,
          use: [
            'html-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
      ],
    },
  },
];