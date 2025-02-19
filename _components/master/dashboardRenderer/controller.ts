import { 
  computed, 
  reactive, 
  ref, 
  onMounted, 
  toRefs, 
  defineAsyncComponent, 
  markRaw,
  watch,
} from 'vue';
import { store as storeUtil, helper } from 'src/plugins/utils'
import { useRoute } from 'vue-router'
import service from './services'
import { Setting, View } from './interface'
import store from './store'

export default function controller(props: any, emit: any) {

  const route = useRoute()
  const refs = {
    settings: ref([])
  }

  const { dynamicFilterValues } = toRefs(props)
  
  const state = reactive<{ views: View[] }>({
    views: [],
  })

  const computeds = {
    filters: computed(() => ({ 
      ...props.baseFilters, 
      ...props.dynamicFilterValues
    }))
  }

  const methods = {
    getDashboardElements: async (settings: Setting[]): Promise<View[] | []> => {
      if (!settings) return []
      const { hasAccess } = storeUtil

      return Promise.all(settings.flatMap(quickCard => {
        const { type, permission } = quickCard
        if (!type) return []
        if (permission && !hasAccess(permission)) return []
        return {
          component: markRaw(defineAsyncComponent(() => import(`./views/${type}`))),
          ...quickCard
        }
      }))
    },
  }

  onMounted(async () => {
    const { module, entity } = helper.getInfoFromPermission(route?.meta?.permission) || {}
    store.globalFilters = computeds.filters.value
    if (props.configName) {
      refs.settings.value = await service.getConfig(props.configName)
    } else {
      const configName = `${module}.config.quickCards.${entity}`
      refs.settings.value = await service.getConfig(configName)
    }

    const quickCards = await methods.getDashboardElements(refs.settings.value)
    state.views = quickCards
  })

  watch(dynamicFilterValues, () => {
    store.globalFilters = computeds.filters.value
  }, { deep: true })

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods }
}
