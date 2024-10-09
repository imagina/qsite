import { ref, onMounted, onBeforeUnmount, toRefs, watch, inject } from 'vue'
import { eventBus, store as storeUtil } from 'src/plugins/utils.ts'
import service from '../../../../services'
import { Ticker } from './interface'
import { tickerModel } from './models'

export default function controller(props: any, emit: any) {

  const { apiRoute, permission, data, filters } = toRefs(props)
  const { hasAccess } = storeUtil
  const INTERVAL_TIME = 10000

  const refs = {
    isLoading: ref(true),
    ticker: ref<Ticker>({ ...tickerModel }),
  }

  const methods = {
    getData: async (): Promise<Ticker> => {
      return await service.getQuickCardData(apiRoute.value, filters.value)
    }
  }

  onMounted(async () => {
    refs.isLoading.value = true
    if (apiRoute.value && permission.value && hasAccess(permission.value)) {
      refs.ticker.value = await methods.getData()
    } else if (data.value) {
      refs.ticker.value = data.value
    }
    refs.isLoading.value = false

    // intervalId.value = setInterval(async () => {
    //   if (apiRoute.value) await getData(false)
    // }, INTERVAL_TIME)

    eventBus.on('crud.data.refresh', async () => {
      refs.isLoading.value = true
      if (apiRoute.value && permission.value && hasAccess(permission.value)) {
        refs.ticker.value = await methods.getData()
      }
      refs.isLoading.value = false
    })
  })

  onBeforeUnmount(() => {
    eventBus.off('crud.data.refresh')
  })

  watch(filters, async (): Promise<void> => {
    refs.isLoading.value = true
    if (apiRoute.value && permission.value && hasAccess(permission.value)) {
      refs.ticker.value = await methods.getData()
    }
    refs.isLoading.value = false
  }, { deep: true })

  return {...refs, ...methods }
}