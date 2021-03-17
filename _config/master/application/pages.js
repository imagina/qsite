import appConfig from 'src/config/app'

class AutoLoadPages {
  constructor() {
    this.pages = {}
    this.modules = appConfig.modules
    this.updatePages = []
    //Load main pages
    this.loadPages({prefix: 'main', name: 'mainPages'})
    //Load iadmin pages
    if (appConfig.mode == 'iadmin') this.loadPages({name: 'adminPages'})
    //Load ipanel pages
    if (appConfig.mode == 'ipanel') this.loadPages({name: 'panelPages'})
    //Add default pages
    this.addDefaultPages()
    //Update pages
    this.loadUpdatePages()
  }

  //Add default pages
  addDefaultPages() {
    //Add page home when it's backend
    if (['iadmin', 'ipanel'].indexOf(appConfig.mode) != -1) {
      if (!this.pages.app) this.pages.app = {}
      this.pages.app.home = {//Page home
        permission: null,
        activated: true,
        path: '/',
        name: 'app.home',
        layout: () => import('@imagina/qsite/_layouts/master.vue'),
        page: (appConfig.mode == 'iadmin') ? () => import('@imagina/qsite/_pages/admin/index.vue') :
          () => import('@imagina/qsite/_pages/panel/index.vue'),
        title: 'sidebar.pageHome',
        icon: 'fas fa-home',
        authenticated: (appConfig.mode == 'iadmin') ? true : false,
        subHeader: {
          refresh: true
        }
      }
    }
  }

  //Load modules backend page
  loadPages(params = {}) {
    this.modules.forEach(moduleName => {
      let configPage = false
      let namePage = `${params.prefix || ''}${moduleName}`

      //Search module in node_modules
      try {
        configPage = require(`@imagina/${moduleName}/_config/${params.name}`)
      } catch (e) {
      }

      //Search module in project (src)
      try {
        configPage = require(`src/modules/${moduleName}/_config/${params.name}`)
      } catch (e) {
      }

      if (configPage) this.pages[namePage] = configPage.default//Add pages
      if (configPage.updatePages) this.updatePages.push(configPage.updatePages)//Add method to updated pages
    })
  }

  //Load changes in pages
  loadUpdatePages() {
    this.updatePages.forEach(updatedPages => {
      this.pages = updatedPages(this.pages)
    })
  }
}

//Create new class
const autoLoadPages = new AutoLoadPages()

//Response
export default autoLoadPages.pages
