const moduleName = 'isite';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

const moduleNameSetting = 'isetting';
const moduleVersionSetting = 'v1';
const urlBaseSetting = `/${moduleNameSetting}/${moduleVersionSetting}`

const moduleNameCore = 'icore';
const moduleVersionCore = 'v1';
const urlBaseCore = `/${moduleNameCore}/${moduleVersionCore}`

export default {
  urlBase: urlBase,
  version: moduleVersion,
  settings: `${urlBase}/settings`,
  configs: `${urlBaseCore}/configs`,
  appVersion: `${urlBase}/site/version`,
  siteSettings: `${urlBaseSetting}/settings/get/all`,
  settingsSet: `${urlBaseSetting}/settings/set`,
  permissions: `${urlBase}/configs`,
  cacheClear: `${urlBase}/site/cache-clear`,
  export: `${urlBase}/export`,
  recommendations: `${urlBase}/recommendations`,
  icruds: `${urlBase}/icruds`,
  organizations: `${urlBase}/organizations`,
  domains: `${urlBase}/domains`,
  categories: `${urlBase}/categories`,
  modulesInfo: `${urlBase}/configs/modules-info`,
  layouts: `${urlBase}/layouts`,
  logs: `${urlBase}/logs`,
  synchronizables: `${urlBase}/synchronizables`,
  generateFile: `${urlBase}/synchronizables/generate-spread-sheet`,
  sync: `${urlBase}/synchronizables/sync`,
  bulkActions: `${urlBase}/bulk-actions`,
  favourites: `${urlBase}/favourites`,
  statuses: `${urlBase}/statuses`,
  contacts: `${urlBase}/contacts`,
  contactTypes: `${urlBase}/contact-types`,
  whatsapps: `${urlBase}/whatsapps`
}
