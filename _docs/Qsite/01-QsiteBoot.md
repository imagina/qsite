# Qsite | Boot Files
Here are the `boot` files according to `Quasar` [documentation](https://quasar.dev/quasar-cli/boot-files#introduction) to manage all boot actions of project. all these files already are included on [quasar.conf](/docs/VueJs/configurations/otherconfig#quasarconf) of project.

## Core-Axios
Configure all related with [axios](https://github.com/axios/axios) to the project:
- **Set base Url**: Instance the base URL to all request used with axios. Then if exist `config.app.baseUrl` will be set it as base url to axios, otherwise it well be obtained from `window.location` to define this attribute.
- **Response interceptors**: Intercep all responses from axios and do the following actions:
    - **401 Status**: Any response with this status, will be result on a redirect to `auth.logout` and close the current session.
    - **data.messages**: Any response with this content having [alert-format](/docs/VueJs/modules/QSite/QsitePlugins#alert), Show a one or more alert message on project.

## Core-Server-Side
Request to backend the initial data to configure the project:
- Site settings
- Module configs
- Site Hooks

## Core-Client-Side
- Reset services worker to `pwa` mode.
- Load site colors to quasar from site ssettings.
- Restore extra data on Store from cache(indexedDB).

## Core-Middleware
Instance a [vue-router event beforeEach](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards) to do the global actions on every vue route:
- **checkBeare**: Search a `bearer` on current url to try auto-login on project with this token.
- **checkLogin**: Check if there is a session active, otherwise try to login with data `sessionData` from cache (indexcedDB).
- **historyPage**: History page handler, catch the back action and first close active modals on project instead of change page url.
- **closeModals**: This method is called from `historyPage` to search and close active modals on project. 
- **emitBackAction**: This method is called from `historyPage` to emit a local event if any part of project need catch this event, and prevent change current url.
- **validatedRoute**: Check everything necessary about the current vue route:
    - Active session if this not exist redirect to `auth.login`.
    - Page permission.
    - Validate if current user has permission to acces to project mode `iadmin` or `ipanel`.
    - Define correct redirect after the previous validations.
- **goToNextRoute**: Change to next vue-route.

## Core-Components
Instance every standard [project components](/docs/VueJs/Components) from qsite as global vue-components .

## Core-Helper
Every helper instance here are available to call on Vue as `this.$pluginName`.
- Instance every [qsite plugins](/docs/VueJs/modules/QSite/QsitePlugins) on Vue.
- Instance some [quasar-utilities](https://quasar.dev/quasar-utils/other-utils#introduction)
    - [$openUrl](https://quasar.dev/quasar-utils/other-utils#open-external-url)
    - [$uid](https://quasar.dev/quasar-utils/other-utils#generate-uid)
- Instance external plugins on Vue:
    - [$lodash](https://lodash.com/)
    - [$moment](https://momentjs.com/)
    - [vueSignaturablePad](https://github.com/neighborhood999/vue-signature-pad)

## Core-I18n
- Instance configuration to [quasar internationalization](https://quasar.dev/options/app-internationalization#introduction) from [master-i18n](/docs/VueJs/modules/QSite/QsiteI18n).
- Instance vue prototypes to help with translatable methods on Vue.
    - **$trc(num, lang)**: Currency
    - **$trn(num, type)**: Number
    - **$tr(key, params)**: Singular
    - **$trp(key, params)**: Plural
    - **$trd(date, params)**: Date. With extra parameter `fromUTC` transform the date from utc to local date before to format.