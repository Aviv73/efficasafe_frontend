const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')

module.exports = {
  pages: {
    cms: {
      entry: 'src/cms/main.js',
      template: 'public/cms.html',
      filename: 'cms.html',
      title: 'Efficasafe - CMS',
    },
    client: {
      entry: 'src/client/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Efficasafe',
    },
  },
  transpileDependencies: ['vuetify'],
  outputDir: '../backend/public',

  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.js$|\.css$|\.html$/,
        threshold: 2048,
        minRatio: 0.8,
      }),
    ],
  },
}
