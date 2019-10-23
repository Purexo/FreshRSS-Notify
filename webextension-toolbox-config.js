const webpack = require('webpack');
const WebextensionPlugin = require('webpack-webextension-plugin');
const pkg = require('./package.json');
const jiff = require('jiff');
const path = require('path');

function getFilePatch(path = process.env.PATCH) {
  return `./src/patchs-manifests/${path}.patch.json`;
}

module.exports = {
  webpack: (config, options) => {
    const {dev, vendor} = options;
    
    /* --- manifest specific --- */
    const patch = require(getFilePatch());
    const {manifestDefaults} = config.plugins.find(p => p instanceof WebextensionPlugin);
    
    const fromPkg = {
      author: pkg.author,
      homepage_url: pkg.homepage,
    };
    
    Object.assign(manifestDefaults, fromPkg);
    jiff.patchInPlace(patch, manifestDefaults);
    
    /* --- bootstrap --- */
    config.module.rules.push(
      {
        test: /\.(scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer'),
                ];
              }
            }
          },
          'sass-loader'
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: '/',
          }
        }],
      }
    );
    
    /* --- overide entry points --- */
    const getEntries = config.entry;
    config.entry = () => Object.assign(getEntries(), {
      'front/options/options': path.resolve(config.context, 'front/options/options.js'),
      'front/panel/panel': path.resolve(config.context, 'front/panel/panel.js'),
    });
    
    return config;
  }
};