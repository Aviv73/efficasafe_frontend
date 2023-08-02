const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  pages: {
    cms: {
      entry: 'src/cms/main.js',
      template: 'public/cms.html',
      filename: 'cms.html',
      title: 'Efficasafe - CMS'
    },
    client: {
      entry: 'src/client/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Efficasafe'
    }
  },
  "transpileDependencies": [
    "vuetify"
  ],
  outputDir: '../efficasafe_backend/public',

  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }
}