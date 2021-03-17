import appConfig from 'src/config/app'
import pagesConfig from 'src/config/pages'

class AutoLoadSidebar {
  constructor() {
    this.sidebar = {}
    this.modules = appConfig.modules
    this.pages = pagesConfig
    this.addDefaultItems()
    //Load iadmin sidebar
    if (appConfig.mode == 'iadmin') this.loadModulesSidebar({name: 'adminSidebar'})
    //Load ipanel sidebar
    if (appConfig.mode == 'ipanel') this.loadModulesSidebar({name: 'panelSidebar'})
  }

  //Add extra fields to sidebar
  addDefaultItems() {
    if (this.pages.app)
      this.sidebar['app'] = this.pages.app.home || {}
  }


  //Load node_modules sidebar
  loadModulesSidebar(params = {}) {
    this.modules.forEach((name) => {
      let sidebarNode = false
      //Search module in node_modules
      try {
        sidebarNode = require(`@imagina/${name}/_config/${params.name}`).default
      } catch (e) {
      }

      //Search module in project
      try {
        sidebarNode = require(`src/modules/${name}/_config/${params.name}`).default
      } catch (e) {
      }

      if (sidebarNode && sidebarNode.length) {
        sidebarNode.forEach((node, index) => {
          this.sidebar[`${name}${index ? (index + 1) : ''}`] = node
        })
      }
    })
  }
}


//Create Class
const autoLoadSidebar = new AutoLoadSidebar()
const customSidebar = autoLoadSidebar.sidebar

//Custom export
export {customSidebar}

//Default export
export default Object.values(autoLoadSidebar.sidebar)
