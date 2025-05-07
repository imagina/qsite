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
  state.siteModulesInfo = [];
};

export function SET_SITE_SETTINGS(state, data) {
  state.settings = data;
}

export function SET_AVAILABLE_LOCALES(state, data) {
  state.availableLocales = data;
}

export function SET_AVAILABLE_THEMES(state, data) {
  state.availableThemes = data;
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

export function SET_SELECTED_LOCALES(state) {
  //Search locale settigns
  let locales = state.settings.find(item => item.name == 'core::locales');
  locales = locales ? locales.value : [];

  //Validate if there is selected locales, and set defaultLocale if not exist
  if (!locales.length) locales = [state.defaultLocale]

  //Set locales to state. sort
  state.selectedLocales = locales.sort();
}

export function SET_DEFAULT_LOCALE(state, data) {
  state.defaultLocale = data;
}

export function SET_MODULES_DATA(state, data) {
  state.modules = data;
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

export function SET_SITE_LOGO(state, data) {
  state.logo = data;
}

export function SET_SITE_MODULES_INFO(state, data) {
  state.siteModulesInfo = data;
}
