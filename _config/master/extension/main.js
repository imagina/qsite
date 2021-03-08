import appConfig from '@imagina/qsite/_config/master/extension/app'

class AutoLoadMainConfig {
  constructor() {
    this.mainConfigs = {}
    this.modules = appConfig.modules
    this.loadModuleMainConfig()
  }

  //Load Module main config
  loadModuleMainConfig() {
    if (appConfig && appConfig.modules) {
      this.modules.forEach(name => {
        let moduleMainConfig = false

        //Search module in node_modules
        try {
          if (!moduleMainConfig) moduleMainConfig = require(`@imagina/${name}/_config/main`).default
        } catch (e) {
        }

        //Add api Routes
        this.mainConfigs[name] = moduleMainConfig || {}
      })
    }
  }
}

//Define new class
const mainConfigs = new AutoLoadMainConfig()

//response
export default mainConfigs.mainConfigs
