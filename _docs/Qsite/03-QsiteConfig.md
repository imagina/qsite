# Qsite | Config
Here there is a `master/aplication` directory that contains the scripts necessary to load every configurations from the others modules.

:::note
Additionally, there is a master/extension directory. However, this is only a test to change the structure of the @imagina modules to load them as a [quasar-extension](https://quasar.dev/app-extensions/introduction).
:::

## Index

Instances every configuration from other modules and load it to call with global method `config()`:

- **app**: `config('app')`
- **apiRoutes**: `config('apiRoutes.{moduleName}.{routeName}')`
- **main**: `config('main')`
- **pages**: `config('pages')`
- **sidebar**: `config('sidebar')`
- **routes**: `config('routes')`
- **stores**: `config('stores')`

## APP

Here are the default project configurations. This configuration can be modified in [src/config/app](/docs/VueJs/configurations/ConfigSrc#config):

- **version**: The version number shown in the config drawer as a reference to the project version. By default, it obtains the version from the package version of the `qsite` module.
- **mode**: This option allows you to change the way the project is loaded, toggling between `ipanel` and `iadmin`. By default, it checks the current URL for the respective mode; otherwise, it loads as `iadmin`.
- **validateModeAccess**: This option defines whether the [core-middleware](/docs/VueJs/modules/QSite/QsiteBoot#core-middleware) should check on each route if the user has access to the project mode.
- **languages**: This option defines the default and available languages for the project. It can be replaced by `site-settings`.
- **modules**: This is an essential attribute because it lists the module names that `qsite` should load. Any new module should be added here.
- **saveCache**: This option defines the keys from the cache (indexedDB) that should be saved after project events like `refresh` and `logout`.

## ApiRoutes

Instances every apiRoute configuration from each module to call in the `config('apiRoutes')` method.

## Main

Instances every main configuration from each module to call in the `config('main')` method.

## Pages

Instances every pages configuration from each module by project mode (iadmin or ipanel) to create only one object to call `config('pages')` method.

## Routes

Get the `config.pages` object to load as [vue-route project](/docs/VueJs/configurations/ConfigSrc#router).

## Sidebar

Instances every sidebar configuration from each module by project mode (iadmin or ipanel) to create only one object and load the sidebar project.

## Stores

Instances every store configuration from each module to load as [store-project (Vuex)](/docs/VueJs/configurations/ConfigSrc#store).
