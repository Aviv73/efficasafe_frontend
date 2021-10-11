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
  outputDir: '../backend/public',
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].url = 'https://www.efficasafe.com'
        return args
      })
  }
}