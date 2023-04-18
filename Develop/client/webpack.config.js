const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// Workbox plugins
module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
      // Bundles HTML files
      // Ensure this is declared before WebpackPwaManifest since inject is true
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'JATE',
      }),

      // Generates manifest.json
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Just Another Text Editor',
        short_name: 'JATE',
        description: 'JATE: Just Another Text Editor. A Progressive Web Application (PWA) with offline capabilities. Powered by IndexedDB.',
        background_color: "#225ca3",
        theme_color: "#225ca3",
        start_url: "/",
        publicPath: "/",
        icons: [
          {
            src: path.resolve('./src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            purpose: 'maskable' // multiple sizes
          },
        ]

      }),

      // Compiles service worker via src-sw.js and injects into it a list of URLs and revision info necessary for precaching
      // base on webpack asset pipeline
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js'
      })

    ],

    // CSS Loaders and babel webpack
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },

        // Babel is a JS transpiler that converts new JS codes into old ones (ES6 => ES5)
        // Transpile: convert one high-level language into another
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/transform-runtime'
              ],
            },
          },
        },
      ],
    },
  };
};
