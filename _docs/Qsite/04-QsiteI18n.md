# Qsite | I18n

There is a `master` directory that contains the main configuration to load [quasar-internationalization](https://quasar.dev/options/app-internationalization#introduction) according to [vue-i18n](https://kazupon.github.io/vue-i18n/introduction.html).

## Index

- **loadCoreTranslations**: Instances global translations from `qsite/_i18n/master/{lang}` to use with the prefix `ui`. For example: `$tr('ui.label.day')`.
- **loadModulesTranslations**: Instances translations from every module to use with the prefix `moduleName`. For example: `$tr('qsite.layout.login')`.

## Formats

- **CustomFormat**: A custom method to format i18n according to the [documentation](https://kazupon.github.io/vue-i18n/guide/formatting.html#custom-formatting).

- **CurrencyFormat**: Defines the number format to use on parameter type according to [number-format-i18n](https://kazupon.github.io/vue-i18n/guide/number.html#custom-formatting). For example: `$trc(1500, {type: 'currency'})`.

- **DateTimeFormats**: Defines the date format to use on parameter `type` according to [date-format-i18n](https://kazupon.github.io/vue-i18n/guide/datetime.html). For example: `$trd('2020-01-01 16:00:00', {type: 'time'})`.

## Master/{Lang}/ui
Instances the global translations for the project.
