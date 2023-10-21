import serverRoutes from '@imagina/qsite/_config/master/application/serverRoutes'
import localRoutes from '@imagina/qsite/_config/master/application/localRoutes'
import lodash from 'lodash'

export default async ({app, router, store, Vue}) => {
  await Promise.all([
    store.dispatch('qsiteApp/SET_AXIOS_TIMEZONE'),
    //store.dispatch('qsiteApp/GET_PAGES'),
    //store.dispatch('qsiteApp/GET_MENU_SIDEBAR'),
    store.dispatch('qsiteApp/GET_SITE_SETTINGS', {refresh: false}),
    store.dispatch('qsiteApp/GET_MODULE_CONFIGS', {refresh: false}),
    store.dispatch('qsiteApp/GET_SITE_HOOKS', {refresh: false}),
  ])
  //Switch between new page config or old page config
  const legacyStructure = parseInt(store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') || 0)
  //add all route from backend in router method later resolve all promise
  let routesLocal = legacyStructure ? localRoutes.getRoutes() : serverRoutes.getRoutes(lodash.cloneDeep(store.state.qsiteApp.pages || []))
  //Add Routes
  router.addRoutes(routesLocal)
}
