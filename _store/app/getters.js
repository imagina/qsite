import array from '@imagina/qsite/_plugins/array'
import helper from '@imagina/qsite/_plugins/helper'
import cloneDeep from 'lodash.clonedeep'

export const getExtra = (state) => (name) => {
  if (state.extra && state.extra[name]) return state.extra[name]
  return false
}

export const getState = (state) => (name) => {
  return cloneDeep(state[name] || undefined)
}

export const getMenu = (state) => {
  return state.menu
}
export const ipAddress = (state) => {
  return state.ipAddress
}

export const getSettings = (state) => {
  return state.settings;
};

export const getAvalaibleLocales = (state) => {
  return state.availableLocales;
};

export const getAvalaibleThemes = (state) => {
  return state.availableThemes;
};

export const getDefaultLocale = (state) => {
  return state.defaultLocale;
};

export const getSiteModulesInfo = (state) => {
  return state.siteModulesInfo;
};

export const availableLocalesSelect = (state) => {
  return array.select(state.availableLocales, {label: 'name', id: 'iso'});
};

export const availableLocalesTreeSelect = (state) => {
  let items = []
  state.availableLocales.forEach((locale, index) => {
    items.push({
      id: locale.iso,
      label: locale.name
    })
  })
  return items
};

export const availableThemesSelect = (state) => {
  return array.select(state.availableThemes, {label: 'name', id: 'name'});
};

export const availableThemesTreeSelect = (state) => {
  let items = []
  state.availableThemes.forEach(theme => {
    items.push({
      id: theme.name,
      label: theme.name
    })
  })
  return items
};

export const getSettingValueByName = (state) => (filter) => {
//Search and return the setting
  let response = state.settings.find(item => item.name == filter)
  //Intercept this setting t ever show the legacyStructure (temporally)
  if (filter == "isite::legacyStructureCMS") response = {value: 1}
  //Response
  return response ? response.value : undefined
};

export const getSettingMediaByName = (state) => (filter) => {
  let settings = state.settings
  let response = ''

  settings.forEach(item => {
    if (item.name == filter) response = item.media
  })

  return response
};

export const getSelectedLocalesSelect = (state) => {
  //Get labels formselected locales
  let languages = state.availableLocales.filter(item => state.selectedLocales.indexOf(item.iso) >= 0)
  let selectLanguages = array.select(languages, {label: 'name', id: 'iso'})
  selectLanguages.forEach((item, index) => {
    selectLanguages[index].label += ` (${item.value})`
  })
  //Return array select form selected languages
  return selectLanguages
};

export const getConfigApp = (state) => (path, getConfigByName = false) => {
  let response = state.configs
  let keys = path.toLowerCase().split(".")
  if (getConfigByName) {
    let allConfigs = {}
    for (const key in response) {
      allConfigs[key] = getConfigByPath(response[key], keys)
    }
    response = allConfigs;

  } else {
    response = getConfigByPath(response, keys)
  }
  //Response
  return response
}

//Parse the config object
function getConfigByPath(response, keys) {
  keys.forEach(key => {
    if (response) {
      //Search the next key as lowercase
      let nextKey = Object.keys(response).find(k => k.toLowerCase() === key)
      //Set the response
      response = response[nextKey];
    }
  })
  return response;
}
