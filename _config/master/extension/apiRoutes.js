import appConfig from '@imagina/qsite/_config/master/extension/app'

class AutoLoadApiRoutes {
  constructor() {
    this.routes = {}
    this.modules = appConfig.modules
    this.loadModuleApiRoutes()
  }

  //Load Module apiRoutes
  loadModuleApiRoutes() {
    if (appConfig && appConfig.modules) {
      this.modules.forEach(name => {
        let moduleApiRoutes = false

        //Search module in node_modules
        try {
          if (!moduleApiRoutes) moduleApiRoutes = require(`@imagina/${name}/_config/apiRoutes`).default
        } catch (e) {
        }

        //Add api Routes
        this.routes[name] = moduleApiRoutes || {}
      })
    }
  }
}

//Define new class
const apiRoutes = new AutoLoadApiRoutes()

//response
export default apiRoutes.routes
