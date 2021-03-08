//Order pages
function orderPages(pages) {
  //=== Set app pages in last position
  let appPages = pages.app || {}
  delete pages.app
  pages.app = appPages
  return pages
}

//Get configs
function getConfigs() {
  //Import configs
  let app = require('src/config/app').default
  let apiRoutes = require('src/config/apiRoutes').default
  let pages = require('src/config/pages').default
  let sidebar = require('src/config/sidebar').default
  let routes = require('@imagina/qsite/_config/master/application/routes').default
  let stores = require('@imagina/qsite/_config/master/application/stores').default
  let main = require('@imagina/qsite/_config/master/application/main').default

  return {
    app,
    apiRoutes,
    pages: orderPages(pages),
    sidebar,
    routes,
    stores,
    main
  }
}

export default getConfigs
