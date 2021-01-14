const moduleName = 'isite';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`

export default {
  urlBase : urlBase,
  version: moduleVersion,
  settings: `${urlBase}/settings`,
  configFields: `${urlBase}/fields`,
  appVersion: `${urlBase}/site/version`,
  siteSettings: `${urlBase}/site/settings`,
  permissions: `${urlBase}/site/permissions`,
  cacheClear: `${urlBase}/site/cache-clear`
}
