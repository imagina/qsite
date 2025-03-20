import {
  computed,
  ref, 
  onMounted, 
  toRefs, 
  watch, 
  onBeforeUnmount, 
  provide 
} from 'vue';
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  PieChart, 
  GraphChart, 
  MapChart, 
  BarChart, 
  LineChart 
} from 'echarts/charts'
import { THEME_KEY } from 'vue-echarts'
import service from '../../services'
import { eventBus } from 'src/plugins/utils.ts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GridComponent,
  ToolboxComponent
} from 'echarts/components'
import store from '../../store'

export default function controller(props: any, emit: any) {

  use([
    CanvasRenderer,
    PieChart,
    GraphChart,
    MapChart,
    BarChart,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    GridComponent,
    ToolboxComponent,
  ])

  const { apiRoute, data, header } = toRefs(props)

  const refs = {
    options: ref<any>({}),
    isLoading: ref(true),
    chartRef: ref<any>(null),
  }

  const computeds = {
    thereAreData: computed(() => (
      refs.options.value?.series && refs.options.value?.series[0]?.data.length
    ))
  }

  const methods = {
    getData: async (refresh: boolean = false) => {
      return await service.getQuickCardData(apiRoute.value, store.globalFilters, refresh)
    },
    reloadData: async () => {
      refs.isLoading.value = true
      if (apiRoute.value) {
        refs.options.value = await methods.getData()
      } else refs.options.value = data.value
      refs.isLoading.value = false
    },
    downloadChart: () => {
      if (refs.chartRef.value) {
        const chartInstance = refs.chartRef.value.chart
        const title = refs.options.value?.header?.title || header.value?.title
        const nameImage = title.replace(/\s+/g, '-').toLowerCase()
        const EXTENSION = 'png'
        const BACKGROUND_COLOR = '#fff'
      
        const dataURL = chartInstance.getDataURL({
          type: EXTENSION,
          pixelRatio: 2,
          backgroundColor: BACKGROUND_COLOR,
          excludeComponents: ['toolbox'],
        })
    
        const link = document.createElement('a')
        link.href = dataURL
        link.download = `${nameImage}.png`
        link.click()
      }
    }
  }

  const tools = [
    {
      name: 'download',
      icon: 'fa-regular fa-arrow-down-to-line',
      action: methods.downloadChart,
    },
  ]

  onMounted(async () => {
    refs.isLoading.value = true
    if (apiRoute.value) {
      refs.options.value = await methods.getData()
    } else refs.options.value = data.value
    refs.isLoading.value = false
  
    eventBus.on('crud.data.refresh', async () => {
      refs.isLoading.value = true
      if (apiRoute.value) refs.options.value = await methods.getData(true)
      refs.isLoading.value = false
    })
  })

  onBeforeUnmount(() => {
    eventBus.off('crud.data.refresh')
  })

  provide(THEME_KEY, 'light')

  watch(() => store.globalFilters, async (): Promise<void> => {
    refs.isLoading.value = true
    if (apiRoute.value) refs.options.value = await methods.getData()
    refs.isLoading.value = false
  }, {deep: true})

  return { ...refs, ...computeds, ...methods, tools }
}
