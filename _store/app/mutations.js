export const RESET = (state) => {
  state.settings = [];
  state.modules = {};
  state.availableLocales = [];
  state.availableThemes = [];
  state.selectedLocales = [];
  state.defaultLocale = '';
  state.filters = {};
  state.configs = [];
  state.logo = null;
};

export function SET_SITE_SETTINGS(state, data) {
  state.settings = data;

  //SET_AVAILABLE_LOCALES
  const locales = data.find(e => e?.systemName == 'isite::locales')
  state.availableLocales = locales.plainValue ?? locales.default;
  state.selectedLocales = state.availableLocales

  //SET_DEFAULT_LOCALE
  const locale = data.find(e => e?.systemName == 'isite::defaultLocale')
  state.defaultLocale = locale.plainValue ?? locales.default;

  //Set module data
  const modules = [...new Set(data.map(item => item.systemName.split('::')[0]))]
  state.modules = modules.reduce((acc, key) => {
    acc[key] = { title: key, alias: key };
    return acc;
  }, {});

  //set site logo
  let logoIadmin = data.find(e => e.systemName == 'isite::logoIadmin')
  if(logoIadmin.files.mainimage.path.includes('default')) logoIadmin = data.find(e => e.systemName == 'isite::logo1')
  state.logo = logoIadmin?.files.mainimage.url ?? null;
}

export function SET_DEFAULT_LOCALE(state, data) {
  state.defaultLocale = data;
}

export function SET_PAGES(state, data) {
  state.pages = data;
}
export function SET_IP_ADDRESS(state, data) {
  state.ipAddress = data;
}
export function SET_MENU(state, data) {
  state.menu = data;
}

export function LOAD_PAGE(state, data) {
  state.loadPage = data
}

export function SET_BASE_URL(state, data) {
  state.baseUrl = data
}

export function SET_ORIGIN_URL(state, data) {
  state.originURL = data
}

export function SET_CURRENT_ROUTE(state, data) {
  state.currentRoute = data
}

export function SET_EXTRA(state, data) {
  state.extra = data
}

export function SET_SITE_HOOKS(state, data) {
  //Init hooks data
  state.hooks = []
  //Set to hook data to state
  Object.values(data).forEach(item => {
    if (item && Array.isArray(item) && item.length) state.hooks = state.hooks.concat(item)
  })
}

export function SET_MODULE_CONFIGS(state, data) {
  state.configs = data
}
