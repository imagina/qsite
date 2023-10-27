//Plugins
import config from '@imagina/qsite/_config/master/index'
import cache from '@imagina/qsite/_plugins/cache'
import crud from "@imagina/qcrud/_services/baseService";
import cloneDeep from 'lodash.clonedeep'
import {colors, AddressbarColor} from 'quasar'
import Quasar from 'quasar'
import axios from "axios";
import {Loading} from 'quasar';
import filter from '@imagina/qsite/_plugins/filter'
import helper from '@imagina/qsite/_plugins/helper'
import configApp from "src/config/app"
import moment from "moment";
import momentz from "moment-timezone";

//Refresh page
export const REFRESH_PAGE = ({state, commit, dispatch, getters}) => {
  return new Promise(async (resolve, reject) => {
    let currentRoute = state.currentRoute
    Loading.show()
    commit('LOAD_PAGE', false)
    await cache.restore(config('app.saveCache.refresh'))//Reset cache
    //await dispatch('RESET_STORE')//Reset Vuex
    await dispatch('quserAuth/AUTH_UPDATE', null, {root: true}).catch(error => {
    })//Update user data
    await dispatch('qsiteApp/GET_SITE_SETTINGS', null, {root: true}).catch(error => {
    })//update settings sites
    dispatch('qsiteApp/SET_SITE_COLORS', null, {root: true})//Load colors
    commit('LOAD_PAGE', true)
    Loading.hide()
    resolve(true)
  })
}

// get ip addresss
export const GET_IP_ADDRESS = ({commit}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const data = await res.json()
      commit('SET_IP_ADDRESS', data.ip)
      resolve(true)
    } catch (err) {
      console.error('[store-qsite]Error:: Store getting site settings - disable adbloks')
      reject(err)
    }
  })
}

//Get site settings
export const GET_SITE_SETTINGS = ({commit, dispatch, state, getters}, params = {}) => {
  return new Promise((resolve, reject) => {
    params = {centralizedBrand: true, setToSite: true, refresh: true, ...params}
    let requestParams = {refresh: params.refresh, cacheKey: 'qsite.settings'}
    let configName = 'apiRoutes.qsite.siteSettings'
    let configApp = config('app')

    //Request main settings
    crud.index(configName, requestParams).then(async response => {
      let data = response.data
      //Get centralized brand
      if (params.centralizedBrand) data.siteSettings = await dispatch("GET_CENTRALIZED_BRAND", data.siteSettings)
      //Set the settings
      if (params.setToSite) {
        commit('SET_SITE_SETTINGS', data.siteSettings)
        commit('SET_AVAILABLE_LOCALES', data.availableLocales)
        commit('SET_AVAILABLE_THEMES', data.availableThemes)
        commit('SET_DEFAULT_LOCALE', data.defaultLocale)
        commit('SET_MODULES_DATA', data.modulesEnabled)
        commit('SET_SELECTED_LOCALES')
        //Set logo
        let logo = getters.getSettingMediaByName('isite::logoIadmin')
        if (!logo || !logo.path || logo.path.includes('defaultLogo')) logo = getters.getSettingMediaByName('isite::logo1')
        commit('SET_SITE_LOGO', logo.path)
      }
      //Set filters
      filter.setFilters(data.filters)
      //Set setting if is admin
      axios.defaults.params.setting.fromAdmin = (configApp.mode == 'iadmin' ? true : false)
      axios.defaults.params.setting.appMode = configApp.mode
      //Resolve the promise
      resolve(data)
    }).catch(error => {
      console.error('[store-qsite]Error:: Store getting site settings - ', error)
      reject(error)
    })
  })
}

//Request the centralized brand settings
export const GET_CENTRALIZED_BRAND = ({state}, siteSettings) => {
  return new Promise(resolve => {
    //Search the centralized brand setting
    const centralizedBrand = siteSettings.find(item => item.name === 'isite::centralizedBrand');
    //Validate if exist the setting
    if (!centralizedBrand || !centralizedBrand.value) return resolve(siteSettings)
    //Request the centralized brand
    axios.get(`${centralizedBrand.value}/api/isite/v1/site/settings`).then(response => {
      //Get brand settings values
      const brandSettingNames = ["isite::logoIadmin", "isite::logo1", "core::site-name"];
      const centralizedBrandSettings = response.data.data.siteSettings.filter(item =>
        item.name.includes('brand') || brandSettingNames.includes(item.name)
      );
      //Replace the settings
      centralizedBrandSettings.forEach(newSetting => {
        const indexToReplace = siteSettings.findIndex(item => item.name == newSetting.name)
        if (indexToReplace >= 0) siteSettings[indexToReplace] = newSetting
      })
      //Return the new siteSettings
      resolve(siteSettings)
    }).catch(error => {
      resolve(siteSettings)
    })
  })
}

//Get the pages from backend
export const GET_PAGES = ({commit}) => {
  return new Promise(async resolve => {
    //Request params
    let requestParams = {refresh: true}
    //Request data
    await crud.index('apiRoutes.qpage.pagesCms', requestParams).then(({data}) => {
      commit('SET_PAGES', data)
      resolve(data)
    }).catch(error => {
      console.error("[store-qsite]::GetPage", error)
      resolve(false)
    })
  })
}

//Get the menu from backend
export const GET_MENU_SIDEBAR = ({commit}) => {
  return new Promise(async resolve => {
    //Instance criteria
    const criteria = (config('app.mode') == 'iadmin') ? 'cms_admin' : 'cms_panel'
    //Instance params
    const params = {
      refresh: true,
      params: {
        filter: {field: 'name'},
        include: 'menuitems'
      }
    }
    //Request
    await crud.show('apiRoutes.qmenu.menus', criteria, params).then(({data}) => {
      commit('SET_MENU', data.menuitems)
      resolve(data)
    }).catch(error => {
      console.error("[store-qsite]::GetMenu", error)
      resolve(true)
    })
  })
}

//Set site settins
export const SET_SITE_COLORS = ({state, commit, dispatch}) => {
  let settings = state.settings
  let dataColors = {}

  for (let i in settings) {
    //Get setting name
    let settingName = settings[i].name.split('::')[1]
    //Set colors
    if (settingName.indexOf('brand') != -1) {
      let nameBrand = settingName.replace('brand', '').toLowerCase() //Get brand name
      let color = settings[i].path ? settings[i].path : settings[i].plainValue//Get color
      //Validate if exist color
      if (color) {
        if (nameBrand.indexOf('addressbar') != -1) AddressbarColor.set(color)//Set bar color
        else colors.setBrand(nameBrand, color)//Set color
      }
    }
  }
}

//Set locale
export const SET_LOCALE = ({commit, dispatch, state}, params = {}) => {
  return new Promise(async resolve => {
    params = {locale: false, vue: false, ssrContext: false, ...params}
    let locale = params.locale
    let currentLocale = locale
    let Vue = params.vue

    //find locale in storage, store or first from selected locales
    if (!locale) {
      locale = await cache.get.item('site.default.locale')
      if (!locale) locale = state.defaultLocale
      if (!locale && state.selectedLocales.length) locale = state.selectedLocales[0]
      currentLocale = locale
    }

    if(!state.selectedLocales.includes(locale)){
      locale = state.defaultLocale
    }
    //Set in storage
    await cache.set('site.default.locale', locale)

    //Set in store
    commit('SET_DEFAULT_LOCALE', locale)
    commit('SET_SELECTED_LOCALES')

    //Set in axios how default params
    axios.defaults.params.setting.locale = locale

    //Set default language to Quasar
    locale = (locale == 'en') ? 'en-us' : locale.toLowerCase()
    import(`quasar/lang/${locale}`).then(lang => {
      if (params.ssrContext) Quasar.lang.set(lang.default, params.ssrContext)
      else Quasar.lang.set(lang.default)
    })

    //Set default language to i18n
    //import(`@imagina/qsite/_i18n/master/index`).then(({default: messages}) => {
    dispatch('qtranslationMaster/GET_TRANSLATIONS', {refresh: false}, {root: true}).then(({default: messages}) => {
      try {
        Vue.i18n.locale = locale
        Vue.i18n.setLocaleMessage(locale, messages[locale])
      } catch (e) {

      }

      try {
        Vue.$i18n.locale = locale
        Vue.$i18n.setLocaleMessage(locale, messages[locale])
      } catch (e) {

      }
    })

    //Change language in URL
    if (Vue.$route) {
      //Add language to route name
      let nextRoute = cloneDeep(Vue.$route)

      //Change route locale
      if (helper.getLocaleRouteName(nextRoute.name)) {
        let routeNameSegments = cloneDeep(nextRoute.name.split('.'))
        routeNameSegments[0] = locale
        nextRoute.name = routeNameSegments.join('.')
      } else {//Add locale
        nextRoute = {...nextRoute, name: `${locale}.${nextRoute.name}`}
      }

      //Redirect
      if (nextRoute.name != Vue.$route.name) Vue.$router.push(nextRoute)
    }

    resolve(true)
  })
}

//Reset values form Store
export const RESET_STORE = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    let stores = config('app.resetStores') || []
    stores.forEach(name => commit(name, null, {root: true}))
    resolve(true)
  })
}

//Set extra
export const SET_EXTRA = ({state, commit, dispatch}, params = false) => {
  return new Promise(async (resolve, reject) => {
    let extraData = params ? {...state.extra, ...params} : await cache.get.item('app.state.extra')

    //Save extra
    await cache.set('app.state.extra', extraData)
    commit('SET_EXTRA', extraData)
    resolve(true)
  })
}

//Get module configs
export const GET_MODULE_CONFIGS = ({commit, dispatch, state}, params = {}) => {
  return new Promise((resolve, reject) => {
    params = {refresh: true, ...params}
    //Request params
    let requestParams = {
      refresh: params.refresh,
      cacheKey: 'qsite.module.configs',
      params: {filter: {configNameByModule: 'config'}}
    }
    //Request
    crud.index('apiRoutes.qsite.configs', requestParams).then(async response => {
      commit('SET_MODULE_CONFIGS', response.data)
      resolve(true)
    }).catch(error => {
      console.error('[store-qsite]Error:: Store getting site hooks - ', error)
      reject(error)
    })
  })
}

//Get site hooks
export const GET_SITE_HOOKS = ({commit, dispatch, state}, params = {}) => {
  return new Promise((resolve, reject) => {
    params = {refresh: true, ...params}
    //Request params
    let requestParams = {
      refresh: params.refresh,
      cacheKey: 'qsite.site.hooks',
      params: {filter: {configNameByModule: 'config.frontendHooks'}}
    }
    //Request
    crud.index('apiRoutes.qsite.configs', requestParams).then(async response => {
      commit('SET_SITE_HOOKS', response.data)
      resolve(true)
    }).catch(error => {
      console.error('[store-qsite]Error:: Store getting site hooks - ', error)
      reject(error)
    })
  })
}

//Get site hooks
export const LOAD_CLARITY = ({commit, dispatch, state}) => {
  return new Promise((resolve, reject) => {
    //Request params
    let requestParams = {
      refresh: true,
      params: {filter: {configName: 'isite.config.msClarityScript'}}
    }
    //Request
    crud.index('apiRoutes.qsite.configs', requestParams).then(async response => {
      if (response.data) helper.appendScriptStringHead(response.data)
      resolve(true)
    }).catch(error => {
      console.error('[store-qsite]Error:: Store getting site hooks - ', error)
      reject(error)
    })
  })
}

//Set the navigator timezone into the azios settings payload
export const SET_AXIOS_TIMEZONE = ({commit, dispatch, state}) => {
  return new Promise((resolve, reject) => {
    try {
      axios.defaults.params.setting.timezone = moment.tz.guess()
      resolve(true)
    } catch (error) {
      console.error('[store-qsite]Error:: Store SET_AXIOS_TIMEZONE - ', error)
      reject(error)
    }
  })
}
