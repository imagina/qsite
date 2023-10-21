import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Quasar from 'quasar'
import * as moment from 'moment'
import cache from '@imagina/qsite/_plugins/cache'
import helper from '@imagina/qsite/_plugins/helper'

// i18n data
import customFormats from '@imagina/qsite/_i18n/master/formats/customFormats'
import numberFormats from '@imagina/qsite/_i18n/master/formats/currencyFormats'
import dateTimeFormats from '@imagina/qsite/_i18n/master/formats/dateTimeFormats'
import messagesLocal from '@imagina/qsite/_i18n/JsonLocal/i18n.json'

Vue.use(VueI18n)

export default async ({router, app, Vue, store, ssrContext}) => {
  //Request messages
  const useLocalTranslations = config('app.useLocalTranslations')
  const messagesServer = useLocalTranslations ? {} : await store.dispatch('qtranslationMaster/GET_TRANSLATIONS', {refresh: false})
  let messages = useLocalTranslations ? messagesLocal : messagesServer
  //===== Get default language
  //From URL
  let defaultLanguage = helper.getLocaleRoutePath(ssrContext ? ssrContext.url : window.location.hash)
  //From Cache
  if (!defaultLanguage) defaultLanguage = await cache.get.item('site.default.locale')
  //From VUEX Store or Config APP
  if (!defaultLanguage) defaultLanguage = store.state.qsiteApp.defaultLocale || config('app.languages.default')

  //====== Config i18n and set instance i18n
  app.i18n = new VueI18n({
    locale: defaultLanguage,
    fallbackLocale: defaultLanguage,
    formatter: new customFormats(),
    numberFormats,
    dateTimeFormats,
    silentTranslationWarn: true,
    messages
  })
  //===== Change language to quasar components
  await store.dispatch('qsiteApp/SET_LOCALE', {
    locale: defaultLanguage,
    ssrContext: ssrContext,
    vue: app
  })

  //===== Customs short-keys to locales

  //Currency translate
  Vue.prototype.$trc = (num, lang) => {
    return app.i18n.n(num, 'currency', lang)
  }
  //number translate
  Vue.prototype.$trn = (num, type) => {
    if (type == 'percent') num /= 100 //Divide Percent
    return type ? app.i18n.n(num, type) : app.i18n.n(num)
  }
  //Singular translate
  Vue.prototype.$tr = (key, params = {}) => {
    return app.i18n.tc(key, 1, params)
  }
  //Plural translate
  Vue.prototype.$trp = (key, params = {}) => {
    return app.i18n.tc(key, 2, params)
  }
  //Date translate
  Vue.prototype.$trd = (date, params = {type: 'short', fromUTC: false}) => {
    //Transform date from UTC
    if (params.fromUTC) date = moment(date).local().format('YYYY-MM-DD HH:mm:ss')
    //Repsonse
    return app.i18n.d(moment(date, 'YYYY-MM-DD HH:mm:ss').toDate(), params.type)
  }
  //Date translate
  Vue.prototype.$trdT = (date, format = 'MMMM, DD, YYYY HH:mm') => {
    //Transform date from UTC
    return moment(date).format(format);
  }

}
