import { ref, onMounted, onBeforeUnmount, toRefs, watch, computed } from 'vue'
import { eventBus, store as storeUtil } from 'src/plugins/utils.ts'
import service from '../../../../services'
import { Ticker } from './interface'
import { tickerModel } from './models'
import store from '../../../../store'

export default function controller(props: any, emit: any) {

  const { apiRoute, permission, data, valueHidden } = toRefs(props)
  const { hasAccess } = storeUtil

  const refs = {
    isLoading: ref(true),
    isValueHidden: ref(true),
    ticker: ref<Ticker>({ ...tickerModel }),
  }

  const computeds = {
    havePermission: computed(() => {
      if (!permission.value) return true
      return hasAccess(permission.value)
    }),
    showValue: computed(() => {
      return valueHidden.value ? !refs.isValueHidden.value : true
    }),
  }

  const methods = {
    getData: async (refresh: boolean = false): Promise<Ticker> => {
      return await service.getQuickCardData(apiRoute.value, store.globalFilters, refresh)
    },
    hideValue: () => {
      refs.isValueHidden.value = !refs.isValueHidden.value
    }
  }

  onMounted(async () => {
    refs.isLoading.value = true
    if (permission.value && !hasAccess(permission.value)) {
      refs.isLoading.value = false
      return
    }
    if (apiRoute.value) {
      refs.ticker.value = await methods.getData()
    } else if (data.value) {
      refs.ticker.value = data.value
    }
    refs.isLoading.value = false

    eventBus.on('crud.data.refresh', async () => {
      refs.isLoading.value = true
      if (apiRoute.value) {
        refs.ticker.value = await methods.getData(true)
      }
      refs.isLoading.value = false
    })
  })

  onBeforeUnmount(() => {
    eventBus.off('crud.data.refresh')
  })

  watch(() => store.globalFilters, async (): Promise<void> => {
    refs.isLoading.value = true
    if (apiRoute.value && computeds.havePermission.value) {
      refs.ticker.value = await methods.getData()
    }
    refs.isLoading.value = false
  }, { deep: true })

  return {...refs, ...methods, ...computeds }
}
