import alert from '@imagina/qsite/_plugins/alert'
import array from '@imagina/qsite/_plugins/array'
import date from '@imagina/qsite/_plugins/date'
import helper from '@imagina/qsite/_plugins/helper'
import cache from '@imagina/qsite/_plugins/cache'
import crud from '@imagina/qcrud/_services/baseService'
import lodash from 'lodash'
import moment from 'vue-moment'
import Vuelidate from 'vuelidate'
import {uid} from 'quasar'
import {openURL} from 'quasar'
import eventBus from '@imagina/qsite/_plugins/eventBus'
import filter from '@imagina/qsite/_plugins/filter'
import VueSignaturePad from 'vue-signature-pad';

export default function ({app, router, store, Vue, ssrContext}) {
  Vue.prototype.$alert = alert
  Vue.prototype.$array = array
  Vue.prototype.$date = date
  Vue.prototype.$helper = helper
  Vue.prototype.$cache = cache
  Vue.prototype.$lodash = lodash
  Vue.prototype.$clone = (dataToClone) => {
    return lodash.cloneDeepWith(dataToClone, value => {
      //Not clone File or Blob  type
      if (value instanceof File || value instanceof Blob) {
        return value
      }
    })
  }
  Vue.prototype.$crud = crud
  Vue.prototype.$openUrl = openURL
  Vue.prototype.$eventBus = eventBus
  Vue.prototype.$filter = filter
  Vue.prototype.$auth = {
    hasAccess: (can, params) => {
      return store.getters['quserAuth/hasAccess'](can, params)
    },
    hasSetting: (name) => {
      return store.getters['quserAuth/hasSetting'](name)
    },
  }
  Vue.prototype.$uid = uid
  Vue.use(moment)
  Vue.use(Vuelidate)
  Vue.use(VueSignaturePad)
}
