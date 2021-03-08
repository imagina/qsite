//Get configs
function getConfigs() {
  //Import configs
  let app = require('@imagina/qsite/_config/master/extension/app').default
  let apiRoutes = require('@imagina/qsite/_config/master/extension/apiRoutes').default
  let stores = require('@imagina/qsite/_config/master/extension/stores').default
  let main = require('@imagina/qsite/_config/master/extension/main').default

  return {
    app,
    apiRoutes,
    stores,
    main
  }
}

export default getConfigs
