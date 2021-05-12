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
  outputDir: '../backend/public'
}