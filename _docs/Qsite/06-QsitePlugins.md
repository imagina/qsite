# Qsite | Plugins

## Alert

You can use two Quasar plugins, [Notify](https://v1.quasar.dev/quasar-plugins/notify) and [Dialog](https://v1.quasar.dev/quasar-plugins/dialog), to display messages on your project's UI.

There are default types configurations with colors and icons to show alerts: `[success, error, info, warning, light, dark]`. For example:

```js
this.$alert.success('This is a message...')
```
- When you call the plugin with only a `string` parameter, the plugin uses the default attributes. Default attributes include:
```js
{
  progress: true,
  pos: 'bottom-right',
  timeOut: 4000,
  actions: [],
  textColor: 'white'
}
```
- To change any attribute, the parameter should be an `object`. For example:
```js
this.$alert.info({
  message: this.$tr('ui.message.swUpdateAvailable'),
  pos: 'top',
  icon: 'fas fa-cloud-download-alt',
  timeOut: 15000,
  actions: [
    {
      label: 'Ok',
      icon: '',
      color: 'white',
      handler: () => window.location.reload(true)
    }
  ],
})
```
- To change an alert from `Notify` to `Dialog`, add the attribute `mode: 'modal'` to the parameter. For example:
```js
this.$alert.warning({ mode: 'modal', message: 'This is a message...', title: 'Title' })
```

## Array

You can use these helper methods with arrays using `this.$array.{method}()`.

| Methods | Description |
| ------- | ----------- |
| `buildTree(array, parentId, fields)` | Orders the array as a tree structure. |
| `select(array, fields)` | Orders the array as [quasar-select-format](https://quasar.dev/vue-components/select) options. |
| `parents(array, id, fields)` | Gets the parents of an element by its ID from the array. |
| `children(array, id, fields)` | Gets the children of an element by its ID from the array. |

## Cache

You can use [indexedDB](https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API/Using_IndexedDB) and [Localforage](https://localforage.github.io/localForage/) technologies to save local cache and access global methods using `this.$cache.{method}()`.

| Methods | Description |
| ------- | ----------- |
| `set(key, data)` | Create or update data in the cache. |
| `get.item(key)` | Return data from the cache by key. |
| `get.items(items)` | Return data from the cache by an `array` of keys. |
| `get.all()` | Return all data from the cache. |
| `remove(key)` | Remove data from the cache by key. |
| `keys()` | Return all keys from the cache. |
| `clear()` | Clear all cache. |

## Date

You can use helper methods for handling dates using `this.$date.{method}()`.

| Methods | Description |
| ------- | ----------- |
| `timestamp(date)` | Convert a date to a timestamp. |
| `getHumanCalendar(date)` | Return a human-readable date difference from the current date. Possible values include `[sameDay, nextDay, lastDay, lastWeek, sameElse]`. |

## EventBus

A new Vue instance is provided to use [vue-events](https://es.vuejs.org/v2/guide/components-custom-events.html) in your project. You can access it using `this.$eventBus.$emit`, `this.$eventBus.$on`, and `this.$eventBus.$off`.

## Filter

The Filter class is used to manage filters and is typically used with the `masterFilter` component.

### Initialize

To initialize this class, you should call the `setFilter` method:

```javascript
await this.$filter.setFilter({
  name: this.$route.name,
  fields: { array fields with the format of dynamic-field },
  callBack: () => {
    // This method is called with every change on the class
  }
})
```
### Attributes
The Filter class provides several attributes for accessing filter information:
- **Values**: `this.$filter.values`, Use this attribute to retrieve all values from the filter.
- **Pagination**: `this.$filter.pagination`, If the filter also manages pagination, this attribute contains relevant pagination data.

### Manage Data
To manage data within the filter, you can use the following two methods:

- **Values**: `this.$filter.addValues({ itemName: 'value-item' })`, This method allows you to create or update an item within the filter.
- **Pagination**: `this.$filter.setPagination({ page, rowsPerPage, lastPage })`, Use this method to edit pagination data within the filter.


## Helper

There are available helper methods to call in Vue using `this.$helper.{method}`.

| Method                                       | Description                                           |
| -------------------------------------------- | ----------------------------------------------------- |
| `maskPhone(string)`                          | Format strings-integer to phone format. Example: `(311) 111 - 1111` |
| `getInt(string)`                            | Get only integer values from a string.               |
| `getSlug(string)`                           | Return a string as a slug.                           |
| `getCurrentPosition()`                      | Get the navigator's position.                        |
| `convertStringToSnakeCase(string)`           | Convert a string to snake_case.                      |
| `toSnakeCase(object)`                       | Recursive method to convert object keys to snake_case. |
| `map(string)`                               | Open a new window to show Google Maps with the provided address parameter. |
| `validateEmail(string)`                     | Uses regex to check if a string has an email format. |
| `loadCDN(string)`                           | Load a CDN path in the project.                      |
| `addHistory()`                              | Add a fake item to the navigator's history.          |
| `backHistory()`                             | Go to the last item in the navigator's history.      |
| `copyToClipboard(string)`                   | Copy a string to the clipboard.                      |
| `getBase64(file)`                          | Get base64 data from a file.                         |
| urlToFile(url`string`, filename`string`, mimeType`string`) | Convert a URL (base64) to a file object.      |
| getUrlParamByName(name`string`, url`string`) | Get a query parameter from a URL. If the URL parameter is not specified, it gets the current URL. |
| downloadFromURL(url`string`)                | Download from a URL. Should be in `HTTPS` protocol to work. |
| formatBytes(bytes`integer`)                | Transform bytes value to a human-readable format.    |
| playSound({ url, volume } `object`)         | Play a sound in the project.                         |

## Hook

The Laravel Modules can instance a config named `frontendHooks`. This config is requested by `base-quasar` to define hooks in the project. This plugin manages these actions in the front-end and makes requests according to parameters. For example:

```js
this.$hook.dispatchEvent('wasCreated', { entityName: config('main.qad.entityNames.ad') })
```
:::info
Every crud pages are `dispatch` this hooks
:::
- **getEventNames**: Instance every event name available by entity `isCreating`, `wasCreated`, `isUpdating`, `wasUpdated` and `wasDeleted`.
- **dispatchEvent**: Search in Store(Vuex) if entity event hook request is available and make the request with the endpoint in this hook.

This process allow to backend add a request response [request-message](/docs/VueJs/modules/QSite/QsiteBoot#core-axios), to axios intercept and show as [alert](/docs/VueJs/modules/QSite/QsitePlugins#alert).

## Remember
Save some action data for a definite time, if this time expires run the action. eg:

```js
remember.async({
  key: 'rememberSaveRequest',//Key to save data in cache
  seconds: 1600,//Secons to save action data
  refresh: false,//Force to refresh action
  callBack: () => {//Call when the time expires
    return new Promise(async (resolve, reject) => {
      await axios.get(urlApi, {params: params.params}).then(response => {
        resolve(response)//Response
      }).catch(error => {
        console.error('[base-service-index-callback]Error::', error)
        reject(error.response)//Response
      })
    })
  }
}).then(response => resolve(response)).catch(error => {
  console.error('[base-service-index]Error::', error)
  reject(error)
})
```

## CKEditorPLugins
Contains the plugins code to [vue-ckeditor](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_vue.html) and use it on [ckEditorComponent](/docs/VueJs/Components/ckEditor)

- **collapsibleItem**: Plugin to add collapsable bootstrap item.